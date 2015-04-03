var Launcher = function (x, y, r) {
	var width = 0.3;
	var height = 10;
	var shape = new b2PolygonShape;

	shape.SetAsBox(width / 2, height / 2);

	GameObject.call(this, x, y, {
		name: 'launcher', 
		category: Game.categories.LAUNCHER, 
		mask: Game.categories.PLAYER | Game.categories.GROUND, 
		type: b2Body.b2_kinematicBody, 
		shape: shape, 
		density: 1, 
		friction: 1, 
		restitution: 0.2, 
		width: width, 
		height: height, 
		bitmap: {
			data: new BitmapData('gfx/launcher.png'), 
			width: 30, 
			height: 500
		}
	});

	this.body.SetAngle(r * Math.PI / 180);

	this.launch = function () {
		this.body.SetAngularVelocity(10);
	};
};
