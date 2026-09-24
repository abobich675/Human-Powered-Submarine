varying vec2 vUv;

uniform float uTime;
uniform vec2 uPointer;
uniform float uOpacity;

void main(void)
{
    float BAR_WIDTH = 0.0025;
    float BAR_GAP = 0.005;

    vec3 BAR_COLOR = vec3(0.0);
    float BAR_OPACITY = .03;

    // Rename the uniform
    vec2 uv=vUv;
    
    vec3 color=BAR_COLOR;
    float opacity = 0.;

    // alternative: (int(uv.y * 100) % int(BAR_GAP * 100)) / 100 < BAR_WIDTH
    if (mod(uv.y, BAR_GAP + BAR_WIDTH) < BAR_WIDTH) {
        opacity = BAR_OPACITY;
    }

    vec4 outputColor=vec4(color,opacity);
    gl_FragColor=outputColor;
}