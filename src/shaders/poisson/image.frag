varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D texture;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform float frame;

void main(){
  vec2 q = vUv;//gl_gl_FragCoord.xy / resolution.xy;
  gl_FragColor = texture2D(texture, q);
}
