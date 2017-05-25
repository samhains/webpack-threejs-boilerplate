import * as THREE from 'three';
import AbstractApplication from 'scripts/views/AbstractApplication';
const glslify = require( 'glslify' );
const bufferVert = glslify( './../shaders/bufferA.vert' );
const bufferFrag = glslify( './../shaders/bufferA.frag' );
const imageVert = glslify( './../shaders/image.vert' );
const imageFrag = glslify( './../shaders/image.frag' );
const testFrag = glslify( './../shaders/test.frag' );

class Main extends AbstractApplication {

	constructor() {

		super();

		let geometry = new THREE.PlaneBufferGeometry( 2, 2 );
		this.startTime = Date.now();

		let video = document.getElementById( 'video' );
		let texture = new THREE.VideoTexture( video );

		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.format = THREE.RGBFormat;

		this.bufferMaterial = new THREE.ShaderMaterial( {
			uniforms: this.buildUniforms( { u_buffer: { type: 't', value: this.bufferTextureA }, smokeSource: {type:"v3",value:new THREE.Vector3(0,0,0) } 
			} ),
			vertexShader: bufferVert,

			fragmentShader: testFrag,
		}
		);
		this.finalMaterial = new THREE.MeshBasicMaterial({map: this.bufferTextureB});

		//let imageMaterial = new THREE.ShaderMaterial( {
			//uniforms: this.buildUniforms( { u_buffer: { type: 't', value: this.bufferTextureA.texture } } ),
			//vertexShader: imageVert,

			//fragmentShader: testFrag,
		//} );

		this.bufferMesh = new THREE.Mesh( geometry, this.bufferMaterial );
		this.bufferScene.add( this.bufferMesh );

		this.mesh = new THREE.Mesh( geometry, this.finalMaterial );
		this.scene.add( this.mesh );
		 //Send position of smoke source with value
        var mouseDown = false;

        function UpdateMousePosition(event){
			var X = event.clientX;
			var Y = event.clientY;
            var mouseX = X;
            var mouseY = window.innerHeight - Y;
            this.bufferMaterial.uniforms.smokeSource.value.x = mouseX;
            this.bufferMaterial.uniforms.smokeSource.value.y = mouseY;
        }

		function UpdateMouseDown(event) {
            mouseDown = true;
            this.bufferMaterial.uniforms.smokeSource.value.z = 0.1;
		}

        document.onmousemove = UpdateMousePosition.bind(this);

        document.onmousedown = UpdateMouseDown.bind(this);

        document.onmouseup = function(event){
            mouseDown = false;
            this.bufferMaterial.uniforms.smokeSource.value.z = 0;
        }.bind(this)

		this.animate();

	}

	buildUniforms( props ) {

		return Object.assign( props, this.uniforms );

	}

	prepareBuffers() {

		this.mesh.material.map = this.bufferTextureB;
		this.bufferMaterial.uniforms.u_buffer.value = this.bufferTextureA.texture;

	}

	animate() {

		super.animate( this.prepareBuffers.bind( this ) );

	}

}

export default Main;
