import noise from 'glsl-noise/simplex/2d'

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform float iGlobalTime;
uniform vec2 iResolution;

void main()
{
    vec2 res = iResolution.xy;
    vec2 tc = gl_FragCoord.xy / res;
    vec2 uv = tc;
    
    uv *= 0.998;
    
    vec4 sum = texture2D(iChannel1, uv);
    vec4 src = texture2D(iChannel0, tc);
    
    sum.rgb = mix(sum.rbg, src.rgb, 0.04);
    gl_FragColor = sum;
}
