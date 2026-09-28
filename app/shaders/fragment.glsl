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
const float WAVE_LINING_HEIGHT = .004;
const float MEGAWAVE_MAGNITUDE = .01;
const float MEGAWAVE_FREQ = 5.;
const float MEGAWAVE_SPEED = .2;

const float TILE_SIZE = 100.;
const float TILE_BORDER_WIDTH = 5.;
const float TILE_OFFSET = 30.;


const vec3 SHALLOW_WATER_COLOR = vec3(0.13, 0.43, 0.6);
const vec3 DEEP_WATER_COLOR = vec3(0.03, 0.13, 0.18);
const vec3 BACKGROUND_WATER_COLOR = vec3(0.7, 0.83, 0.88);
const vec3 WAVE_LINING_COLOR = vec3(0.59, 0.76, 0.85);

const vec3 SKY_COLOR = vec3(0.69, 0.84, 0.95);

// vec3 mixColors(vec3 x, vec3 y, float a) {
//     vec3 color = vec3(0.);
//     color.r += mix(x.r, y.r, a);
//     color.g += mix(x.g, y.g, a);
//     color.b += mix(x.b, y.b, a);
//     return color;
// }

float getAdjustedWaterLine() {
    return (WATER_LINE + scrollY * SCROLL_WATER_LINE_SPEED);
}

vec3 addDepthColor(vec3 color) {
    vec2 uv = vUv;
    float adjusted_water_line = getAdjustedWaterLine();
    if (uv.y > adjusted_water_line) {
        color += SHALLOW_WATER_COLOR;
    } else {

        float depth = clamp((1.0 - uv.y) / adjusted_water_line, 0.0, 1.0);
        vec3 target = mix(SHALLOW_WATER_COLOR, DEEP_WATER_COLOR, depth);

        float tintStrength = mix(0.15, 0.6, depth);
        color = mix(color, target, tintStrength);

        // color = mix(target, color, tintStrength);
        // color.r += mix(DEEP_WATER_COLOR.r, SHALLOW_WATER_COLOR.r, uv.y / adjusted_water_line);
        // color.g += mix(DEEP_WATER_COLOR.g, SHALLOW_WATER_COLOR.g, uv.y / adjusted_water_line);
        // color.b += mix(DEEP_WATER_COLOR.b, SHALLOW_WATER_COLOR.b, uv.y / adjusted_water_line);
    }
    return color;
}

vec3 addTileColor(vec3 color, vec2 pixelCoord) {
    if (mod(pixelCoord.x + TILE_OFFSET, TILE_SIZE) < TILE_BORDER_WIDTH || mod(pixelCoord.y, TILE_SIZE) < TILE_BORDER_WIDTH) {
        color += vec3(0.54, 0.68, 0.65);
    } else {
        color += vec3(0.37, 0.4, 0.47);
    }
    return color;
}

float getWaveHeight() {
    vec2 uv = vUv;
    float wave_height = getAdjustedWaterLine();
    wave_height += sin((uTime * WAVE_SPEED + uv.x) * WAVE_FREQ) * WAVE_MAGNITUDE; // adjust for wave
    wave_height += cos((uTime * MEGAWAVE_SPEED + uv.x) * MEGAWAVE_FREQ) * MEGAWAVE_MAGNITUDE; // adjust for megawaves
    return wave_height;
}

void main(void)
{
    // Rename the uniform
    vec2 uv=vUv;
    vec2 pixelCoord = gl_FragCoord.xy;

    // Adjust water line
    vec3 color = vec3(0.);
    color = addTileColor(color, pixelCoord);
    color = addDepthColor(color);
    int opacity = 1;

    float adjusted_water_line = getAdjustedWaterLine();
    float wave_height = getWaveHeight();
    if (uv.y > wave_height) {
        if (uv.y < wave_height + WAVE_LINING_HEIGHT) {
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
            color += BACKGROUND_WATER_COLOR;
        }
    }

    // Keep colors between 0 and 1
    color = vec3(min(1., color.r), min(1., color.g), min(1., color.b));
    color = vec3(max(0., color.r), max(0., color.g), max(0., color.b));
    vec4 outputColor=vec4(color,opacity);
    gl_FragColor=outputColor;
}