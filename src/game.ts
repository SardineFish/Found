import { Camera, InputManager, Keys, Projection, RenderObject, Scene, Texture2D, vec2, vec3, ZograEngine } from "zogra-renderer";

import { Material2D } from "./material/2d";
import { loadImage } from "./utils/load-image";
import textureImage from "../assets/texture/tex.png";
import checkboardImage from "../assets/texture/checkboard.png";
import { Tilemap } from "./tilemap/tilemap";
import { TilemapMaterial } from "./material/tilemap";

export async function start(engine: ZograEngine)
{
    const input = new InputManager();

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

    let tilemap = new Tilemap();
    engine.scene.add(tilemap);
    const checkboard = new Texture2D();
    checkboard.setData(await loadImage(checkboardImage));
    (tilemap.materials[0] as TilemapMaterial).texture = checkboard;
    (tilemap.materials[0] as TilemapMaterial).atlasSize = vec2(4, 4);


    let count = 0;
    engine.on("update", () =>
    {
        input.update();
        if (input.getKeyDown(Keys.Mouse0))
        {
            let pos = camera.screenToWorld(input.pointerPosition);
            console.log(pos);

            count++;
            let uv = vec2(Math.floor(count / 4), count % 4);
            tilemap.setTile(pos.toVec2(), {
                collide: false,
                texture_offset: uv.clone()
            });

        } 
    });


    engine.scene.add(entity);
}