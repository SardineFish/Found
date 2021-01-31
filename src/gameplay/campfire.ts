import { vec2, vec3 } from "zogra-renderer";
import { Global } from "./global";
import { Light2D } from "./light";

export class Campfire extends Light2D
{
    constructor()
    {
        super();
        this.size = 20;
    }
    static spawn(pos: vec2, sync = false)
    {
        const campfire = new Campfire();
        campfire.position = pos.toVec3(1);
        Global().scene.add(campfire);
        if (sync)
            Global().session.setObj({
                pos: pos as number[] as [number, number],
                type: "campfire"
            });
    }
}