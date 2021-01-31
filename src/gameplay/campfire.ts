import { vec3 } from "zogra-renderer";
import { Global } from "./global";
import { Light2D } from "./light";

export class Campfire extends Light2D
{
    constructor()
    {
        super();
        this.size = 20;
    }
    static spawn(pos: vec3)
    {
        const campfire = new Campfire();
        campfire.position = pos.clone();
        Global().scene.add(campfire);
    }
}