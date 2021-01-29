import { Camera, Projection, RenderObject, vec3, ZograEngine } from "zogra-renderer";
import texture from "../assets/texture/tex.png";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
let rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;
const engine = new ZograEngine(canvas);
engine.start();

import { start } from "./game";
start(engine);