import * as THREE from 'three';
function Buffer(SHADER, renderer, renderSize, uniforms) {
    this.scene = new THREE.Scene();
    this.renderTarget, this.shader, this.material, this.geometry, this.mesh;
    this.setUniforms = function(UNIFORMS){
        for(var u in UNIFORMS){
            if(this.material.uniforms[u]){
                this.material.uniforms[u].value = UNIFORMS[u];
            }
        }
    }
    this.initialize = function(SHADER) {
        this.renderTarget = new THREE.WebGLRenderTarget(renderSize.x*2.0, renderSize.y*2.0, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        });
        renderer.clearTarget(this.renderTarget, true);
        this.shader = SHADER;
        this.material = new THREE.ShaderMaterial({
            uniforms: this.shader.uniforms,
            vertexShader: this.shader.vertexShader,
            fragmentShader: this.shader.fragmentShader,
            transparent: true,
            side: 2,
            depthWrite: false
        });
        this.material.extensions.derivatives = true;
        this.geometry = new THREE.PlaneGeometry(2,2);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(0, 0, 0);
        this.scene.add(this.mesh);
    };
    this.initialize(SHADER);
    this.setUniforms(uniforms);

    this.render = function(RENDERER, CAMERA, TO_TARGET) {
        this.setUniforms(uniforms);
        if(TO_TARGET){
            RENDERER.render(this.scene, CAMERA, this.renderTarget);
        }
    };

    this.dispose = function() {
        this.renderTarget.dispose();
        this.material.dispose();
        this.material.uniforms.texture.value.dispose();
        this.geometry.dispose();
        this.scene.remove(this.mesh);
    };
}

export default Buffer;
