uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform float iGlobalTime;
uniform vec2 iResolution;

void main() {
	vec2 st = gl_FragCoord.xy/iResolution.xy;
	gl_FragColor= texture2D(iChannel1, st);
}

