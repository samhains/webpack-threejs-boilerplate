import noise from 'glsl-noise/simplex/2d'

uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	gl_FragColor= texture2D(u_tex, st);
}

