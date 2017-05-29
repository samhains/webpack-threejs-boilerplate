import noise from 'glsl-noise/simplex/2d'

vec2 offset [9];
float kernel [9];
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform float iGlobalTime;
uniform vec2 iResolution;

//void main()
//{
    //vec2 res = iResolution.xy;
    //vec2 tc = gl_FragCoord.xy / res;
    //vec2 uv = tc;
    
    //uv *= 0.998;
    
    //vec4 sum = texture2D(iChannel1, uv);
    //vec4 src = texture2D(iChannel0, tc);
    
    //sum.rgb = mix(sum.rbg, src.rgb, 0.04);
    //gl_FragColor = sum;
//}

vec2 rotate(vec2 coords, float angle){
	float sin_factor = sin(angle );
    float cos_factor = cos(angle );
    coords = vec2((coords.x - 0.5) , coords.y - 0.5) * mat2(cos_factor, sin_factor, -sin_factor, cos_factor);
    coords += 0.5;
    return coords;
}

void main()
{
    vec2 res = iResolution.xy;
    float t = iGlobalTime*0.01;
    vec2 tc = gl_FragCoord.xy / res;
    vec2 uv = -1.0 + 2.0 * tc;
    
    //zoom 
    uv *= 0.995;
    uv = uv * 0.5 + 0.5;
    
    //rotation
    uv = rotate(uv, 0.0015);
    
    vec2 step = 1.0 / res;
    
    offset[0] = vec2(-step.x, -step.y);
    offset[1] = vec2(0.0, -step.y);
    offset[2] = vec2(step.x, -step.y);
    
    offset[3] = vec2(-step.x, 0.0);
    offset[4] = vec2(0.0, 0.0);
    offset[5] = vec2(step.x, 0.0);
    
    offset[6] = vec2(-step.x, step.y);
    offset[7] = vec2(0.0, step.y);
    offset[8] = vec2(step.x, step.y);
    
    //convolution values
    float outer = -0.25;
    float inner = 0.125;
    
    kernel[0] = 0.0; kernel[1] = 0.0; kernel[2] = inner;
    kernel[3] = 0.0; kernel[4] = inner; kernel[5] = 0.0;
    kernel[6] = outer; kernel[7] = 0.0; kernel[8] = 0.0;
    
    vec4 sum = texture2D(iChannel1, uv);
    vec4 last = sum;
    last.gb = -1.0 + 2.0 * last.gb;
    
    for (int i = 0; i < 9; i++) {
        vec4 color = texture2D(iChannel1, (uv + offset[i]) - last.gb*0.025);
        sum += color * kernel[i];
    }
    
    vec4 src = texture2D(iChannel0, tc);
    sum.rgb = mix(sum.rgb, src.rgb, src.rgb*0.15);
    
    if(iGlobalTime < 1.0){
        gl_FragColor = src;
    } else {
    	gl_FragColor = vec4(clamp(vec3(sum.rgb), vec3(0.0), vec3(1.0)), 1.0);
    }
}
