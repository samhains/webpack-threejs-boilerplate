import * as THREE from 'three';
import 'scripts/controls/OrbitControls';

class AbstractApplication {

	constructor() {

		this._uniforms = {
			u_time: { type: "f", value: 1.0 },
			u_resolution: { type: "v2", value: new THREE.Vector2() },
		};

		this._camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
		this._camera.position.z = 400;

		this._scene = new THREE.Scene();

		this._renderer = new THREE.WebGLRenderer();
		this._renderer.setPixelRatio( window.devicePixelRatio );
		this._renderer.setSize( window.innerWidth, window.innerHeight );
		this._uniforms.u_resolution.value.x = this._renderer.domElement.width;
		this._uniforms.u_resolution.value.y = this._renderer.domElement.height;

		document.body.appendChild( this._renderer.domElement );

		this._controls = new THREE.OrbitControls( this._camera, this._renderer.domElement );
		//this._controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
		this._controls.enableDamping = true;
		this._controls.dampingFactor = 0.25;
		this._controls.enableZoom = false;

		window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );


	}

	get camera() {

		return this._camera;

	}

	get uniforms() {

		return this._uniforms;

	}

	get scene() {

		return this._scene;

	}


	onWindowResize() {

		this._uniforms.u_resolution.value.x = this._renderer.domElement.width;
		this._uniforms.u_resolution.value.y = this._renderer.domElement.height;

		this._camera.aspect = window.innerWidth / window.innerHeight;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize( window.innerWidth, window.innerHeight );

	}

	animate( timestamp ) {

		requestAnimationFrame( this.animate.bind( this ) );

		this._uniforms.u_time.value += 0.05;
		this._controls.update();
		this._renderer.render( this._scene, this._camera );

	}


}
export default AbstractApplication;
