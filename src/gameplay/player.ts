import { Entity, FilterMode, InputManager, Keys, minus, mul, Scene, Texture2D, Time, vec2 } from "zogra-renderer";
import { Material2D } from "../material/2d";
import { Rigidbody } from "./rigidbody";
import { loadImage } from "../utils/load-image";
import { makeQuad } from "../utils/mesh";
import { Tilemap } from "../tilemap/tilemap";
import { GameSession } from "../network/session";
import { ItemName, ItemType } from "../map/map-generator";
import { craft as craftUI } from "../ui/craft";
import { Campfire } from "./campfire";
import { Global } from "./global";
import { Chest } from "./chest";
import { showLog } from "../ui/log";
import { updateTools as updateToolsUI } from "../ui/tools";
import { Mark } from "./mark";
import { FlashLight } from "./flashlight";
import { Sprite } from "../rendering/sprite";
import playerImg from "../../assets/texture/0x72_16x16DungeonTileset.v4.png";
import { TextureFormat } from "zogra-renderer/dist/core/texture-format";

export interface Tool
{
    type: ItemType;
    count: number;
    endure: number;
}

export class Player extends Rigidbody
{
    moveSpeed = 5;
    input: InputManager;
    session: GameSession;
    resources: Map<ItemType, number> = new Map();
    tools: Tool[] = [{type: ItemType.None, count: 0, endure: 1}];
    currentToolIdx: number = 0;
    facing: vec2 = vec2.down();
    flashlight: FlashLight;
    flashlightTool: Tool | null = null;

    constructor(scene: Scene, input: InputManager, tilemap: Tilemap, session: GameSession)
    {
        super(tilemap);
        this.input = input;
        this.session = session;
        this.flashlight = new FlashLight();
        this.flashlight.size = 30;
        this.flashlight.halfAngle = Math.PI / 6;
        scene.add(this.flashlight, this);

        this.on("update", this.update.bind(this));

        this.init();
        updateToolsUI(this.tools, this.currentToolIdx);
    }

    async init()
    {
        const img = await loadImage(playerImg);
        const texture = new Texture2D(img.width, img.height, TextureFormat.RGBA, FilterMode.Nearest);
        texture.setData(img);
        this.sprite = new Sprite(texture, vec2(16, 16), vec2(4, 7));
    }

    update(entity: Entity, time: Time)
    {

        const moveInput = vec2.zero();
        if (this.input.getKey(Keys.W) || this.input.getKey(Keys.Up))
            moveInput.y += 1;
        if (this.input.getKey(Keys.S) || this.input.getKey(Keys.Down))
            moveInput.y -= 1;
        if (this.input.getKey(Keys.A) || this.input.getKey(Keys.Left))
            moveInput.x -= 1;
        if (this.input.getKey(Keys.D) || this.input.getKey(Keys.Right))
            moveInput.x += 1;
        
        if (this.input.getKeyDown(Keys.W) || this.input.getKeyDown(Keys.Up))
            this.facing = vec2.up()
        if (this.input.getKeyDown(Keys.S) || this.input.getKeyDown(Keys.Down))
            this.facing = vec2.down();
        if (this.input.getKeyDown(Keys.A) || this.input.getKeyDown(Keys.Left))
            this.facing = vec2.left();
        if (this.input.getKeyDown(Keys.D) || this.input.getKeyDown(Keys.Right))
            this.facing = vec2.right();

        const mousePos = Global().camera.screenToWorld(this.input.pointerPosition).toVec2();
        
        if (this.input.getKeyDown(Keys.F2))
        {
            const x = 1;
        }
        moveInput.normalize();
        this.velocity = mul(moveInput, this.moveSpeed);
        

        this.session.sendSync({
            pos: this.position.toVec2() as number[] as [number, number],
            velocity: this.velocity as number[] as [number, number],
            flashlight: this.flashlight.enable,
            flashlightDir: this.flashlight.direction as number[] as [number, number],
        });

        if (this.input.getKeyDown(Keys.C))
        {
            this.craft();
        }
        else if (this.input.getKeyDown(Keys.E))
        {
            this.useTool(this.position.toVec2());
        }
        else if (this.input.getKeyDown(Keys.Mouse0))
        {
            const pos = Global().camera.screenToWorld(this.input.pointerPosition).toVec2();
            if (minus(pos, this.position.toVec2()).magnitude < 1.6)
                this.useTool(pos);
        }
        if (this.input.wheelDelta > 0)
        {
            this.currentToolIdx = (this.currentToolIdx + 1) % this.tools.length;
            updateToolsUI(this.tools, this.currentToolIdx);
        }
        else if (this.input.wheelDelta < 0)
        {
            this.currentToolIdx = (this.currentToolIdx - 1 + this.tools.length) % this.tools.length;
            updateToolsUI(this.tools, this.currentToolIdx);
        }

        if (this.flashlight.enable)
        {
            const lifetime = 20; // seconds
            this.flashlight.enable = this.reduceEndure(ItemType.Flashlight, 1 / lifetime * time.deltaTime);
        }
        this.flashlight.direction = minus(mousePos, this.position.toVec2()).normalized;
    }

