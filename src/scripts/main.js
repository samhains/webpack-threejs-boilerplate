import * as THREE from 'three';
import InputTexture from './InputTexture';
import Poisson from './Poisson';


function Main() {

var id;
var container = document.getElementById("container");
var renderer, scene, camera;
var renderSize = new THREE.Vector2(0.0, 0.0);
var uniforms;
var poisson;
var clock, time = 0.0;
var debounceResize;
var diffusion;
var loader = new THREE.TextureLoader();
loader.setPath("../textures/");
var itemsLoaded = 0, totalAssetCount = 2;
var inputTexture;
var inputTexture_base;

var tex0 = loader.load("004_22a.jpg", loadCounter);
var tex1 = loader.load("023_04a.jpg", loadCounter);
	function loadCounter(){
		itemsLoaded++;
		if(itemsLoaded >= totalAssetCount){
			init();
		}
	}

function init(){
	setRenderSize();
	initGraphics();
	initUniforms();
	initInputTexture();
	initPoisson();

	debounceResize = debounce(onWindowResize, 250);
    window.addEventListener("resize", debounceResize);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener('touchdown', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
	animate();

}

function initGraphics(){

	renderer = new THREE.WebGLRenderer({
		preserveDrawingBuffer: true,
		antialias: true,
		alpha: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(renderSize.x, renderSize.y);
	renderer.setClearColor(0xffffff);
	container.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	camera = new THREE.OrthographicCamera( renderSize.x / - 2, renderSize.x / 2, renderSize.y / 2, renderSize.y / - 2, -100000, 100000 );

	camera.position.z = 500;

	clock = new THREE.Clock();

}
function initUniforms(){
	uniforms = {
		"resolution": renderSize,
		"mouse": new THREE.Vector2(0.0,0.0),
		"time": 0.0,
		"frame": 0,
		"texture_resolution": new THREE.Vector2(3072.0/3.0, 2048.0/3.0)
	}
}
function initInputTexture(){

	inputTexture = new InputTexture(tex0, renderer, renderSize, uniforms);
	console.log('input', inputTexture)
	inputTexture.init();

	inputTexture_base = new InputTexture(tex1, renderer, renderSize);
	inputTexture_base.init();
}
function initPoisson(){
	poisson = new Poisson(renderer, renderSize, uniforms, tex0, tex1);
	poisson.init();
}

function animate(){
	id = requestAnimationFrame(animate);
	draw();
}

function draw(){

	time += 0.05;
	uniforms["time"] = time;
	uniforms["frame"]++;

	poisson.draw();

	renderer.render(poisson.buffers[2].scene, poisson.camera);

}

function setRenderSize(){
	renderSize = new THREE.Vector2(window.innerWidth, window.innerHeight);
}

function onWindowResize(event){
    setRenderSize();
    renderer.setSize(renderSize.x, renderSize.y);
    uniforms["resolution"] = new THREE.Vector2(renderSize.x, renderSize.y);
    camera.updateProjectionMatrix();
}
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}


function onMouseMove(event) {
	uniforms["mouse"].x = (event.pageX / renderSize.x) * 2 - 1;
	uniforms["mouse"].y = -(event.pageY / renderSize.y) * 2 + 1;
}
function onDocumentTouchStart(event) {
	// handleAudio();
    updateMouse(event);
}

function onDocumentTouchMove(event) {
	// handleAudio();
    updateMouse(event);
}

function updateMouse(event) {
    if (event.touches.length === 1) {
        uniforms["mouse"].x = (event.touches[0].pageX / renderSize.x) * 2 - 1;
        uniforms["mouse"].y = -(event.touches[0].pageY / renderSize.y) * 2 + 1;
    }
}
function onMouseDown() {

}

function onDocumentTouchStart(event) {
    updateMouse(event);
}

function onDocumentTouchMove(event) {
    updateMouse(event);
}

function updateMouse(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
        uniforms["mouse"].x = (event.touches[0].pageX / renderSize.x) * 2 - 1;
        uniforms["mouse"].y = -(event.touches[0].pageY / renderSize.y) * 2 + 1;
    }
}
}

export default Main;
