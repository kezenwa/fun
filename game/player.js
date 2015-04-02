var Player = function (x, y, s) {
	GameObject.call(this, x, y, {
		type: b2Body.b2_dynamicBody, 
		shape: new b2CircleShape(s / 2), 
		density: 1, 
		friction: 0.5, 
		restitution: 0.4, 
		size: s, 
		width: false, 
		height: false, 
		bitmap: {
			data: new BitmapData('gfx/player.png'), 
			width: 200, 
			height: 200
		}
	});

	this.body.SetLinearDamping(0.4);

	this.flap = function () {
		this.body.ApplyImpulse(new b2Vec2(0, -2), this.body.GetWorldCenter());
	};

	this.goForward = function () {
		this.body.ApplyImpulse(new b2Vec2(1, 0), this.body.GetWorldCenter());
	};

	this.goBackward = function () {
		this.body.ApplyImpulse(new b2Vec2(-1, 0), this.body.GetWorldCenter());
	};
};
