import vert from "../shader/2d-vert.glsl";
import frag from "../shader/2d-frag.glsl";
import { Blending, Color, materialDefine, MaterialFromShader, Shader, shaderProp, Texture } from "zogra-renderer";

@materialDefine
export class Material2D extends MaterialFromShader(new Shader(vert, frag, {
    blend: [Blending.SrcAlpha, Blending.OneMinusSrcAlpha],
}))
{
    @shaderProp("uColor", "color")
    color = Color.white;

    @shaderProp("uMainTex", "tex2d")
    texture: Texture | null = null;
}