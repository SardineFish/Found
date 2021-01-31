import { RenderObject, Scene, Texture2D, vec2, vec3, Vector2 } from "zogra-renderer";
import playerImage from "../../assets/texture/tex.png";
import { Material2D } from "../material/2d";
import { SetObject, SyncData } from "../network/message";
import { GameSession } from "../network/session";
import { loadImage } from "../utils/load-image";
import { makeQuad } from "../utils/mesh";
import { Campfire } from "./campfire";
import { FlashLight } from "./flashlight";
import { Mark } from "./mark";

export class NetworkPlayer extends RenderObject
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
        const material = new Material2D();
        const texture = new Texture2D();
        texture.setData(await loadImage(playerImage));
        material.texture = texture;
        this.position.z = 1;

        this.materials[0] = material;
        this.meshes[0] = makeQuad();
        
        this.session.onSync = this.sync.bind(this);
        this.session.onSetObj = this.setObj.bind(this);
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