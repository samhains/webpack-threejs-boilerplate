import * as THREE from 'three';
//import AbstractApplication from 'scripts/views/AbstractApplication';
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
		camera = new THREE.OrthographicCamera(width/-2, width/2,  height/2, height/-2, -10000, 10000);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( width, height );
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
		let videoTexture = new THREE.VideoTexture( video );

		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;
		//Create buffer scene
		bufferScene = new THREE.Scene();
		//Create 2 buffer textures
		console.log(window.innerWidth, window.innerHeight);
		textureA = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter});
		textureB = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter} );
		//Pass textureA to shader

		bufferMaterial = new THREE.ShaderMaterial( {
			uniforms: {
				iChannel0: { type: "t", value: videoTexture },
				iChannel1: { type: "t", value: textureA },
				iResolution : {type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight)},//Keeps the resolution
				iGlobalTime: {type:"f",value:0.0}
			},
			fragmentShader: bufferFrag
		} );

		plane = new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight );
		bufferObject = new THREE.Mesh( plane, bufferMaterial );
		bufferScene.add(bufferObject);

		finalMaterial = new THREE.ShaderMaterial( {
			uniforms: {
			 iChannel1: { type: "t", value: textureB },
			 iResolution : {type: 'v2',value:new THREE.Vector2(window.innerWidth,window.innerHeight)},//Keeps the resolution
			 iChannel0: { type: "t", value: videoTexture },
			 iGlobalTime: {type:"f",value:0.0}
			},
			fragmentShader: imageFrag
		} );
		//Draw textureB to screen 
		quad = new THREE.Mesh( plane, finalMaterial );
		scene.add(quad);
	}

	//Initialize the Threejs scene
	sceneSetup();

	//Setup the frame buffer/videoTexture we're going to be rendering to instead of the screen
	bufferTextureSetup();

	

	//Render everything!
	function render() {

	  requestAnimationFrame( render );

	  //Draw to textureB
	  renderer.render( bufferScene, camera, textureB );
		
	  //Swap textureA and B
	  var t = textureA;
	  textureA = textureB;
	  textureB = t;

	  quad.material.map = textureB;
	  bufferMaterial.uniforms.iChannel1.value = textureA;

	  //Update time
	  quad.material.uniforms.iGlobalTime.value += 0.5;
	  bufferMaterial.uniforms.iGlobalTime.value += 0.5;

	  //Finally, draw to the screen
	  renderer.render( scene, camera );
	}
	render();




}

export default Main;
