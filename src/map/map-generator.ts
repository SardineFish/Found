import { mul, plus, vec2, Vector2 } from "zogra-renderer";
import { Chunk, TileData, Tilemap } from "../tilemap/tilemap";
import seedrandom from "seedrandom";
import { floor2 } from "../utils/math";
import _NoiseImport from 'noisejs';
import { Chest } from "../gameplay/chest";
import { Global } from "../gameplay/global";
import { calcChunkID, calcChunkPos } from "../utils/chunk";

const Noise = (_NoiseImport as any).Noise as typeof _NoiseImport;

export enum ItemType
{
    None = "none",
    Glass = "glass",
    PCB = "pcb",
    Wire = "wire",
    Iron = "iron",
    Paint = "paint",
    Battery = "battery",
    Petrol = "petrol",
    Wood = "wood",
    Flashlight = "flashlight",
    Campfire = "campfire",
    Pickaxe = "pickaxe",
    Radio = "radio",
}
export const ItemName: { [key in ItemType]: string } = {
    [ItemType.None] : "[空手]",
    [ItemType.Glass] : "玻璃",
    [ItemType.PCB] : "电子元件",
    [ItemType.Wire] : "导线",
    [ItemType.Iron] : "金属",
    [ItemType.Paint] : "记号笔",
    [ItemType.Battery] : "电池",
    [ItemType.Petrol] : "汽油",
    [ItemType.Wood] : "木头",
    [ItemType.Flashlight] : "手电筒",
    [ItemType.Campfire] : "火堆",
    [ItemType.Pickaxe] : "铁镐",
    [ItemType.Radio] : "通信器",
}

const ItemCount: { [key: string]: number} = {
    [ItemType.Paint]: 1,
    [ItemType.Wood]: 20.6,
    [ItemType.Battery]: 10,
    [ItemType.Glass]: 10,
    [ItemType.Iron]: 10,
    [ItemType.Petrol]: 10,
    [ItemType.Wire]:10,
    [ItemType.PCB]: 10,
}
const TileOffsets: { [key: string]: vec2 } = {
    ["11111111"]: vec2(3, 3),
    ["00111110"]: vec2(6, 3),
    ["00001110"]: vec2(6, 4),
    ["10011111"]: vec2(5, 4),
    ["10111111"]: vec2(4, 4),
    // ["10011111"]:vec2(4, 5),
    // ["00001110"]:vec2(4, 6),
    ["10001111"]: vec2(3, 6),
    ["10000011"]: vec2(2, 6),
    ["11100111"]: vec2(2, 5),
    ["11101111"]: vec2(2, 4),
    ["11001111"]: vec2(1, 4),
    // ["10000011"]:vec2(0, 4),
    ["11100011"]: vec2(0, 3),
    ["11100000"]: vec2(0, 2),
    ["11111001"]: vec2(1, 2),
    ["11111011"]: vec2(2, 2),
    ["11110011"]: vec2(2, 1),
    // ["11100000"]:vec2(2, 0),
    ["11111000"]: vec2(3, 0),
    ["00111000"]: vec2(4, 0),
    ["01111110"]: vec2(4, 1),
    ["11111110"]: vec2(4, 2),
    ["11111100"]: vec2(5, 2),
    // ["00111000"]:vec2(6, 2),
};

const ItemAccumWeight = Object.keys(ItemCount)
    .map(item => ({
        item: item as ItemType,
        weight: ItemCount[item]
    }))
    .sort((a, b) => a.weight - b.weight);
{
    let sum = 0;
    for (const item of ItemAccumWeight)
    {
        item.weight += sum;
        sum = item.weight;
    }
}

// const Noise = globalThis.Noise;

const TileGround: TileData = {
    collide: false,
    texture_offset: vec2(1, 3),
};
const TileWall: TileData = {
    collide: true,
    texture_offset: vec2(0, 2),
    
};
const ChunkSize = 16;

export class ChunksManager
{
    seed: string;
    tilemap: Tilemap;
    chunks: Map<number, ChunkData> = new Map();
    prng: seedrandom.prng;
    noiseMap: Noise;
    previousLoadedChunk: Map<number, ChunkData> = new Map();
    loadedChunk: Map<number, ChunkData> = new Map();

    constructor(tilemap: Tilemap, seed: string)
    {
        this.tilemap = tilemap;
        this.seed = seed;
        this.prng = seedrandom(seed);
        this.noiseMap = new Noise(this.prng.double());

    }

    update()
    {
        this.previousLoadedChunk = this.loadedChunk;
        this.loadedChunk = new Map();
        const camera = Global().camera;
        const tilemap = Global().tilemap;

        const [chunkMin, chunkMax] = tilemap.visibleChunkRange(camera);
        for (let y = chunkMin.y; y < chunkMax.y; y++)
        {
            for (let x = chunkMin.x; x < chunkMax.x; x++)
            {
                this.loadChunk(vec2(x, y));
            }
        }
    }

