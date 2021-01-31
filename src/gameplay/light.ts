import { Entity, RenderObject, vec2, vec3 } from "zogra-renderer";
import { ProceduralLightMaterial } from "../material/2d-light";
import { makeQuad } from "../utils/mesh";

export class Light2D extends Entity
{
    enable: boolean = true;
    mesh = makeQuad();
    material = new ProceduralLightMaterial();

    private _size: number = 4;
    get size() { return this._size }
    set size(size: number)
    {
        this._size = size;
        this.localScaling = vec3(size, size, size);
    }


    get direction()
    {
        return this.material.lightDirection;
    }
    set direction(dir: vec2)
    {
        this.material.lightDirection = dir;
    }

    get halfAngle()
    {
        return this.material.lightAngle;
    }
    set halfAngle(rad: number)
    {
        this.material.lightAngle = rad;
    }
}