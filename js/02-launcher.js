var Launcher = function (x, y, r) {
	var width = 0.3;
	var height = 5;
	var shape = new b2PolygonShape;

	shape.SetAsBox(width / 2, height / 2);

	GameObject.call(this, x, y, {
		name: 'launcher', 
		category: Game.categories.LAUNCHER, 
		type: b2Body.b2_staticBody, 
		shape: shape, 
		density: 1, 
		friction: 1, 
		restitution: 0.2, 
		width: width, 
		height: height, 
		bitmap: {
			data: new BitmapData('gfx/launcher.png'), 
			width: 30, 
			height: 300
		}
	});

	this.body.SetAngle(r * Math.PI / 180);
};
