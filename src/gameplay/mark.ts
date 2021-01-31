import { RenderObject, vec2 } from "zogra-renderer";
import { floor2 } from "../utils/math";
import { Global } from "./global";
import { SpriteObject } from "./sprite-object";

export class Mark extends SpriteObject
{
    constructor()
    {
        super();

        this.sprite = Global().assets.mark;
    }

    static makeOnGround(pos: vec2, sync = false)
    {
        pos = floor2(pos).plus(vec2(.5));
        // console.log(`mark on ${pos}`);
        const mark = new Mark();
        mark.position = pos.toVec3(1);
        Global().scene.add(mark);
        if (sync)
            Global().session.setObj({
                type: "mark",
                pos: pos as number[] as [number, number]
            });
    }
}