import { vec2 } from "zogra-renderer";
import { Light2D } from "./light";

export class FlashLight extends Light2D
{
    enable: boolean = false;
    constructor()
    {
        super();
    }
}