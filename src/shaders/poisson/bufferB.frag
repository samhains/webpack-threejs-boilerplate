varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D texture;
uniform sampler2D texture_a;
uniform sampler2D texture_b;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform float frame;
/**
 * Interactive Poisson Blending by Ruofei Du (DuRuofei.com)
 * Demo: https://www.shadertoy.com/view/4l3Xzl
 * Tech brief: http://blog.ruofeidu.com/interactive-poisson-blending/
 * starea @ ShaderToy,License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 * https://creativecommons.org/licenses/by-nc-sa/3.0/
 *
 * Reference:
 * [1] P. Pérez, M. Gangnet, A. Blake. Poisson image editing. ACM Transactions on Graphics (SIGGRAPH'03), 22(3):313-318, 2003.
 *
oooo         * Created 12/6/2016
 * Update 4/5/2017:
 * [1] The iteration for each pixel will automatically stop after 100 iterations of Poisson blending.
 *
 * Bugs remaining:
 * [2] Edge effect, but it's kind'of cool right now.
 **/

// the stroke and iterations mask
// r for strokes
// b for iterations
#define BRUSH_SIZE 0.1
#define INITIAL_CIRCLE_SIZE 0.4

const float KEY_1 = 49.5;
const float KEY_2 = 50.5;
const float KEY_SPACE = 32.5;
const float KEY_ALL = 256.0;

bool getKeyDown(float key) {
    return texture2D(texture_b, vec2(key / KEY_ALL, 0.5)).x > 0.1;
}

bool getMouseDown() {
    return mouse.x > 0.0;
}

bool isInitialization() {
  vec2 lastResolution = texture2D(texture_b, vec2(0.0) / resolution.xy).yz;
    return any(notEqual(lastResolution, resolution.xy));
}

void main(){
    vec2 uv = vUv;//gl_FragCoord.xy / resolution.xy;
    vec2 p = (vUv*2.0 - 1.0);//2.0 * (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    float mixingGradients = texture2D(texture_b, vec2(1.5) / resolution.xy).y;
    float frameReset = texture2D(texture_b, vec2(1.5) / resolution.xy).z;
    vec2 prevData = texture2D(texture_b, uv).xy;
    float mask = prevData.x;
    float iterations = prevData.y + 0.002;
    bool resetBlending = (getKeyDown(KEY_1) && mixingGradients > 0.5) || (getKeyDown(KEY_2) && mixingGradients < 0.5);
    if (getKeyDown(KEY_1)) mixingGradients = 0.0;
    if (getKeyDown(KEY_2)) mixingGradients = 1.0;
      gl_FragColor = vec4(mask, 0.0, 0.5, 1.0);
}
