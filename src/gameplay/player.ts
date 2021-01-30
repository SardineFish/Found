import { Entity, InputManager, Keys, mul, Texture2D, Time, vec2 } from "zogra-renderer";
import { Material2D } from "../material/2d";
import { Rigidbody } from "./rigidbody";
import playerImage from "../../assets/texture/tex.png";
import { loadImage } from "../utils/load-image";
import { makeQuad } from "../utils/mesh";
import { Tilemap } from "../tilemap/tilemap";

export class Player extends Rigidbody
{
    moveSpeed = 5;
    input: InputManager;
    constructor(input: InputManager, tilemap: Tilemap)
    {
        super(tilemap);
        this.input = input;
        this.on("update", this.update.bind(this));

        this.init();
    }

    async init()
    {
        const material = new Material2D();
        const texture = new Texture2D();
        texture.setData(await loadImage(playerImage));
        material.texture = texture;
        this.position.z = 1;

        this.materials[0] = material;
        this.meshes[0] = makeQuad();
    }

    private update(entity: Entity, time: Time)
    {
        const moveInput = vec2.zero();
        if (this.input.getKey(Keys.W))
            moveInput.y += 1;
        if (this.input.getKey(Keys.S))
            moveInput.y -= 1;
        if (this.input.getKey(Keys.A))
            moveInput.x -= 1;
        if (this.input.getKey(Keys.D))
            moveInput.x += 1;
        
        if (this.input.getKeyDown(Keys.F2))
        {
            const x = 1;
        }
        moveInput.normalize();
        this.velocity = mul(moveInput, this.moveSpeed);
    }
}