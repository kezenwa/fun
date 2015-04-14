// 00-Global.js
// Shortcuts
b2Body = Box2D.Dynamics.b2Body,
b2BodyDef = Box2D.Dynamics.b2BodyDef,
b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
b2ContactImpulse = Box2D.Dynamics.b2ContactImpulse,
b2ContactListener = Box2D.Dynamics.b2ContactListener,
b2ContactManager = Box2D.Dynamics.b2ContactManager,
b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
b2DestructionListener = Box2D.Dynamics.b2DestructionListener,
b2FilterData = Box2D.Dynamics.b2FilterData,
b2Fixture = Box2D.Dynamics.b2Fixture,
b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
b2Island = Box2D.Dynamics.b2Island,
b2TimeStep = Box2D.Dynamics.b2TimeStep,
b2World = Box2D.Dynamics.b2World,
b2Mat22 = Box2D.Common.Math.b2Mat22,
b2Mat33 = Box2D.Common.Math.b2Mat33,
b2Math = Box2D.Common.Math.b2Math,
b2Sweep = Box2D.Common.Math.b2Sweep,
b2Transform = Box2D.Common.Math.b2Transform,
b2Vec2 = Box2D.Common.Math.b2Vec2,
b2Vec3 = Box2D.Common.Math.b2Vec3,
b2Color = Box2D.Common.b2Color,
b2internal = Box2D.Common.b2internal,
b2Settings = Box2D.Common.b2Settings,
b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
b2EdgeChainDef = Box2D.Collision.Shapes.b2EdgeChainDef,
b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape,
b2MassData = Box2D.Collision.Shapes.b2MassData,
b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
b2Shape = Box2D.Collision.Shapes.b2Shape,
b2BuoyancyController = Box2D.Dynamics.Controllers.b2BuoyancyController,
b2ConstantAccelController = Box2D.Dynamics.Controllers.b2ConstantAccelController,
b2ConstantForceController = Box2D.Dynamics.Controllers.b2ConstantForceController,
b2Controller = Box2D.Dynamics.Controllers.b2Controller,
b2ControllerEdge = Box2D.Dynamics.Controllers.b2ControllerEdge,
b2GravityController = Box2D.Dynamics.Controllers.b2GravityController,
b2TensorDampingController = Box2D.Dynamics.Controllers.b2TensorDampingController;
// 01-Game.js
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
// 02-Assets.js
var Assets = function () {
	this.bitmapData = {};
	this.audio = {};

	// TODO...
};
// 02-Camera.js
/**
 * Wrapper class for canvas camera (in reality the canvas context).
 *
 * @constructor
 *
 * @param {HTMLElement} canvas - Canvas element the camera is for
 */
var Camera = function (canvas) {
	this.panTo = function (x, y, duration) {
		// if x == GameObject then y = duration
	};

	this.zoom = function (zoomLevel, duration) {
		
	};

	this.follow = function (gameObject) {
		
	};

	this.unfollow = function () {
		
	};

	this.zoomToFit = function (gameObjects, duration) {
		
	};

	// :D
	this.handCam = function () {
		
	};

	// More effects...
};
// 02-GameObject.js
/**
 * Represents a game object.
 * TODO: Multiple bitmaps, animations, sounds, multiple fixtures! different sized box2d body and sprite etc etc etc
 *
 * @constructor
 *
 * @param {int} x - X position for the new object
 * @param {int} y - Y position for the new object
 * @param {object] conf - Configuration for the new object;
 *
 * name: {string} Unique name for object
 * group: {string} Group name for object
 * ignore: {array} List of other groups to ignore (not collide with)
 * 
 * type: {int} Type of body (static, dynamic, kinematic)
 * isSensor: {bool} Whether this object is only a sensor
 *
 * shape: {b2Shape} Shape of body
 * 
 * density: {float} Density
 * friction: {float} Friction
 * restitution:	{float} Restitution
 */
var GameObject = function (x, y, conf) {
	// Box2D Objects
	this.bodyDef = new b2BodyDef;
	this.fixtureDef = new b2FixtureDef;

	/**
	 * Updates position, state etc
	 */
	this.update = function () {
		
	};

	this.loadFromFile = function (path) {
		
	};

	// TODO: Too specific??
	// Positions this object above gameObject (Player.positionAbove(Ground))
	this.positionAbove = function (gameObject) {
		
	};

	this.positionBelow = function (gameObject) {
		
	};

	// Moves outside the screen (1 = right, -1 = left)
	this.placeOutsideScreen = function (side) {
		
	};
};
// 02-Level.js
var Level = function () {
	this.loadFromFile = function (path) {
		
	};
};
