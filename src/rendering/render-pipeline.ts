import { Camera, Color, DebugLayerRenderer, mat4, Material, RenderContext, RenderData, RenderOrder, RenderTexture, vec3, ZograRenderPipeline } from "zogra-renderer";
import { RenderTarget } from "zogra-renderer/dist/core/render-target";
import { ConstructorType } from "zogra-renderer/dist/utils/util";
import { Light2D } from "../gameplay/light";
import { LightComposeMaterial } from "../material/2d-light";

export class RenderPipeline implements ZograRenderPipeline
{
    debuglayer = new DebugLayerRenderer();
    lightmap: RenderTexture = new RenderTexture(16, 16, false);
    lightComposeMat = new LightComposeMaterial();

    render(renderer: RenderContext, cameras: Camera[]): void
    {
        for (const camera of cameras)
        {
            const data = new RenderData(camera, renderer.scene);
            this.renderCamera(renderer, data);    
        }
    }
    replaceMaterial<T extends Material>(MaterialType: ConstructorType<T>, material: Material): void
    {
        throw new Error("Method not implemented.");
    }

    renderCamera(context: RenderContext, data: RenderData)
    {
        const camera = data.camera;
        camera.__preRender(context);

        if (this.lightmap.width !== context.renderer.canvasSize.x || this.lightmap.height !== context.renderer.canvasSize.y)
        {
            this.lightmap.destroy();
            this.lightmap = new RenderTexture(context.renderer.canvasSize.x, context.renderer.canvasSize.y, false);
            this.lightmap.update();
        }

        if (camera.output === RenderTarget.CanvasTarget)
            context.renderer.setRenderTarget(RenderTarget.CanvasTarget);
        else
            context.renderer.setRenderTarget(camera.output as RenderTexture);
        
        context.renderer.clear(camera.clearColor, camera.clearDepth);

        context.renderer.setViewProjection(camera.worldToLocalMatrix, camera.projectionMatrix);
        context.renderer.setGlobalUniform("uCameraPos", "vec3", camera.position);

        const objs = data.getVisibleObjects(RenderOrder.FarToNear);
        for (const obj of objs)
        {
            obj.__onRender(context, data);
            const modelMatrix = obj.localToWorldMatrix;

            for (let i = 0; i < obj.meshes.length; i++)
            {
                if (!obj.meshes[i])
                    continue;
                const mat = obj.materials[i] || context.renderer.assets.materials.default;
                context.renderer.drawMesh(obj.meshes[i], modelMatrix, mat);
            }
        }

        // this.renderLight(context, data);

        this.debuglayer.render(context, data);
        camera.__postRender(context);
    }

    renderLight(context: RenderContext, data: RenderData)
    {
        var lights = context.scene.getEntitiesOfType(Light2D);
        context.renderer.setRenderTarget(this.lightmap);
        context.renderer.clear(Color.black);
        for (const light of lights)
        {
            context.renderer.drawMesh(light.mesh, light.localToWorldMatrix, light.material);
        }
        context.renderer.setRenderTarget(RenderTarget.CanvasTarget);
        context.renderer.blit(this.lightmap, RenderTarget.CanvasTarget, this.lightComposeMat);
    }
    
}