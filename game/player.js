var Player = function (x, y, s) {
	this.energy = 1;

	GameObject.call(this, x, y, {
		type: b2Body.b2_dynamicBody, 
		shape: new b2CircleShape(s / 2), 
		density: 1, 
		friction: 1, 
		restitution: 0.5, 
		size: s, 
		width: false, 
		height: false, 
		bitmap: {
			data: new BitmapData('gfx/player.png'), 
			width: 200, 
			height: 200
		}
	});

	this.body.SetLinearDamping(0.6);

	this.flap = function () {
		this.body.ApplyImpulse(new b2Vec2(0, -10 * this.energy), this.body.GetWorldCenter());

		this.energy = this.energy / 4;
	};

	this.goForward = function () {
		this.body.ApplyImpulse(new b2Vec2(1, 0), this.body.GetWorldCenter());
	};

	this.goBackward = function () {
		this.body.ApplyImpulse(new b2Vec2(-1, 0), this.body.GetWorldCenter());
	};

	this.refillEnergy = function (dt) {
		this.energy = this.energy > 1 ? 1 : this.energy + (1 * dt);
	};
};
