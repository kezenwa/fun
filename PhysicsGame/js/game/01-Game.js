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
var Game = function (canvas, debug) {
	// Config
	this.gravity = 20;
	this.pxPerM = 50;
	this.speed = 1;

	// Game states
	this.paused = false;
	this.started = false;
	this.ended = false;

	// Technical
	this.fps = 0;
	this.lastTime = new Date().getTime();
	this.currTime = 0;
	this.deltaTime = 0;

	// Game objects and camera
	this.gameObjects = [];
	this.camera = new Camera(canvas);

	// Canvas element
	this.canvas = canvas;
	this.canvasCtx = canvas.getContext('2d');
	this.canvasDim = canvas.getBoundingClientRect();
	
	console.dir(canvas);

	/**
	 * Starts (or restarts) the game.
	 *
	 * @param {String} level - Which level to start on
	 */
	this.start = function (level) {
		
	};

	/**
	 * Pauses the game. Call again to un-pause.
	 */
	this.pause = function () {
		
	};
};
