'use strict';

/////////
// Vendor
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js';

import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
// import { TransformControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/TransformControls.js';
// import { EffectComposer } from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/RenderPass.js';
// import { GlitchPass } from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/GlitchPass.js';
// import { BokehPass } from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/BokehPass.js';
// import { UnrealBloomPass } from 'https://unpkg.com/three@0.126.1/examples/jsm/postprocessing/UnrealBloomPass.js';

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
			dev: false // NOTE: Dev mode - enables free camera and more
		}, conf);

		// Enable dev through query string
		const params = new URLSearchParams(window.location.search);

		if (params.get('dev')) {
			this.config.dev = true;
		}

		// Kick off
		this.init();
		this.load();
		this.loadEnv();
		this.lights();
		// this.postProcessing(); NOTE: Disabled PP for now not sure how to keep BG transparent :/

		if (this.config.dev) {
			document.documentElement.classList.add('dev'); // NOTE: Some CSS differs in dev mode
			this.camera.position.z = 10;
			this.scene.add(new THREE.AxesHelper(500));
			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		}
		else {
			this.floor();
			this.cameraPos();
			// this.mousePos(); // NOTE: Disabled for now... not sure if needed??
		}
	}

	///////////////////////
	// Copy camera position
	// Copies current camera position, used from console in dev mode and copied to different sections in index.html
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

	forceCameraPos (pos) {
		this.camera.position.x = pos.x;
		this.camera.position.x = pos.y;
		this.camera.position.x = pos.z;
		this.camera.rotation.x = pos.rx;
		this.camera.rotation.y = pos.ry;
		this.camera.rotation.z = pos.rz;
	}

	///////
	// Init
	init () {
		// Store object references here
		this.objects = {};

		// Create scene, renderer etc
		this.clock = new THREE.Clock();
		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		this.camera = new THREE.PerspectiveCamera(this.config.fov, this.el.clientWidth / this.el.clientHeight, 0.01, 5000);

		// Shadows
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

		// Render size
		this.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.el.appendChild(this.renderer.domElement);

		// Resize
		window.addEventListener('resize', e => {
			this.camera.aspect = this.el.clientWidth / this.el.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(this.el.clientWidth, this.el.clientHeight);
		});
	}

	///////
	// Load
	// Load scene, enable shadows and store references to our objects
	load () {
		const loader = new GLTFLoader();

		loader.load(this.config.scene, glb => {
			glb.scene.traverse(node => {
				// Cast shadows on all meshes
				if (node.isMesh) {
					node.castShadow = true;
					node.receiveShadow = true;

					// And do this...? Anisotropic Filtering I guess?
					if (node.material.map) {
						node.material.map.anisotropy = 16;
					}
				}
				// Make lights cast shadows!
				else if (node.isLight) {
					node.castShadow = true;
					node.shadow.bias = -0.0002;
					node.shadow.mapSize.width = 512 * 8;
					node.shadow.mapSize.height = 512 * 8;
					node.shadow.camera.near = 1;
					node.shadow.camera.far = 1000;

					if (this.config.dev) {
						this.scene.add(new THREE.SpotLightHelper(node));
					}
				}
			});

			// Add scene
			this.scene.add(glb.scene);

			// Grab objects
			this.grabObjects();

			// Hide dev floor
			if (!this.config.dev) {
				const devFloor = this.scene.getObjectByName('dev_floor');

				if (devFloor) {
					devFloor.visible = false;
				}
			}
		});
	}

	////////////////////////
	// Load evnvironment map
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
		const objects = [
			'globe', 'flower_enemy', 'block_brick', 'block_brick_2', 'block_question',
			'mushroom', 'laptop_screen', 'compass_arrow', 'espresso_crema', 'lamp_head'
		];

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
	// NOTE: Lights are included in the scene
	lights () {
		this.ambLight = new THREE.AmbientLight(0xffffff, 0.5);
		this.scene.add(this.ambLight);

		/* this.spotLight = new THREE.SpotLight(0xffffff, 2.5, 0, Math.PI / 10, 1);

		this.spotLight.position.set(-10, 10, 10);

		this.spotLight.castShadow = true;
		this.spotLight.shadow.bias = -0.0002;
		this.spotLight.shadow.mapSize.width = 512 * 8;
		this.spotLight.shadow.mapSize.height = 512 * 8;
		this.spotLight.shadow.camera.near = 1;
		this.spotLight.shadow.camera.far = 1000;

		this.scene.add(this.spotLight);

		if (this.config.dev) {
			this.scene.add(new THREE.SpotLightHelper(this.spotLight));
		} */
	}

	////////
	// Floor
	// Create a transparent shadow catcher
	// https://threejs.org/docs/#api/en/materials/ShadowMaterial
	floor () {
		const geometry = new THREE.PlaneGeometry(2000, 2000);
		geometry.rotateX(-Math.PI / 2);

		const material = new THREE.ShadowMaterial();
		material.opacity = 0.2;

		this.floor = new THREE.Mesh(geometry, material);
		this.floor.receiveShadow = true;
		this.scene.add(this.floor);
	}

	//////////////////
	// Post processing
	postProcessing () {
		this.composer = new EffectComposer(this.renderer);

		const render = new RenderPass(this.scene, this.camera);
		const glitch = new GlitchPass();
		const bloom = new UnrealBloomPass({x: this.el.clientWidth, y: this.el.clientHeight}, 1.5, 0.5, 0.85);
		const bokeh = new BokehPass(this.scene, this.camera, {
			focus: 1.0,
			aperture: 0.025,
			maxblur: 1.0,
			width: this.el.clientWidth,
			height: this.el.clientHeight
		});

		this.composer.addPass(render);
		// this.composer.addPass(bokeh);
		// this.composer.addPass(glitch);
		// this.composer.addPass(bloom);
	}

	/////////////
	// Camera pos
	// Change position and rotation of camera as user scrolls into a new [data-camera-pos] element
	cameraPos () {
		const observer = new IntersectionObserver(entries => entries.forEach(entry => {
			if (entry.isIntersecting) {
				console.log(JSON.parse(entry.target.dataset.cameraPos));
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
			const x = ((e.clientX - halfW) / halfW) * 0.025; // NOTE: 0.025 = limit movement a lot
			const y = ((e.clientY - halfH) / halfH) * 0.025;

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

		// Play
		if (this.objects.block_brick && this.objects.block_brick_2 && this.objects.block_question) {
			this.objects.block_brick.position.y = this.objects.block_brick.userData.origPos.y + (Math.sin(this.clock.getElapsedTime() * 2) / 500);
			this.objects.block_question.position.y = this.objects.block_question.userData.origPos.y + (Math.sin((this.clock.getElapsedTime() + 0.5) * 2) / 500);
			this.objects.block_brick_2.position.y = this.objects.block_brick.userData.origPos.y + (Math.sin((this.clock.getElapsedTime() + 1) * 2) / 500);
		}

		if (this.objects.flower_enemy) {
			this.objects.flower_enemy.position.y = this.objects.flower_enemy.userData.origPos.y - (Math.sin(this.clock.getElapsedTime()) / 15 + this.objects.flower_enemy.userData.origPos.y / 3);
			this.objects.flower_enemy.rotation.y = this.clock.getElapsedTime() / 2;
		}

		if (this.objects.mushroom) {
			this.objects.mushroom.position.y = this.objects.mushroom.userData.origPos.y - (Math.sin(this.clock.getElapsedTime()) / 30);
			this.objects.mushroom.rotation.y = this.clock.getElapsedTime() * 4;
		}

		// Work
		if (this.objects.laptop_screen) {
			this.objects.laptop_screen.rotation.x = this.objects.laptop_screen.userData.origRot.x + (Math.sin(this.clock.getElapsedTime() / 1) / 5);
		}

		if (this.objects.espresso_crema) {
			this.objects.espresso_crema.rotation.y = -(this.clock.getElapsedTime() / 4);
		}

		if (this.objects.lamp_head) {
			this.objects.lamp_head.rotation.y = this.objects.lamp_head.userData.origRot.y + (Math.sin(this.clock.getElapsedTime() / 2.5) / 4);
		}

		// Contact
		if (this.objects.globe) {
			this.objects.globe.rotation.y = this.clock.getElapsedTime() / 4;
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
		// this.composer.render();
	}
}
