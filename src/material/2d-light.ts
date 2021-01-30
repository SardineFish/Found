import { Blending, DepthTest, materialDefine, materialDefine, MaterialFromShader, Shader } from "zogra-renderer";
import vert from "../shader/2d-vert.glsl";
import fragLight from "../shader/procedual-light.glsl";
import fragBlit from "../shader/blit.glsl";

@materialDefine
export class ProceduralLightMaterial extends MaterialFromShader(new Shader(vert, fragLight))
{
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
