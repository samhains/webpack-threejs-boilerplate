import * as THREE from 'three';
import Buffer from './Buffer.js';
function InputTexture(TEXTURE0, renderer, renderSize, uniforms){
  this.renderer = renderer;
  this.scene = new THREE.Scene();
  this.camera = new THREE.Camera();
  this.camera.position.z = 1;
  this.buffers = [];
  this.init = function(){

      this.buffers[0] = new Buffer(new InputTextureShader(), renderer, renderSize, uniforms);

      this.buffers[0].material.uniforms["texture"].value = TEXTURE0;
      this.buffers[0].material.uniforms["texture"].value.wrapS = this.buffers[0].material.uniforms["texture"].value.wrapT = THREE.RepeatWrapping;
      this.buffers[0].material.uniforms["texture"].value.minFilter = this.buffers[0].material.uniforms["texture"].value.magFilter = THREE.LinearMipMapFilter;

  }

  this.draw = function(){
    this.buffers[0].render(renderer, this.camera, true);

  }
}

function InputTextureShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture": { type: "t", value: null },
            "texture_resolution": { type: "t", value: null },
            "resolution": { type: "v2", value: null },
            "mouse": { type: "v2", value: null },
            "frame": { type: "f", value: 0.0 },
            "time": { type: "f", value: 0.0 },
        }
    ]);

    this.vertexShader = [

        "varying vec2 vUv;",
        "varying vec3 vNormal;",

        "uniform sampler2D texture;",
        "uniform float time;",
        "void main(){",
        "   vUv = uv;",
        " vec3 pos = position;",
        "   vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",
        "   gl_Position = projectionMatrix * mvPosition;",
        "}",

    ].join("\n");

    this.fragmentShader = [
          "varying vec2 vUv;",
          "varying vec3 vNormal;",
          "uniform sampler2D texture;",
          "uniform vec2 texture_resolution;",
          "uniform vec2 resolution;",
          "uniform vec2 mouse;",
          "uniform float time;",
          "uniform float frame;",

          "void main()",
          "{",
          "   vec2 uv = ((vUv)*vec2(resolution.xy/texture_resolution.xy)) - ((((vec2(0.0)*0.5 - vec2(texture_resolution.xy/resolution.xy))*0.5 + 0.5)*vec2(resolution.xy/texture_resolution.xy)));",

          "	  gl_FragColor = texture2D(texture, uv);",
          "}",
    ].join("\n");

}

export default InputTexture;
