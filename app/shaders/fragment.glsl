varying vec2 vUv;

uniform float uTime;
uniform vec2 uPointer;
uniform float uOpacity;
uniform float scrollY;


// Constants
const float WATER_LINE = 0.5; // 0-1
const float SCROLL_WATER_LINE_SPEED = 0.002;
const float WAVE_MAGNITUDE = .01; // 1 = whole screen
const float WAVE_FREQ = 20.;
const float WAVE_SPEED = .075;
const float WAVE_TOP_HEIGHT = .0025;
const float MEGAWAVE_MAGNITUDE = .01;
const float MEGAWAVE_FREQ = 5.;
const float MEGAWAVE_SPEED = .2;

const vec3 SHALLOW_WATER_COLOR = vec3(0.13, 0.43, 0.6);
const vec3 DEEP_WATER_COLOR = vec3(0.03, 0.13, 0.18);
const vec3 BACKGROUND_WATER_COLOR = vec3(0.7, 0.83, 0.88);
const vec3 WAVE_LINING_COLOR = vec3(0.31, 0.47, 0.55);

const vec3 SKY_COLOR = vec3(0.69, 0.84, 0.95);

float getAdjustedWaterLine() {
    return (WATER_LINE + scrollY * SCROLL_WATER_LINE_SPEED);
}

vec3 getDepthColor(vec2 uv) {
    float adjusted_water_line = getAdjustedWaterLine();
    vec3 color;
    if (uv.y > adjusted_water_line) {
        color = SHALLOW_WATER_COLOR;
    } else {
        color.r += mix(DEEP_WATER_COLOR.r, SHALLOW_WATER_COLOR.r, uv.y / adjusted_water_line);
        color.g += mix(DEEP_WATER_COLOR.g, SHALLOW_WATER_COLOR.g, uv.y / adjusted_water_line);
        color.b += mix(DEEP_WATER_COLOR.b, SHALLOW_WATER_COLOR.b, uv.y / adjusted_water_line);
    }
    return color;
}

void main(void)
{

    // Rename the uniform
    vec2 uv=vUv;

    // Adjust water line
    vec3 color = getDepthColor(uv);
    int opacity = 1;

    float adjusted_water_line = getAdjustedWaterLine();
    float wave_height = adjusted_water_line;
    wave_height += sin((uTime * WAVE_SPEED + uv.x) * WAVE_FREQ) * WAVE_MAGNITUDE; // adjust for wave
    wave_height += cos((uTime * MEGAWAVE_SPEED + uv.x) * MEGAWAVE_FREQ) * MEGAWAVE_MAGNITUDE; // adjust for megawaves
    if (uv.y > wave_height) {
        if (uv.y < wave_height + WAVE_TOP_HEIGHT) {
            // Wave Lining Color
            color = WAVE_LINING_COLOR;
        } else if (uv.y > adjusted_water_line) {
            // Sky Color
            color = vec3(0.);
            color.r += mix(SKY_COLOR.r, 1., (1. - uv.y) / (1. - adjusted_water_line));
            color.g += mix(SKY_COLOR.g, 1., (1. - uv.y) / (1. - adjusted_water_line));
            color.b += mix(SKY_COLOR.b, 1., (1. - uv.y) / (1. - adjusted_water_line));
        } else {
            // Background Wave Color
            color = BACKGROUND_WATER_COLOR;
        }
    }
    
    vec4 outputColor=vec4(color,opacity);
    gl_FragColor=outputColor;
}