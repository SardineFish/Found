import { div, minus, vec2, Vector2 } from "zogra-renderer";
import { floor2, floorReminder } from "./math";

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

export function calcChunkPos(pos: Vector2, chunkSize: number): [Vector2, Vector2]
{
    const floorOffset = vec2(
        pos.x < 0 ? /*1*/ 0 : 0,
        pos.y < 0 ? /*1*/ 0 : 0,
    );
    return [minus(floor2(div(pos, vec2(chunkSize, chunkSize))), floorOffset), vec2(
        floorReminder(pos.x, chunkSize),
        floorReminder(pos.y, chunkSize),
    )];
}