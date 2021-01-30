import { vec2, Vector2 } from "zogra-renderer";

export function floorReminder(x: number, m: number)
{
    return x >= 0
        ? x % m
        : (m + x % m) % m;
}
export function floor2(v: Vector2)
{
    return vec2(Math.floor(v.x), Math.floor(v.y));    
}