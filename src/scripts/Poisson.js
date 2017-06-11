import * as THREE from 'three';
const glslify = require( 'glslify' );
import Buffer from './Buffer.js';
function Poisson(renderer, renderSize, uniforms, tex0, tex1){
  this.renderer = renderer;
  this.scene = new THREE.Scene();
  this.camera = new THREE.Camera();
  this.camera.position.z = 1;
  this.buffers = [];
  this.init = function(){

      this.buffers[0] = new Buffer(new AShader(), renderer, renderSize, uniforms);
      this.buffers[1] = new Buffer(new BShader(), renderer, renderSize, uniforms);
      this.buffers[2] = new Buffer(new ImageShader(), renderer, renderSize, uniforms);

      this.buffers[0].material.uniforms["texture_src"].value = tex0;//inputTexture.buffers[0].renderTarget.texture;
      // this.buffers[0].material.uniforms["texture_src"].value.wrapS = this.buffers[0].material.uniforms["texture_src"].value.wrapT = THREE.RepeatWrapping;
      this.buffers[0].material.uniforms["texture_base"].value = tex1;//inputTexture_base.buffers[0].renderTarget.texture; // this.buffers[0].material.uniforms["texture_base"].value.wrapS = this.buffers[0].material.uniforms["texture_base"].value.wrapT = THREE.RepeatWrapping;

      this.buffers[1].material.uniforms["texture"].value = this.buffers[0].renderTarget.texture;
      this.buffers[1].material.uniforms["texture_a"].value = this.buffers[0].renderTarget.texture;
      this.buffers[1].material.uniforms["texture_b"].value = this.buffers[2].renderTarget.texture;

      this.buffers[2].material.uniforms["texture"].value = this.buffers[0].renderTarget.texture;

      this.buffers[0].material.uniforms["texture_a"].value = this.buffers[2].renderTarget.texture;
      this.buffers[0].material.uniforms["texture_b"].value = this.buffers[1].renderTarget.texture;

  }

  this.draw = function(){
    this.buffers[0].render(renderer, this.camera, true);
    this.buffers[1].render(renderer, this.camera, true);
    this.buffers[2].render(renderer, this.camera, true);
    this.swapBuffers();

  }

  this.swapBuffers = function() {
      var a = this.buffers[2].renderTarget.texture;
      this.buffers[2].renderTarget.texture = this.buffers[1].renderTarget.texture;
      this.buffers[1].renderTarget.texture = a;
  }
}

function AShader(){
  this.uniforms = THREE.UniformsUtils.merge([
      {
          "texture_a": { value: null },
          "texture_b": { value: null },
          "texture_base": { value: null },
          "texture_src": { value: null },
          "resolution": { value: null },
          "texture_resolution": { value: null },
          "mouse": { value: null },
          "frame": { value: 0.0 },
          "time": { value: 0.0 },
      }
  ]);


  this.vertexShader = glslify('../shaders/poisson/bufferB.vert')

  this.fragmentShader = glslify('../shaders/poisson/bufferA.frag')

}

function BShader(){
  this.uniforms = THREE.UniformsUtils.merge([
      {
          "texture": { value: null },
          "texture_a": { value: null },
          "texture_b": { value: null },
          "resolution": { value: null },
          "mouse": { value: null },
          "frame": { value: 0.0 },
          "time": { value: 0.0 },
      }
  ]);


  this.vertexShader = glslify('../shaders/poisson/bufferB.vert')

  this.fragmentShader = glslify('../shaders/poisson/bufferB.frag')

}

function ImageShader(){
    this.uniforms = THREE.UniformsUtils.merge([
        {
            "texture": { value: null },
            "resolution": { value: null },
            "mouse": { value: null },
            "frame": { value: 0.0 },
            "time": { value: 0.0 },
        }
    ]);

    this.vertexShader = glslify('../shaders/poisson/image.vert')

    this.fragmentShader = glslify('../shaders/poisson/image.frag')

}

export default Poisson;
