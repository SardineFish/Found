import { div, mat4, Mesh, MeshBuilder, minus, plus, RenderContext, RenderData, RenderObject, vec2, vec3, Vector2 } from "zogra-renderer";
import { TilemapMaterial } from "../material/tilemap";
import { floor2, floorReminder } from "../utils/math";

const ChunkSize = 16;
// type Chunk = Array<TileData | null>;

export class Tilemap extends RenderObject
{
    private chunks = new Map<number, Chunk>();

    constructor()
    {
        super();
        this.on("render", this.onRender.bind(this));
        this.materials[0] = new TilemapMaterial();
    }

    onRender(obj: RenderObject, context: RenderContext, data: RenderData)
    {
        let screenSize = vec2(data.camera.viewHeight * data.camera.aspectRatio, data.camera.viewHeight);
        let [minCorner] = this.chunkPos(minus(data.camera.position.toVec2(), screenSize));
        let [maxCorner] = this.chunkPos(plus(data.camera.position.toVec2(), screenSize));
        // context.renderer.drawMesh(this.mesh, mat4.translate(vec3(0, 0, 0)), this.materials[0]);
        // return;
        for (let chunkY = minCorner.y; chunkY <= maxCorner.y; chunkY++)
            for (let chunkX = minCorner.x; chunkX <= maxCorner.x; chunkX++)
            {
                const chunk = this.getChunk(vec2(chunkX, chunkY));
                if (!chunk)
                    continue;
                context.renderer.drawMesh(chunk.mesh, mat4.translate(vec3(chunkX * ChunkSize, chunkY * ChunkSize, 0)), this.materials[0]);
            }
    }

    getTile(pos: Vector2): TileData | null
    {
        let [chunkPos, offset] = this.chunkPos(floor2(pos));
        let chunk = this.getOrCreateChunk(chunkPos);
        return chunk.getTile(offset);
    }

    setTile(pos: Vector2, tile: TileData | null)
    {
        let [chunkPos, offset] = this.chunkPos(floor2(pos));
        let chunk = this.getOrCreateChunk(chunkPos);
        return chunk.setTile(offset, tile);
    }

    private getOrCreateChunk(chunkPos: Vector2): Chunk
    {
        const idx = Math.floor(chunkPos.x) << 16 | Math.floor(chunkPos.y);
        let chunk = this.chunks.get(idx);
        if (!chunk)
        {
            chunk = new Chunk();
            this.chunks.set(idx, chunk);
            return chunk;
        }
        return chunk;
    }

    private getChunk(chunkPos: Vector2): Chunk | undefined
    {
        const idx = Math.floor(chunkPos.x) << 16 | Math.floor(chunkPos.y);
        return this.chunks.get(idx);
    }

    private chunkPos(pos: Vector2): [Vector2, Vector2]
    {
        const floorOffset = vec2(
            pos.x < 0 ? 1 : 0,
            pos.y < 0 ? 1 : 0,
        );
        return [minus(floor2(div(pos, vec2(ChunkSize, ChunkSize))), floorOffset), vec2(
            floorReminder(pos.x, ChunkSize),
            floorReminder(pos.y, ChunkSize),
        )];
    }

    
}

class Chunk
{
    tiles: Array<TileData | null> = new Array(ChunkSize * ChunkSize)
    mesh: Mesh = createChunkMesh();

    getTile(offset: vec2): TileData | null
    {
        const idx = offset.y * ChunkSize + offset.x;
        return this.tiles[idx];
    }

    setTile(offset: vec2, tile: TileData | null)
    {
        if (tile)
            tile = {
                collide: tile.collide,
                texture_offset: tile.texture_offset.clone()
            };
        
        let idx = offset.y * ChunkSize + offset.x;
        this.tiles[idx] = tile;

        const atlas_offset = tile
            ? tile.texture_offset
            : vec2(-1, -1);
        
        let uv2 = this.mesh.uv2;
        idx *= 4;
        uv2[idx + 0] = atlas_offset;
        uv2[idx + 1] = atlas_offset;
        uv2[idx + 2] = atlas_offset;
        uv2[idx + 3] = atlas_offset;
        this.mesh.uv2 = uv2;
    }
}

export interface TileData
{
    collide: boolean;
    texture_offset: Vector2;
}

function createChunkMesh()
{
    const builder = new MeshBuilder()
    for (let y = 0; y < ChunkSize; y++)
        for (let x = 0; x < ChunkSize; x++)
        {
            builder.addPolygon(
                [
                    vec3(x, y, 0),
                    vec3(x + 1, y, 0),
                    vec3(x + 1, y + 1, 0),
                    vec3(x, y + 1, 0),
                ],
                [
                    vec2(0, 0),
                    vec2(1, 0),
                    vec2(1, 1),
                    vec2(0, 1),
                ]);
        }
    const mesh = builder.toMesh();
    mesh.update();
    const uv2 = mesh.uv2;
    for (let i = 0; i < uv2.length; i++)
    {
        uv2[i] = vec2(-1, -1);
    }
    mesh.uv2 = uv2;
    mesh.update();
    return mesh;
}
