import { Entity, RenderObject, vec3 } from "zogra-renderer";
import { ProceduralLightMaterial } from "../material/2d-light";
import { makeQuad } from "../utils/mesh";

export class Light2D extends Entity
{
    mesh = makeQuad();
    material = new ProceduralLightMaterial();

    private _size: number = 4;
    get size() { return this._size }
    set size(size: number)
    {
        this._size = size;
        this.localScaling = vec3(size, size, size);
    }

}