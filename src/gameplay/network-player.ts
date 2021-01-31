import { FilterMode, RenderObject, Scene, Texture2D, vec2, vec3, Vector2 } from "zogra-renderer";
import { Material2D } from "../material/2d";
import { SetObject, SyncData } from "../network/message";
import { GameSession } from "../network/session";
import { loadImage } from "../utils/load-image";
import { makeQuad } from "../utils/mesh";
import { Campfire } from "./campfire";
import { FlashLight } from "./flashlight";
import { Mark } from "./mark";
import { SpriteObject } from "./sprite-object";
import playerImg from "../../assets/texture/0x72_16x16DungeonTileset.v4.png";
import { Sprite } from "../rendering/sprite";
import { TextureFormat } from "zogra-renderer/dist/core/texture-format";

export class NetworkPlayer extends SpriteObject
{
    session: GameSession;
    flashlight: FlashLight;

    constructor(scene: Scene, session: GameSession)
    {
        super();

        this.flashlight = new FlashLight();
        scene.add(this.flashlight, this);
        this.session = session;

        this.init();
    }

    async init()
    {
        const img = await loadImage(playerImg);
        const texture = new Texture2D();
        texture.filterMode = FilterMode.Nearest;
        texture.format = TextureFormat.RGBA;
        texture.setData(img);
        this.sprite = new Sprite(texture, vec2(16, 16), vec2(4, 7));
    }

    sync(data: SyncData)
    {
        this.position = vec3(data.pos[0], data.pos[1], 3);
    }
    setObj(data: SetObject)
    {
        switch (data.type)
        {
            case "campfire":
                Campfire.spawn(vec2(data.pos[0], data.pos[1]));
                break;
            case "mark":
                Mark.makeOnGround(vec2(data.pos[0], data.pos[1]));
                break;
        }
    }
}