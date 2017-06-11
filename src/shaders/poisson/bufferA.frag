varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D texture_a;
uniform sampler2D texture_b;
uniform sampler2D texture_base;
uniform sampler2D texture_src;
uniform vec2 resolution;
uniform vec2 texture_resolution;
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
 * Created 12/6/2016
 * Update 4/5/2017:
 * [1] The iteration for each pixel will automatically stop after 100 iterations of Poisson blending.
 *
 * Bugs remaining:
 * [2] Edge effect, but it's kind'of cool right now.
 **/

// This is the main shader for the Poisson blending process.
#define NUM_NEIGHBORS 8
float mixingGradients;
vec2 neighbors[NUM_NEIGHBORS];

#define RES(UV) (tap(texture_a, vec2(UV)))
#define MASK(UV) (tap(texture_b, vec2(UV)))

#define BASE(UV) (tap(texture_base, vec2(((UV)*vec2(resolution.xy/(texture_resolution.xy*1.3))) - ((((vec2(-mouse)*0.5 - vec2((texture_resolution.xy*1.3)/resolution.xy))*0.5 + 0.5)*vec2(resolution.xy/(texture_resolution.xy*1.3)))))))
#define SRC(UV) (tap(texture_src,  vec2(((UV)*vec2(resolution.xy/(texture_resolution.xy*1.0))) - ((((vec2(mouse)*0.5 - vec2((texture_resolution.xy*1.0)/resolution.xy))*0.5 + 0.5)*vec2(resolution.xy/(texture_resolution.xy*1.0)))))))
#define MAX_ITERATIONS 100.0
#define EPS 0.00001

vec3 tap(sampler2D tex, vec2 uv){
 return texture2D(tex, uv + vec2(0.0, 0.0)).rgb;
 }

bool isInitialization() {
    vec2 lastResolution = texture2D(texture_b, vec2(0.5) / resolution.xy).yz;
    return any(notEqual(lastResolution, resolution.xy));
}

bool isMasked(vec2 uv) {
    return texture2D(texture_b, uv).x > 0.5;
}
bool isIterating(vec2 uv) {
    return texture2D(texture_b, uv).y < 1.0;
}

void main(){
    vec2 uv = vUv;//gl_FragCoord.xy / resolution.xy;
    gl_FragColor.a = 1.0;

    mixingGradients = 0.0;//texture2D(texture_b, vec2(1.5) / resolution.xy).y;
    float frameReset = 50.0;//texture2D(texture_b, vec2(1.5) / resolution.xy).z;

    // init: resolution does not match / current frame is black / mode changes
    if ((frame - 2.0) < frameReset) {
        gl_FragColor.rgb = RES(uv);
        return;
    }

    vec2 p = uv;
    //if (isMasked(p) && frameReset + MAX_ITERATIONS > float(frame)) {
    if (isMasked(p) && isIterating(p)) {
        vec3 col = vec3(0.0);
        float convergence = 0.0;

/*                neighbors[0] = uv + vec2(-1.0 / resolution.x, 0.0);
        neighbors[1] = uv + vec2( 1.0 / resolution.x, 0.0);
        neighbors[2] = uv + vec2(0.0, -1.0 / resolution.y);
        neighbors[3] = uv + vec2(0.0,  1.0 / resolution.y);*/
        float step_x = 1.0 / resolution.x;
        float step_y = 1.0 / resolution.y;
        neighbors[0] = uv + vec2(0.0, step_y);
        neighbors[1] = uv + vec2(step_x, step_y);
        neighbors[2] = uv + vec2(step_x, 0.0);
        neighbors[3] = uv + vec2(step_x, -step_y);
        neighbors[4] = uv + vec2(0.0, -step_y);
        neighbors[5] = uv + vec2(-step_x, -step_y);
        neighbors[6] = uv + vec2(-step_x, 0.0);
        neighbors[7] = uv + vec2(-step_x, step_y);


        for (int i = 0; i < NUM_NEIGHBORS; ++i) {
            vec2 q = neighbors[i];
            col += isMasked(q) ? RES(q) : BASE(q);
            vec3 srcGrad = SRC(p) - SRC(q);

            if (mixingGradients > 0.5) {
                vec3 baseGrad = BASE(p) - BASE(q);
                col.r += (abs(baseGrad.r) > abs(srcGrad.r)) ? baseGrad.r : srcGrad.r;
                col.g += (abs(baseGrad.g) > abs(srcGrad.g)) ? baseGrad.g : srcGrad.g;
                col.b += (abs(baseGrad.b) > abs(srcGrad.b)) ? baseGrad.b : srcGrad.b;
            } else {
                col += srcGrad;
            }
        }
        col /= float(NUM_NEIGHBORS);
        convergence += distance(col, RES(p)); // TODO: converge
        gl_FragColor.rgb = col;
        return;
    }

    gl_FragColor.rgb = BASE(uv);//mix(RES(uv), BASE(uv), sin(time*0.1)*0.5 + 0.5);
}
