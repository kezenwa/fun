/*
TODO
- Mycket events! Typ GameObject.stateChange.trigger(), Player.onStateChange(if state == 'running');
*/

/**
 * Wrapper class for entire game.
 *
 * @constructor
 *
 * @param {HTMLElement} canvas - Canvas element to draw the game on
 * @param {HTMLElement} debug - (Optional) Canvas element to draw debug data on
 */
var Game = {
	// Config
	gravity: 20, 
	pxPerM: 50, 
	speed: 1, 

	// Game states
	paused: false, 
	started: false, 
	ended: false, 

	// Technical
	fps: 0, 
	lastTime: new Date().getTime(), 
	currTime: 0, 
	deltaTime: 0, 

	// Game objects and camera
	gameObjects: [], 
	camera: false, 

	// Canvas element
	canvas: false, 
	canvasCtx: false, 
	canvasDim: false, 

	init: function (canvas, debug) {
		this.canvas		= canvas;
		this.canvasCtx	= canvas.getContext('2d');
		this.canvasDim	= canvas.getBoundingClientRect();
		this.camera		= new Camera(canvas);

		this.fixCanvasSize();
	}, 

	fixCanvasSize: function () {
		
	}, 

	/**
	 * Starts (or restarts) the game.
	 *
	 * @param {Level} level - Which level to start on
	 */
	start: function (level) {
		if (!this.canvas) {
			console.error('No canvas specified. Run init(canvasElement) first.');
		}
	}, 

	/**
	 * Pauses the game. Call again to un-pause.
	 */
	pause: function () {
		if (!this.canvas) {
			console.error('No canvas specified. Run init(canvasElement) first.');
		}
	}
};
