import { Entity, InputManager, Keys, minus, mul, Texture2D, Time, vec2 } from "zogra-renderer";
import { Material2D } from "../material/2d";
import { Rigidbody } from "./rigidbody";
import playerImage from "../../assets/texture/tex.png";
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
    tools: Tool[] = [];
    currentToolIdx: number = 0;
    facing: vec2 = vec2.down();

    constructor(input: InputManager, tilemap: Tilemap, session: GameSession)
    {
        super(tilemap);
        this.input = input;
        this.session = session;

        this.on("update", this.update.bind(this));

        this.init();
    }

    async init()
    {
        const material = new Material2D();
        const texture = new Texture2D();
        texture.setData(await loadImage(playerImage));
        material.texture = texture;
        this.position.z = 1;

        this.materials[0] = material;
        this.meshes[0] = makeQuad();
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
        
        if (this.input.getKeyDown(Keys.F2))
        {
            const x = 1;
        }
        moveInput.normalize();
        this.velocity = mul(moveInput, this.moveSpeed);
        

        this.session.sendSync({
            pos: this.position,
            velocity: this.velocity
        });

        if (this.input.getKeyDown(Keys.C))
        {
            this.craft();
        }
        else if (this.input.getKeyDown(Keys.E))
        {
            this.useTool();
        }
    }

    async craft()
    {
        const item = await craftUI(this.resources);
        switch (item)
        {
            case ItemType.Campfire:
                Campfire.spawn(this.position);
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
    }

    private useTool()
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