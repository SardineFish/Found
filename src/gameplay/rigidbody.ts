import { sup } from "*.png";
import { Color, div, dot, Entity, InputManager, Keys, minus, mul, plus, RenderObject, Time, vec2 } from "zogra-renderer";
import { TileData, Tilemap } from "../tilemap/tilemap";
import { Debug } from "../utils/debug";
import { boxRaycast, floor2, minAbs, Rect } from "../utils/math";
import { SpriteObject } from "./sprite-object";

export class Rigidbody extends SpriteObject
{
    colliderSize: vec2 = vec2(0.8, 0.8);
    colliderOffset: vec2 = vec2.zero();
    velocity: vec2 = vec2.zero();
    private tilemap: Tilemap;
    private neighborTiles: Array<Rect> = [];

    constructor(tilemap: Tilemap)
    {
        super();

        this.tilemap = tilemap;

        this.on("update", this.updatePhysics.bind(this));
    }

    private updatePhysics(self: Entity, time: Time)
    {
        const motionStep = mul(this.velocity, time.deltaTime);
    
        let velocity = this.velocity.clone();

        {
            const [hit, dist] = this.collisionCheck(time.deltaTime, this.velocity, vec2.down(), vec2.left())
            if (hit)
                motionStep.y = minAbs(motionStep.y, velocity.normalized.y * dist);
        }
        {
            const [hit, dist] = this.collisionCheck(time.deltaTime, this.velocity, vec2.up(), vec2.left())
            if (hit)
                motionStep.y = minAbs(motionStep.y, velocity.normalized.y * dist);
        }
        {
            const [hit, dist] = this.collisionCheck(time.deltaTime, this.velocity, vec2.left(), vec2.up())
            if (hit)
                motionStep.x = minAbs(motionStep.x, velocity.normalized.x * dist);
        }
        {
            const [hit, dist] = this.collisionCheck(time.deltaTime, this.velocity, vec2.right(), vec2.up())
            if (hit)
                motionStep.x = minAbs(motionStep.x, velocity.normalized.x * dist);
        }

        this.velocity = div(motionStep, time.deltaTime);

        this.position = plus(this.position, mul(this.velocity, time.deltaTime));
    }

    private collisionCheck(dt: number, velocity: vec2, normal: vec2, tangent: vec2): [boolean, number] // [hit, hitDistance]
    {
        const colliderSize = this.colliderSize;

        var halfSize = div(colliderSize, 2); // colliderSize / 2
        var center = plus(this.position, this.colliderOffset).toVec2(); // this.position + this.colliderOffset
        var offset = mul(velocity, dt);  // velocity * dt;

        this.neighborTiles = [];

        if (!this.isColliderTile(plus(center, tangent)) && this.isColliderTile(plus(center, normal).plus(tangent)))
        {
            // neighboorTiles.Add(new Rect(MathUtility.Floor(center + normal + tangent) - halfSize, Vector2.one + colliderSize));
            this.neighborTiles.push(new Rect(floor2(plus(center, normal).plus(tangent)).minus(halfSize), vec2.one().plus(colliderSize)));
        }
        if (!this.isColliderTile(minus(center, tangent)) && this.isColliderTile(plus(center, normal).minus(tangent)))
        {
            // neighboorTiles.Add(new Rect(MathUtility.Floor(center + normal - tangent) - halfSize, Vector2.one + colliderSize));
            this.neighborTiles.push(new Rect(floor2(plus(center, normal).minus(tangent)).minus(halfSize), vec2.one().plus(colliderSize)));
        }
        if (this.isColliderTile(plus(center, normal)))
        {
            // neighboorTiles.Add(new Rect(MathUtility.Floor(center + normal) - halfSize, Vector2.one + colliderSize));
            this.neighborTiles.push(new Rect(floor2(plus(center, normal)).minus(halfSize), vec2.one().plus(colliderSize)));
        }

        let minDistance = Number.MAX_VALUE;
        let hit = false;
        for (const tile of this.neighborTiles)
        {
            // Utility.DebugDrawRect(tile, new Color(normal.x * .5f + .5f, normal.y * .5f + .5f, 1), Mathf.Atan2(normal.y, normal.x));
            Debug().drawRect(tile.min, tile.max, new Color(normal.x * .5 + .5, normal.y * .5 + .5, 1));
            const THRESHOLD = -0.00001;

            const [boxHit, distance, norm] = boxRaycast(tile, center, velocity.normalized);
            if (boxHit && THRESHOLD <= distance && distance <= offset.magnitude && norm.dot(normal) < -0.99)
            {
                // Debug.DrawLine(center + velocity.normalized * distance, center + velocity.normalized * distance + norm);
                Debug().drawLine(plus(center, velocity.normalized.mul(vec2(distance))).toVec3(), plus(center, velocity.normalized.mul(vec2(distance)).plus(norm)).toVec3());
                minDistance = Math.min(distance, minDistance);
                hit = true;
            }

        }

        return [hit, minDistance];
    }

    private isColliderTile(pos: vec2): boolean
    {
        // return false;
        const tile = this.tilemap.getTile(pos);
        return tile ? tile.collide : false;
    }
}