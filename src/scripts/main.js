import * as THREE from 'three';
import AbstractApplication from 'scripts/views/AbstractApplication';
const glslify = require( 'glslify' );
const shaderVert = glslify( './../shaders/custom.vert' );
const shaderFrag = glslify( './../shaders/custom.frag' );

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
		this.uniforms.u_tex = { type: 't', value: texture };

		let material = new THREE.ShaderMaterial( {
			uniforms: this.uniforms,
			vertexShader: shaderVert,

			fragmentShader: shaderFrag,
		} );

		this.mesh = new THREE.Mesh( geometry, material );
		this.scene.add( this.mesh );

		this.animate();

	}

	render() {

		super.animate();

	}

	animate() {

		this.render();

	}

}

export default Main;
