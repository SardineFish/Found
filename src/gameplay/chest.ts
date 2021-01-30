import { sup } from "*.png";
import { RenderObject, Texture2D, vec2 } from "zogra-renderer";
import checkbord from "../../assets/texture/checkboard.png";
import { ItemType } from "../map/map-generator";
import { Material2D } from "../material/2d";
import { Sprite } from "../rendering/sprite";
import { loadImage } from "../utils/load-image";
import { Global } from "./global";
import { SpriteObject } from "./sprite-object";


export class Chest extends SpriteObject
{
    items: ItemType[];
    constructor(items: ItemType[])
    {
        super();
        this.items = items;

        this.sprite = Global().assets.spriteChest;
    }


}