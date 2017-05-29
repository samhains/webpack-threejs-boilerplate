import * as THREE from 'three';
const glslify = require( 'glslify' );
const bufferFrag = glslify( './../shaders/bufferA.frag' );
const imageFrag = glslify( './../shaders/image.frag' );

function Main() {

	let scene;
	let camera;
	let renderer;
	let bufferScene;
	let textureA;
	let textureB;
	let bufferMaterial;
	let plane;
	let bufferObject;
	let finalMaterial;
	let quad;

	function sceneSetup() {

		//This is the basic scene setup
		scene = new THREE.Scene();
		let width = window.innerWidth;
		let height = window.innerHeight;
		//Note that we're using an orthographic camera here rather than a prespective
		camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, - 1, 1000 );

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( width, height );

		document.body.appendChild( renderer.domElement );
		plane = new THREE.PlaneBufferGeometry( width, height );
		bufferObject = new THREE.Mesh( plane, bufferMaterial );
		bufferScene.add( bufferObject );
		quad = new THREE.Mesh( plane, finalMaterial );
		scene.add( quad );

	}

	function setupWebCam() {

		let width = window.innerWidth;
		let height = window.innerHeight;

		let constraints = { audio: false, video: { width: width, height: height } };
		navigator.mediaDevices.getUserMedia( constraints )
			.then( function ( mediaStream ) {

				video.srcObject = mediaStream;
				video.onloadedmetadata = () => {

					video.play();

				};

			} )
			.catch( ( err ) => console.log( err.name + ": " + err.message ) );

	}

	function bufferTextureSetup( webCam = true ) {

		let width = window.innerWidth;
		let height = window.innerHeight;

		let video = document.getElementById( 'video' );

		if ( webCam ) {

			setupWebCam();

		}

		let videoTexture = new THREE.VideoTexture( video );

		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;
		videoTexture.format = THREE.RGBFormat;
		bufferScene = new THREE.Scene();
		textureA = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter } );
		textureB = new THREE.WebGLRenderTarget( width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter } );

		bufferMaterial = new THREE.ShaderMaterial( {
			uniforms: {
				iChannel0: { value: videoTexture },
				iChannel1: { value: textureA },
				iResolution: { value: new THREE.Vector2( width, height ) },
				iGlobalTime: { value: 0.0 }
			},
			fragmentShader: bufferFrag
		} );

		finalMaterial = new THREE.ShaderMaterial( {
			uniforms: {
			 iChannel1: { value: textureB },
			 iResolution: { value: new THREE.Vector2( width, height ) },
			 iChannel0: { value: videoTexture },
			 iGlobalTime: { value: 0.0 }
			},
			fragmentShader: imageFrag
		} );


	}


	function render() {

	  requestAnimationFrame( render );

	  //Draw to textureB
	  renderer.render( bufferScene, camera, textureB );

	  //Swap textureA and B
	  let t = textureA;
	  textureA = textureB;
	  textureB = t;

	  //quad.material.map = textureB;
	  bufferMaterial.uniforms.iChannel1.value = textureA;

	  //Update time
	  quad.material.uniforms.iGlobalTime.value += 0.5;
	  bufferMaterial.uniforms.iGlobalTime.value += 0.5;

	  //Finally, draw to the screen
	  renderer.render( scene, camera );

	}

	bufferTextureSetup();

	sceneSetup();

	render();


}

export default Main;
