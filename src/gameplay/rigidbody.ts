import { sup } from "*.png";
import { Entity, InputManager, Keys, mul, plus, RenderObject, Time, vec2 } from "zogra-renderer";

export class Rigidbody extends RenderObject
{
    velocity: vec2 = vec2.zero();

    constructor()
    {
        super();

        this.on("update", this.updatePhysics.bind(this));
    }

    private updatePhysics(self: Entity, time: Time)
    {


        this.position = plus(this.position, mul(this.velocity, time.deltaTime));
    }
}