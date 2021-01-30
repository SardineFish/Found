import { Blending, materialDefine, MaterialFromShader, Shader, shaderProp, Texture, vec2, Vector2 } from "zogra-renderer";
import vert from "../shader/tilemap-vert.glsl";
import frag from "../shader/tilemap-frag.glsl";

@materialDefine
export class TilemapMaterial extends MaterialFromShader(new Shader(vert, frag, {blend: [Blending.SrcAlpha, Blending.OneMinusSrcAlpha]}))
{
    @shaderProp("uMainTex", "tex2d")
    texture: Texture | null = null;

    @shaderProp("uAtlasSize", "vec2")
    atlasSize: Vector2 = vec2(1, 1);

}