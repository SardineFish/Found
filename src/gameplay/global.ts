import { Camera, FilterMode, InputManager, Scene, Texture2D, vec2, ZograEngine } from "zogra-renderer";
import { ChunksManager } from "../map/map-generator";
import { Sprite } from "../rendering/sprite";
import { Tilemap } from "../tilemap/tilemap";
import { NetworkPlayer } from "./network-player";
import { Player } from "./player";
import checkboard from "../../assets/texture/checkboard.png";
import { loadImage } from "../utils/load-image";
import { GameSession } from "../network/session";
import tiles from "../../assets/texture/tiles.png";
import { TextureFormat } from "zogra-renderer/dist/core/texture-format";

interface GlobalEntities
{
    engine: ZograEngine;
    scene: Scene;
    tilemap: Tilemap;
    camera: Camera;
    player: Player;
    remotePlayer: NetworkPlayer;
    chunksManager: ChunksManager;
    assets: Assets;
    input: InputManager;
    session: GameSession;
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

interface TileSprites
{
    [key: string]: Sprite;
}

interface Assets
{
    spriteChest: Sprite,
    mark: Sprite,
    tiles: TileSprites,
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
        }),
        // mark
        loadImage(checkboard).then(img =>
        {
            const texture = new Texture2D();
            texture.setData(img);
            assets.mark = new Sprite(texture, vec2(4, 4), vec2(2, 3));

        }),
        //tiles
        loadImage(tiles).then(img =>
        {
            const texture = new Texture2D(img.width, img.height, TextureFormat.RGB, FilterMode.Nearest);
            texture.setData(img);
            const sprites: TileSprites = {};
            
 
            for (let y = 0; y < 7; y++)
            {
                for (let x = 0; x < 7; x++)
                {
                    sprites[`[${x},${y}]`] = new Sprite(texture, vec2(7, 7), vec2(x, y));
                }
            }
            assets.tiles = sprites;
        }),
    ]);

    return assets;
}