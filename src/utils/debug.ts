import { DebugLayerRenderer } from "zogra-renderer";

let renderer: DebugLayerRenderer;

export function initDebugLyaerRenderer(debug: DebugLayerRenderer)
{
    renderer = debug;
}

export function Debug()
{
    return renderer;
}