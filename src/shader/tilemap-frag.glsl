#version 300 es
precision mediump float;

in vec4 vColor;
in vec4 vPos;
in vec2 vUV;
in vec2 vUV2;

uniform sampler2D uMainTex;
uniform vec4 uColor;
uniform vec2 uAtlasSize;

out vec4 fragColor;

void main()
{
    // color = color * vec3(uColor);
    if (vUV2.x < 0.0f || vUV2.y < 0.0f)
    {
        fragColor = vec4(0);
        return;
    }
    vec2 uv = (vUV + vUV2) / uAtlasSize;
    vec3 color = texture(uMainTex, uv.xy).rgb;
    fragColor = vec4(color.rgb, 1);
}