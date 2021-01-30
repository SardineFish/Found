import { Mesh, MeshBuilder, vec2, vec3 } from "zogra-renderer";

export function makeQuad()
{
    const quad = new Mesh();
    quad.verts = [
        vec3(-.5, -.5, 0),
        vec3(.5, -.5, 0),
        vec3(.5, .5, 0),
        vec3(-.5, .5, 0),
    ];
    quad.triangles = [
        0, 1, 3,
        1, 2, 3,
    ];
    quad.uvs = [
        vec2(0, 0),
        vec2(1, 0),
        vec2(1, 1),
        vec2(0, 1)
    ];
    quad.calculateNormals();
    quad.name = "mesh_quad";
    return quad;
}