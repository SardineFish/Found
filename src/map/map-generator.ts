import { mul, plus, vec2 } from "zogra-renderer";
import { Chunk, TileData, Tilemap } from "../tilemap/tilemap";
import seedrandom from "seedrandom";
import { floor2 } from "../utils/math";
import _NoiseImport from 'noisejs';
import { Chest } from "../gameplay/chest";
import { Global } from "../gameplay/global";
import { calcChunkID } from "../utils/chunk-id";

const Noise = (_NoiseImport as any).Noise as typeof _NoiseImport;

export enum ItemType
{
    Glass = "glass",
    PCB = "pcb",
    Wire = "wire",
    Iron = "iron",
    Paint = "paint",
    Battery = "battery",
    Petrol = "petrol",
}

const ItemWeight: { [key: string]: number} = {
    [ItemType.Paint]: 0.3,
    [ItemType.Battery]: 0.2,
    [ItemType.Glass]: 0.1,
    [ItemType.Iron]: 0.1,
    [ItemType.Petrol]: 0.1,
    [ItemType.Wire]: 0.1,
    [ItemType.PCB]: 0.1,
}

const ItemAccumWeight = Object.keys(ItemWeight)
    .map(item => ({
        item: item as ItemType,
        weight: ItemWeight[item]
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

export class MapGenerator
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

    private loadChunk(chunkPos: vec2)
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
                let n = noise.simplex2(pos.x / 10, pos.y / 10)
                let n2 = noise.perlin2(pos.x / 5, pos.y / 5);
                // let n3 = this.noiseMap.perlin2(pos.x / 5, pos.y / 5);
                n = n / 2 + n2 / 4 - 0.1;
                if (n < 0)
                {
                    tilemap.setTile(pos, TileGround);
                }
                else
                {
                    tilemap.setTile(pos, TileWall);
                }
            }
        }
    }

    generateItems()
    {
        const chestsCount = 8;//(8 + 8 * this.prng.quick());
        const tilemap = Global().tilemap;
        this.chests = [];
        for (let i = 0; i < chestsCount; i++)
        {
            const pos = floor2(vec2(this.prng.quick() * ChunkSize, this.prng.quick() * ChunkSize));

            if (tilemap.getTile(pos)?.collide)
                continue;
            
            const items: ItemType[] = [];
            const t = this.prng.quick();
            for (const item of ItemAccumWeight)
            {
                if (t < item.weight)
                    items.push(item.item);
            }

            const chest = new Chest(items);
            chest.position = mul(this.chunkPos, ChunkSize).plus(pos).plus(vec2(0.5)).toVec3(2);
            this.chests.push(chest);
            Global().scene.add(chest);
        }

        console.log(`gen ${this.chests.length} for ${this.chunkPos}`);
    }
}