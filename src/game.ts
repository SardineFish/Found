import { Camera, Projection, RenderObject, Texture2D, vec3, ZograEngine } from "zogra-renderer";

import { Material2D } from "./material/2d";
import { loadImage } from "./utils/load-image";
import textureImage from "../assets/texture/tex.png";

export async function start(engine: ZograEngine)
{
    const camera = new Camera();
    camera.position = vec3(0, 0, 1);
    camera.projection = Projection.Orthographic;
    camera.viewHeight = 5;

    engine.scene.add(camera);

    const mesh = engine.renderer.assets.meshes.quad;

    const entity = new RenderObject();
    entity.meshes[0] = mesh;
    const mat = new Material2D();
    const img = await loadImage(textureImage);
    const texture = new Texture2D();
    texture.setData(img);
    mat.texture = texture;

    entity.materials[0] = mat;

    engine.scene.add(entity);
}