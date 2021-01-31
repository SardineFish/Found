import { sup } from "*.png";
import { RenderObject, Texture2D, vec2 } from "zogra-renderer";
import checkbord from "../../assets/texture/checkboard.png";
import { ChunkData, ItemType } from "../map/map-generator";
import { Material2D } from "../material/2d";
import { Sprite } from "../rendering/sprite";
import { loadImage } from "../utils/load-image";
import { Global } from "./global";
import { SpriteObject } from "./sprite-object";


export class Chest extends SpriteObject
{
    items: ItemType[];
    chunk: ChunkData;
    constructor(items: ItemType[], chunkData: ChunkData)
    {
        super();
        this.items = items;
        this.chunk = chunkData;

        this.sprite = Global().assets.spriteChest;
    }

    open(): ItemType[]
    {
        Global().scene.remove(this);
        this.chunk.removeChest(this);
        return this.items;
    }
}