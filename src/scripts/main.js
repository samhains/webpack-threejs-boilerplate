import * as THREE from 'three';
import AbstractApplication from 'scripts/views/AbstractApplication';
const glslify = require( 'glslify' );
const bufferFrag = glslify( './../shaders/bufferA.frag' );
const imageFrag = glslify( './../shaders/image.frag' );

function Main()  {
	var scene;
	var camera;
	var renderer;

	function sceneSetup() {
		//This is the basic scene setup
		scene = new THREE.Scene();
		var width = window.innerWidth;
		var height = window.innerHeight;
		//Note that we're using an orthographic camera here rather than a prespective
		camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
		camera.position.z = 2;

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
	}

	var bufferScene;
	var textureA;
	var textureB;
	var bufferMaterial;
	var plane;
	var bufferObject;
	var finalMaterial;
	var quad;

	function bufferTextureSetup(){
		let video = document.getElementById( 'video' );
		let texture = new THREE.VideoTexture( video );

		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.format = THREE.RGBFormat;
		//Create buffer scene
		bufferScene = new THREE.Scene();
		//Create 2 buffer textures
		textureA = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
		textureB = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter} );
		//Pass textureA to shader

		bufferMaterial = new THREE.ShaderMaterial( {
			uniforms: {
				u_tex: { type: "t", value: texture },
				bufferTexture: { type: "t", value: textureA },
				u_resolution : {type: 'v2',value:new THREE.Vector2(window.innerWidth,window.innerHeight)},//Keeps the resolution
				u_time: {type:"f",value:Math.random()*Math.PI*2+Math.PI}
			},
			fragmentShader: bufferFrag
		} );

		plane = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight );
		bufferObject = new THREE.Mesh( plane, bufferMaterial );
		bufferScene.add(bufferObject);

		finalMaterial = new THREE.ShaderMaterial( {
			uniforms: {
			 bufferTexture: { type: "t", value: textureB },
			 u_resolution : {type: 'v2',value:new THREE.Vector2(window.innerWidth,window.innerHeight)},//Keeps the resolution
			 u_time: {type:"f",value:Math.random()*Math.PI*2+Math.PI}
			},
			fragmentShader: imageFrag
		} );
		//Draw textureB to screen 
		quad = new THREE.Mesh( plane, finalMaterial );
		scene.add(quad);
	}

	//Initialize the Threejs scene
	sceneSetup();

	//Setup the frame buffer/texture we're going to be rendering to instead of the screen
	bufferTextureSetup();

	

	//Render everything!
	function render() {

	  requestAnimationFrame( render );

	  //Draw to textureB
	  renderer.render( bufferScene, camera, textureB, true );
		
	  //Swap textureA and B
	  var t = textureA;
	  textureA = textureB;
	  textureB = t;

	  quad.material.map = textureB;
	  bufferMaterial.uniforms.bufferTexture.value = textureA;

	  //Update time
	  bufferMaterial.uniforms.u_time.value += 0.01;

	  //Finally, draw to the screen
	  renderer.render( scene, camera );
	}
	render();




}

export default Main;
