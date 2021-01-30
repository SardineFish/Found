import { minus, plus, vec2, Vector2 } from "zogra-renderer";

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
export function minAbs(a: number, b: number)
{
    return Math.abs(a) <= Math.abs(b) ? a : b;
}

export class Rect
{
    min: vec2;
    max: vec2;
    constructor(pos: vec2, size: vec2)
    {
        this.min = pos;
        this.max = plus(pos, size);
    }

    get xMin() { return this.min.x }
    get yMin() { return this.min.y }
    get xMax() { return this.max.x }
    get yMax() { return this.max.y }
    
}

export function boxRaycast(box: Rect, center: vec2, direction: vec2): [boolean, number, vec2] // [hit, distance, normal]
{
    direction = direction.normalized;
    if (direction.x == 0 && direction.y == 0)
        return [false, 0, vec2.zero()];
    
    let tMin: vec2 = vec2.zero();
    let tMax: vec2 = vec2.zero();
    
    if (direction.x == 0)
    {
        tMin.y = (box.yMin - center.y) / direction.y;
        tMax.y = (box.yMax - center.y) / direction.y;
        tMin.x = tMax.x = Number.NEGATIVE_INFINITY;

        if (box.xMin <= center.x && center.x <= box.xMax)
        {
            if (tMin.y < tMax.y)
                return [true, tMin.y, vec2(0, -1)];
            return [true, tMax.y, vec2(0, 1)];
        }
        return [false, 0, vec2.zero()];
    }
    if (direction.y == 0)
    {
        tMin.x = (box.xMin - center.x) / direction.x;
        tMax.x = (box.xMax - center.x) / direction.x;
        tMin.y = tMax.y = Number.NEGATIVE_INFINITY;

        if (box.yMin <= center.y && center.y <= box.yMax)
        {
            if (tMin.x < tMax.x)
                return [true, tMin.x, vec2(-1, 0)];
            return [true, tMax.x, vec2(1, 0)];
        }
        return [false, 0, vec2.zero()];
    }

    tMin = minus(box.min, center).div(direction); // distance to box min lines (X and Y)
    tMax = minus(box.max, center).div(direction); // distance to box max lines (X and Y)

    var minXT = tMin.x; // min distance to vertical line
    var maxXT = tMax.x; // max distance to vertical line
    var minXNormal = vec2(-1, 0); // Vector2.left; // normal of the vertical line which has minimal distance to center
    var minYT = tMin.y;
    var maxYT = tMax.y;
    var minYNormal = vec2(0, -1); // Vector2.down;

    if (tMin.x > tMax.x)
    {
        minXT = tMax.x;
        maxXT = tMin.x;
        minXNormal = vec2(1, 0); // Vector2.right;
    }
    if (tMin.y > tMax.y)
    {
        minYT = tMax.y;
        maxYT = tMin.y;
        minYNormal = vec2(0, 1); // Vector2.up;
    }

    if (minYT > maxXT || minXT > maxYT)
    {
        return [false, 0, vec2.zero()];
    }
    else if (minXT > minYT)
    {
        return [true, minXT, minXNormal];
    }
    return [true, minYT, minYNormal];
}