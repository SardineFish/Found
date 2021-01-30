import { mul, plus, vec2 } from "zogra-renderer";
import { Chunk, TileData, Tilemap } from "../tilemap/tilemap";
import Simplex from "perlin-simplex";

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
    tilemap: Tilemap;
    noise: any;
    generated = new Set<number>();
    constructor(tilemap: Tilemap)
    {
        this.tilemap = tilemap;
        this.noise = new Simplex();
    }

    generateChunk(chunkPos: vec2)
    {
        let chunkID = Chunk.chunkID(chunkPos);
        if (this.generated.has(chunkID))
            return;
        this.generated.add(chunkID);
        for (let y = 0; y < ChunkSize; y++)
        {
            for (let x = 0; x < ChunkSize; x++)
            {
                let offset = vec2(x, y);
                let pos = plus(mul(chunkPos, ChunkSize), offset);
                let n = this.noise.noise(pos.x / 10, pos.y / 10);
                let n2 = this.noise.noise(pos.x / 5, pos.x / 5);
                n = n / 2 + n2 / 4 - 0.1;
                if (n < 0)
                {
                    this.tilemap.setTile(pos, TileGround);
                }
                else
                {
                    this.tilemap.setTile(pos, TileWall);
                }
            }    
        }
    }
}