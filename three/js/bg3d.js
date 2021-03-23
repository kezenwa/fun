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
			envMap: 'assets/envmap.jpg',
			fov: 50,
			easing: TWEEN.Easing.Quadratic.InOut,
			camTransDur: 1000,
			dev: false
		}, conf);

		this.init();
		this.load();
		this.loadEnv();
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

	copyCameraPos () {
		const cameraPos = {
			x: this.camera.position.x,
			y: this.camera.position.y,
			z: this.camera.position.z,
			rx: this.camera.rotation.x,
			ry: this.camera.rotation.y,
			rz: this.camera.rotation.z
		};

		console.log(JSON.stringify(cameraPos));
	}

	///////
	// Init
	init () {
		// Store references here
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
		// this.controls.enableDamping = true;
		// this.controls.dampingFactor = 0.05;
		this.controls.rotateSpeed = 1;
		this.controls.screenSpacePanning = false;
	}

	///////
	// Load
	// Load scene, enable shadows and store references to our objects
	load () {
		const loader = new GLTFLoader();

		loader.load(this.config.scene, glb => {
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
			this.grabObjects();
		});
	}

	loadEnv () {
		const loader = new THREE.TextureLoader();

		loader.load(this.config.envMap, texture => {
			const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);

			renderTarget.fromEquirectangularTexture(this.renderer, texture);

			this.scene.environment = renderTarget.texture;
		});
	}

	///////////////
	// Grab Objects
	// Save references to our objects and their original positions
	grabObjects () {
		const objects = ['work', 'globe', 'flower_enemy', 'block_brick', 'block_brick_2', 'block_question', 'laptop_screen', 'compass_arrow']

		objects.forEach(objName => {
			const obj = this.scene.getObjectByName(objName);

			if (obj) {
				obj.userData.origPos = {
					x: obj.position.x,
					y: obj.position.y,
					z: obj.position.z
				};
				obj.userData.origRot = {
					x: obj.rotation.x,
					y: obj.rotation.y,
					z: obj.rotation.z
				};

				this.objects[objName] = obj;
			}
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

		// NOTE: Instead of just animating the camera.rotation directly,
		// we need to animate this temporary object and update the camera rotation every time it updates (for some reason...)
		// https://stackoverflow.com/questions/66734479/unable-to-tween-threejs-camera-rotation
		const oldRot = {
			x: this.camera.rotation.x,
			y: this.camera.rotation.y,
			z: this.camera.rotation.z
		};

		new TWEEN.Tween(oldRot).to({x: newPos.rx, y: newPos.ry, z: newPos.rz}, this.config.camTransDur).easing(this.config.easing).start().onUpdate(() => {
			this.camera.rotation.x = oldRot.x;
			this.camera.rotation.y = oldRot.y;
			this.camera.rotation.z = oldRot.z;
		});

		// NOTE: This doesn't work
		/* new TWEEN.Tween(this.camera.rotation).to({x: newPos.rx, y: newPos.ry, z: newPos.rz}, this.config.camTransDur).easing(this.config.easing).start().onComplete(() => {
			this.camera.rotation.x = newPos.rx;
			this.camera.rotation.y = newPos.ry;
			this.camera.rotation.z = newPos.rz;
		}); */

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
		// NOTE: Could definitely use solution from above here too, but not using lookAt so
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
	// Change position of camera (actually move the scene around)
	mousePos () {
		document.body.addEventListener('mousemove', e => {
			const halfW = window.innerWidth / 2;
			const halfH = window.innerHeight / 2;
			const x = ((e.clientX - halfW) / halfW) * 0.1;
			const y = ((e.clientY - halfH) / halfH) * 0.1;

			// this.scene.rotation.x = y;
			this.scene.position.y = y;
			this.scene.position.x = -x;
		});
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

		if (this.objects.block_brick && this.objects.block_brick_2 && this.objects.block_question) {
			this.objects.block_brick_2.position.y = this.objects.block_brick_2.userData.origPos.y + (Math.sin(this.clock.getElapsedTime() * 2) / 500);
			this.objects.block_question.position.y = this.objects.block_question.userData.origPos.y + (Math.sin((this.clock.getElapsedTime() + 0.5) * 2) / 500);
			this.objects.block_brick.position.y = this.objects.block_brick.userData.origPos.y + (Math.sin((this.clock.getElapsedTime() + 1) * 2) / 500);
		}

		if (this.objects.flower_enemy) {
			this.objects.flower_enemy.position.y = this.objects.flower_enemy.userData.origPos.y - (Math.sin(this.clock.getElapsedTime()) / 15 + this.objects.flower_enemy.userData.origPos.y / 3);
			this.objects.flower_enemy.rotation.y = this.clock.getElapsedTime() / 2;
		}

		if (this.objects.laptop_screen) {
			this.objects.laptop_screen.rotation.x = this.objects.laptop_screen.userData.origRot.x + (Math.sin(this.clock.getElapsedTime() / 2) / 5);
		}

		if (this.objects.compass_arrow) {
			this.objects.compass_arrow.rotation.y = this.objects.compass_arrow.userData.origRot.y + (Math.sin(this.clock.getElapsedTime()));
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
