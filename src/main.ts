import { Camera, PreviewRenderer, Projection, RenderObject, vec3, ZograEngine } from "zogra-renderer";
import texture from "../assets/texture/tex.png";
import { initDebugLyaerRenderer } from "./utils/debug";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
let rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;
const engine = new ZograEngine(canvas);
engine.start();

initDebugLyaerRenderer((engine.renderPipeline as PreviewRenderer).debugLayer);

import { start } from "./game";
start(engine);