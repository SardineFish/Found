import { vec2 } from "zogra-renderer";

export function calcChunkID(chunkPos: vec2)
{
    if (chunkPos.x == -0)
        chunkPos.x = 0;
    if (chunkPos.y == -0)
        chunkPos.y = 0;
    const signX = chunkPos.x >= 0 ? 0 : 1;
    const signY = chunkPos.y >= 0 ? 0 : 1;
    return (signX << 31) | (Math.abs(Math.floor(chunkPos.x)) << 16) | (signY << 15) | Math.abs(Math.floor(chunkPos.y));
}