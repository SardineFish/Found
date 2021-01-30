import { Camera, PreviewRenderer, Projection, RenderObject, vec3, ZograEngine } from "zogra-renderer";
import texture from "../assets/texture/tex.png";
import { initDebugLyaerRenderer } from "./utils/debug";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
let rect = canvas.getBoundingClientRect();
canvas.width = rect.width;
canvas.height = rect.height;
const engine = new ZograEngine(canvas);
engine.start();


import { RenderPipeline } from "./rendering/render-pipeline";
import { start } from "./game";
import { GameSession } from "./network/session";


const session = new GameSession("ws://found.sardinefish.com/ws", "User");

session.onStart = () =>
{
    const renderPipeline = new RenderPipeline();
    engine.renderPipeline = renderPipeline;
    initDebugLyaerRenderer(renderPipeline.debuglayer);
    start(engine, session);
}
