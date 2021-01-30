#version 300 es
precision mediump float;

in vec4 vColor;
in vec4 vPos;
in vec2 vUV;

uniform sampler2D uMainTex;
uniform vec4 uColor;

out vec4 fragColor;

void main()
{
    vec2 uv = (vUV - vec2(0.5)) * vec2(2);
    float r = length(uv);
    float light = 1.0 - r;
    vec3 color = texture(uMainTex, vUV.xy).rgb;
    // color = color * vec3(uColor);
    fragColor = vec4(light, light, light, 1.0);
}