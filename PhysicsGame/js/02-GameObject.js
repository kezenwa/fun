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
