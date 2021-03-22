'use strict';

/////////
// Vendor
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';

//////
// App
export default class Bg3d {
	//////////////
	// Constructor
	constructor (el, conf) {
		this.el = el;
		this.config = Object.assign({
			scene: 'assets/alcom.glb',
			fov: 45,
			easing: TWEEN.Easing.Quadratic.InOut,
			camTransDur: 750,
			dev: false
		}, conf);

		this.init();
		this.load();
		this.floor();
		this.lights();

		if (this.config.dev) {
			document.documentElement.classList.add('dev');
			this.controls();
		}
		else {
			this.cameraPos();
			this.mousePos();
		}
	}

	///////
	// Init
	init () {
		// Store objects in the scene here later
		this.objects = {};

		// Create scene, renderer etc
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		this.camera = new THREE.PerspectiveCamera(this.config.fov, this.el.clientWidth / this.el.clientHeight, 0.01, 5000);

		this.camera.position.z = 5;

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
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		// this.controls.autoRotate = true;
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.05;
		this.controls.rotateSpeed = 1;
	}

	///////
	// Load
	// Load scene, enable shadows and store references to our objects
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

			// Add scene
			this.scene.add(glb.scene);

			// Grab objects
			this.objects.monitor = this.scene.getObjectByName('monitor');
			this.objects.mouse = this.scene.getObjectByName('mouse');
			this.objects.globe = this.scene.getObjectByName('globe');
		});
	}

	/////////
	// Lights
	lights () {
		this.ambLight = new THREE.AmbientLight(0xffffff, 1);
		this.scene.add(this.ambLight);

		this.spotLight = new THREE.SpotLight(0xffffff, 2.5);

		this.spotLight.position.set(-10, 10, 10);
		this.spotLight.castShadow = true;
		this.spotLight.shadow.bias = -0.0002;
		this.spotLight.shadow.mapSize.width = 512 * 8;
		this.spotLight.shadow.mapSize.height = 512 * 8;
		this.spotLight.shadow.camera.near = 1;
		this.spotLight.shadow.camera.far = 1000;

		this.scene.add(this.spotLight);
	}

	////////
	// Floor
	// Create a transparent shadow catcher
	floor () {
		// https://threejs.org/docs/#api/en/materials/ShadowMaterial
		const geometry = new THREE.PlaneGeometry(2000, 2000);
		geometry.rotateX(-Math.PI / 2);

		const material = new THREE.ShadowMaterial();
		material.opacity = 0.2;

		this.floor = new THREE.Mesh(geometry, material);
		this.floor.receiveShadow = true;
		this.scene.add(this.floor);
	}

	/////////////
	// Camera pos
	// Change position and rotation of camera as user scrolls into a new [data-camera-pos] element
	cameraPos () {
		const observer = new IntersectionObserver(entries => entries.forEach(entry => {
			if (entry.isIntersecting) {
				this.setCameraPos(JSON.parse(entry.target.dataset.cameraPos));
			}
		}), {threshold: 0.25});

		document.querySelectorAll('[data-camera-pos]').forEach(el => observer.observe(el));
	}

	setCameraPos (newPos) {
		new TWEEN.Tween(this.camera.position).to({x: newPos.x, y: newPos.y, z: newPos.z}, this.config.camTransDur).easing(this.config.easing).start();
		new TWEEN.Tween(this.camera.rotation).to({x: newPos.rx, y: newPos.ry, z: newPos.rz}, this.config.camTransDur).easing(this.config.easing).start().onComplete(() => {
			this.camera.rotation.x = newPos.rx;
			this.camera.rotation.y = newPos.ry;
			this.camera.rotation.z = newPos.rz;
		});

		// Tween rotation with lookAt
		// https://stackoverflow.com/a/25278875/1074594
		/* const initRot = new THREE.Euler().copy(this.camera.rotation);

		console.log('INITIAL:');
		console.log(initRot);

		// Look at new position temporarily
		this.camera.lookAt(newPos.lx, newPos.ly, newPos.lz);

		// Copy rotation of new lookAt
		const newRot = new THREE.Euler().copy(this.camera.rotation);

		console.log('NEW:');
		console.log(newRot);

		// Go back to initial rotation
		this.camera.rotation.copy(initRot);

		// Now tween to new rotation
		// WTF does this not work!?
		// https://stackoverflow.com/questions/66734479/unable-to-tween-threejs-camera-rotation
		new TWEEN.Tween(this.camera.rotation).to({x: newRot.x, y: newRot.y, z: newRot.z}, this.config.camTransDur).easing(this.config.easing).start().onComplete(() => {
			console.log('Setting rotation manually');
			console.log(newRot);

			this.camera.rotation.x = newRot.x;
			this.camera.rotation.y = newRot.y;
			this.camera.rotation.z = newRot.z;
		}); */
	}

	////////////
	// Mouse pos
	// Change position of camera as mouse moves but always look at target
	mousePos () {
		// TODO
	}

	//////////
	// Animate
	animate () {
		if (this.controls && this.controls.update) {
			this.controls.update();
		}

		if (this.objects.monitor) {
			this.objects.monitor.position.y = 0.1 + ((Math.sin(this.clock.getElapsedTime()) / 20) + 0.1);
		}

		if (this.objects.mouse) {
			this.objects.mouse.position.z = 0.4 + (Math.sin(this.clock.getElapsedTime() / 2) / 20);
		}

		if (this.objects.globe) {
			this.objects.globe.rotation.y = this.clock.getElapsedTime() / 4;
		}

		TWEEN.update();
	}

	/////////
	// Render
	render () {
		this.animate();
		this.renderer.render(this.scene, this.camera);
	}
}
