import { Mesh, RenderObject, Texture, vec2 } from "zogra-renderer";
import { Material2D } from "../material/2d";
import { Sprite } from "../rendering/sprite";
import { makeQuad } from "../utils/mesh";

export class SpriteObject extends RenderObject
{
    private mesh: Mesh = makeQuad();
    private material: Material2D = new Material2D();
    private _sprite: Sprite | null = null;

    constructor()
    {
        super();
        this.meshes[0] = this.mesh;
        this.materials[0] = this.material;
    }

    get sprite() { return this._sprite }
    set sprite(sprite: Sprite | null)
    {
        this._sprite = sprite;

        if (sprite)
        {
            this.material.texture = sprite.texture;
            this.mesh.uvs = [
                vec2(sprite.uvRect.xMin, sprite.uvRect.yMin),
                vec2(sprite.uvRect.xMax, sprite.uvRect.yMin),
                vec2(sprite.uvRect.xMax, sprite.uvRect.yMax),
                vec2(sprite.uvRect.xMin, sprite.uvRect.yMax),
            ];
            this.mesh.update();
        }
        else
        {
            this.material.texture = null;    
        }
    }

}