    getChunkAt(pos: vec2)
    {
        const [chunkPos, offset] = calcChunkPos(pos, ChunkSize);
        return this.loadChunk(chunkPos);
    }

    private loadChunk(chunkPos: vec2): ChunkData
    {
        chunkPos = floor2(chunkPos);
        let chunkID = calcChunkID(chunkPos);
        let chunkData = this.chunks.get(chunkID);

        if (!this.previousLoadedChunk.has(chunkID))
        {
            if (chunkData)
                console.log(`load existed chunk ${chunkPos} ${chunkID}`);
            else
                console.log(`load new chunk ${chunkPos} ${chunkID}`);
        }

        if (!chunkData)
        {
            chunkData = new ChunkData(this.seed, chunkPos);
            this.chunks.set(chunkID, chunkData);
            chunkData.generateMap(this.noiseMap);
            chunkData.generateItems();
        }
        this.loadedChunk.set(chunkID, chunkData);

        return chunkData;
    }
}

export class ChunkData
{
    chunkPos: vec2;
    prng: seedrandom.prng;
    chests: Chest[] = [];
    
    constructor(seed: string, chunkPos: vec2)
    {
        this.chunkPos = chunkPos;
        this.prng = seedrandom(`${seed}@[${chunkPos.x},${chunkPos.y}]`);
    }

    generateMap(noise: Noise)
    {
        const tilemap = Global().tilemap;
        for (let y = 0; y < ChunkSize; y++)
        {
            for (let x = 0; x < ChunkSize; x++)
            {
                let offset = vec2(x, y);
                let pos = plus(mul(this.chunkPos, ChunkSize), offset);
                if (this.noiseAt(noise, pos) < 0)
                {
                    tilemap.setTile(pos, {
                        collide: false,
                        texture_offset: vec2(0, 0),
                    });
                }
                else if (this.noiseAt(noise, plus(pos, vec2.down())) >= 0)
                {
                    tilemap.setTile(pos, {
                        collide: true,
                        texture_offset: vec2(3, 3),
                    });
                }
                else
                {
                    tilemap.setTile(pos, {
                        collide: true,
                        texture_offset: vec2(3, 0),
                    });
                }
            }
        }

        // for (let y = 0; y < ChunkSize; y++)
        // {
        //     for (let x = 0; x < ChunkSize; x++)
        //     {
        //         let offset = vec2(x, y);
        //         let pos = plus(mul(this.chunkPos, ChunkSize), offset);

        //         if (tilemap.getTile(pos)?.collide)
        //         {
        //             let id = "";
        //             for (const delta of order)
        //             {
        //                 if (tilemap.getTile(plus(pos, delta))?.collide)
        //                     id += "1";
        //                 else
        //                     id += "0";
        //             }
        //             if (TileOffsets[id])
        //                 tilemap.setTile(pos, {
        //                     collide: true,
        //                     texture_offset: TileOffsets[id],
        //                 });
        //             else 
        //                 tilemap.setTile(pos, {
        //                     collide: true,
        //                     texture_offset: vec2(3, 0)
        //                 })
        //         }
        //     }
        // }
    }

    private noiseAt(noise: Noise, pos: vec2)
    {
        let n = noise.simplex2(pos.x / 10, pos.y / 10)
        let n2 = noise.perlin2(pos.x / 5, pos.y / 5);
        return n / 2 + n2 / 4 - 0.1;
    }

    generateItems()
    {
        const chestsCount = (1 + 3 * this.prng.quick());
        const tilemap = Global().tilemap;
        this.chests = [];
        for (let i = 0; i < chestsCount; i++)
        {
            const pos = floor2(vec2(this.prng.quick() * ChunkSize, this.prng.quick() * ChunkSize));

            if (tilemap.getTile(mul(this.chunkPos, ChunkSize).plus(pos))?.collide)
                continue;
            
            let count = 0;
            const items: ItemType[] = [];
            for (let j = 0; j < 5; j++)
            {
                for (const item of Object.keys(ItemCount))
                {
                    if (this.prng.quick() < ItemCount[item] - count)
                        items.push(item as ItemType);
                }
                count++;
            }

            const chest = new Chest(items, this);
            chest.position = mul(this.chunkPos, ChunkSize).plus(pos).plus(vec2(0.5)).toVec3(2);
            this.chests.push(chest);
            Global().scene.add(chest);
        }

        // console.log(`gen ${this.chests.length} for ${this.chunkPos}`);
    }

    

    removeChest(chest: Chest)
    {
        this.chests = this.chests.filter(c => c !== chest);
    }

    private tileAt(offset: vec2, wall: boolean): TileData
    {
        let sprite = Global().assets.tiles[`[${offset.x},${offset.y}]`];
        return {
            collide: wall,
            texture_offset: offset,
        }
    }
}