import { Blending, DepthTest, materialDefine, MaterialFromShader, Shader, shaderProp, vec2 } from "zogra-renderer";
import vert from "../shader/2d-vert.glsl";
import fragLight from "../shader/procedual-light.glsl";
import fragBlit from "../shader/blit.glsl";

@materialDefine
export class ProceduralLightMaterial extends MaterialFromShader(new Shader(vert, fragLight, {
    depth: DepthTest.Disable,
    blend: [Blending.One, Blending.One],
    zWrite: false,
}))
{
    @shaderProp("uLightDirection", "vec2")
    lightDirection: vec2 = vec2.up();

    @shaderProp("uLightAngle", "float")
    lightAngle: number = Math.PI;
}

@materialDefine
export class LightComposeMaterial extends MaterialFromShader(new Shader(vert, fragBlit, {
    name: "BlitCopy",
    depth: DepthTest.Disable,
    blend: [Blending.DstColor, Blending.Zero],
    zWrite: false
}))
{

}