    async craft()
    {
        const item = await craftUI(this.resources);
        switch (item)
        {
            case ItemType.Campfire:
                Campfire.spawn(this.position.toVec2(), true);
                break;
            case ItemType.Flashlight:
                this.addTool(ItemType.Flashlight);
                break;
            case ItemType.Pickaxe:
                this.addTool(ItemType.Pickaxe);
                break;
            case ItemType.Radio:
                this.addTool(ItemType.Radio);
                break;
        }
    }

    private reduceEndure(type: ItemType, amount: number): boolean
    {
        for (const tool of this.tools)
        {
            if (tool.type == type)
            {
                tool.endure -= amount;
                if (tool.endure <= 0)
                {
                    tool.count--;
                    if (tool.count <= 0)
                    {
                        this.tools = this.tools.filter(t => t !== tool);
                        this.currentToolIdx %= this.tools.length;
                        updateToolsUI(this.tools, this.currentToolIdx);
                        showLog(`[${ItemName[tool.type]}] 用完惹...`);
                        return false;
                    }
                    else
                    {
                        showLog(`消耗 [${ItemName[tool.type]}] x1`);
                        tool.endure = 1;
                    }
                }
                updateToolsUI(this.tools, this.currentToolIdx);
                return true;
            }
        }
        return false;
    }

    private getTool(type: ItemType)
    {
        for (const tool of this.tools)
        {
            if (tool.type == type)
                return tool;    
        }
        return null;
    }

    private addTool(type: ItemType)
    {
        let tool = this.getTool(type);
        showLog(`获得 [${ItemName[type]}] x1`);
        if (!tool)
        {
            tool = {
                type: type,
                count: 1,
                endure: 1
            };
            this.tools.push(tool);
        }
        else
        {
            tool.count++;
        }
        updateToolsUI(this.tools, this.currentToolIdx);
    }

    private useTool(pos: vec2)
    {
        const chunk = Global().chunksManager.getChunkAt(this.position.toVec2());
        for (const chest of chunk.chests)
        {
            const dir = minus(chest.position, this.position).toVec2();
            const distance = dir.magnitude;
            if (distance < 1 || (distance <= 2 && dir.dot(this.facing) >= 0.5))
            {
                console.log(`open chest at ${distance}`);
                this.openChest(chest);
                return;
            }
        }

        const use = (tool: Tool) =>
        {
            tool.count--;
            if (tool.count <= 0)
            {
                this.tools = this.tools.filter(t => t !== tool);
                this.currentToolIdx = 0;
            }
            updateToolsUI(this.tools, this.currentToolIdx);
        };

        const tool = this.tools[this.currentToolIdx];
        switch (tool.type)
        {
            case ItemType.Paint:
                Mark.makeOnGround(pos, true);
                use(tool);
                break;
            case ItemType.Pickaxe:
                break;
            case ItemType.Flashlight:
                this.flashlight.enable = !this.flashlight.enable;
                break;
        }
    }

    private openChest(chest: Chest)
    {
        const items = chest.open();
        for (const itemType of items)
        {
            switch (itemType)
            {
                case ItemType.Battery:
                case ItemType.Glass:
                case ItemType.Iron:
                case ItemType.PCB:
                case ItemType.Petrol:
                case ItemType.Wire:
                case ItemType.Wood:
                    const number = this.resources.get(itemType) || 0;
                    this.resources.set(itemType, number + 1);
                    showLog(`获得 [${ItemName[itemType]}] x1`);
                    break;
                case ItemType.Flashlight:
                case ItemType.Paint:
                case ItemType.Pickaxe:
                case ItemType.Radio:
                    this.addTool(itemType);
                    break;
            }
        }
    }
}