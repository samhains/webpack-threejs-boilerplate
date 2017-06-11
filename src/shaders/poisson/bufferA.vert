varying vec2 vUv;
varying vec3 vNormal;
uniform sampler2D texture;
uniform float time;

void main(){
   vUv = uv;
   vec3 pos = position;
   vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
   gl_Position = projectionMatrix * mvPosition;
}
