'use strict';

/////////
// Vendor
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';

//////
// App
class Bg3d {
	//////////////
	// Constructor
	constructor (el, conf) {
		this.el = el;
		this.config = Object.assign({
			scene: 'new.glb',
			fov: 45,
			easing: TWEEN.Easing.Quadratic.InOut,
			dev: true
		}, conf);

		this.init();
		this.load();
		this.lights();

		if (this.config.dev) {
			this.controls();
		}
	}

	///////
	// Init
	init () {
		// Create scene, renderer etc
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		this.camera = new THREE.PerspectiveCamera(this.config.fov, this.el.clientWidth / this.el.clientHeight, 0.01, 5000);

		this.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
		this.el.appendChild(this.renderer.domElement);

		// Shadows
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

		// Resize
		window.addEventListener('resize', e => {
			this.camera.aspect = this.el.clientWidth / this.el.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
		});
	}

	///////////
	// Controls
	controls () {
		this.camera.position.set(-10, 5, 45);
		this.scene.add(new THREE.AxesHelper(500));

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.autoRotate = true;
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.05;
		this.controls.rotateSpeed = 1;
	}

	///////
	// Load
	load () {
		this.loader = new GLTFLoader();

		this.loader.load(this.config.scene, glb => {
			// Cast shadows on all meshes
			glb.scene.traverse(node => {
				if (node.isMesh) {
					node.castShadow = true;
					node.receiveShadow = true;

					// And do this...? Anisotropic Filtering I guess?
					if (node.material.map) {
						node.material.map.anisotropy = 16;
					}
				}
			});

			this.scene.add(glb.scene);
			document.documentElement.classList.remove('loading');
		});
	}

	/////////
	// Lights
	lights () {
		this.ambLight = new THREE.AmbientLight(0xffffff, 1);
		this.scene.add(this.ambLight);

		this.spotLight = new THREE.SpotLight(0xffffff, 4);

		this.spotLight.position.set(-50, 50, 50);
		this.spotLight.castShadow = true;
		this.spotLight.shadow.bias = -0.0001;
		this.spotLight.shadow.mapSize.width = 512 * 8;
		this.spotLight.shadow.mapSize.height = 512 * 8;
		this.spotLight.shadow.camera.near = 1;
		this.spotLight.shadow.camera.far = 1000;

		this.scene.add(this.spotLight);

		if (this.config.dev) {
			this.scene.add(new THREE.SpotLightHelper(this.spotLight));
		}
	}

	/////////
	// Update
	update () {
		if (this.controls && this.controls.update) {
			this.controls.update();
		}

		TWEEN.update();
	}

	/////////
	// Render
	render () {
		this.update();
		this.renderer.render(this.scene, this.camera);
	}
}

///////////
// Kick off
const bg3d = new Bg3d(document.getElementById('bg'), {

});

function render () {
	bg3d.render();
	requestAnimationFrame(render);
}

render();
