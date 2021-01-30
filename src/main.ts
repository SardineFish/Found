import { Camera, PreviewRenderer, Projection, RenderObject, vec3, ZograEngine } from "zogra-renderer";
import texture from "../assets/texture/tex.png";
import { initDebugLyaerRenderer } from "./utils/debug";
import { RenderPipeline } from "./rendering/render-pipeline";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
let rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;
const engine = new ZograEngine(canvas, RenderPipeline);
engine.start();

initDebugLyaerRenderer((engine.renderPipeline as RenderPipeline).debuglayer);

import { start } from "./game";
start(engine);