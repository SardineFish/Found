import { Camera, Scene, Texture2D, vec2, ZograEngine } from "zogra-renderer";
import { MapGenerator } from "../map/map-generator";
import { Sprite } from "../rendering/sprite";
import { Tilemap } from "../tilemap/tilemap";
import { NetworkPlayer } from "./network-player";
import { Player } from "./player";
import checkboard from "../../assets/texture/checkboard.png";
import { loadImage } from "../utils/load-image";

interface GlobalEntities
{
    engine: ZograEngine;
    scene: Scene;
    tilemap: Tilemap;
    camera: Camera;
    player: Player;
    remotePlayer: NetworkPlayer;
    mapGenerator: MapGenerator;
    assets: Assets;
}
let globalEntities: GlobalEntities;

export function initGlobalEntities(entities: GlobalEntities)
{
    globalEntities = entities;
}

export function Global()
{
    return globalEntities;
}


interface Assets
{
    spriteChest: Sprite,
}

export async function loadAssets()
{
    const assets: Assets = {} as any;

    await Promise.all([
        // chest
        loadImage(checkboard).then(img =>
        {
            const texture = new Texture2D();
            texture.setData(img);

            assets.spriteChest = new Sprite(texture, vec2(4, 4), vec2(0, 3));
        })
    ]);

    return assets;
}