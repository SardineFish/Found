import { RenderObject, Texture2D, vec3 } from "zogra-renderer";
import playerImage from "../../assets/texture/tex.png";
import { Material2D } from "../material/2d";
import { SyncData } from "../network/message";
import { GameSession } from "../network/session";
import { loadImage } from "../utils/load-image";
import { makeQuad } from "../utils/mesh";

export class NetworkPlayer extends RenderObject
{
    session: GameSession;

    constructor(session: GameSession)
    {
        super();

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
    }

    sync(data: SyncData)
    {
        this.position = vec3(data.pos[0], data.pos[1], 3);
    }
}