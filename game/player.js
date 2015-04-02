var Player = function (x, y, s) {
	this.energy = 1;

	GameObject.call(this, x, y, {
		type: b2Body.b2_dynamicBody, 
		shape: new b2CircleShape(s / 2), 
		density: 1, 
		friction: 1, 
		restitution: 0.2, 
		size: s, 
		width: false, 
		height: false, 
		bitmap: {
			data: new BitmapData('gfx/player.png'), 
			width: 200, 
			height: 200
		}
	});

	this.body.SetLinearDamping(0);
	this.body.SetUserData('player');
	this.fixture.SetUserData('player');

	// Flap, flaaaaaap
	this.flap = function () {
		this.body.ApplyImpulse(new b2Vec2(0, -8 * this.energy), this.body.GetWorldCenter());

		this.energy = this.energy / 5;
	};

	// Moves right
	this.goForward = function () {
		this.body.ApplyImpulse(new b2Vec2(1, 0), this.body.GetWorldCenter());
	};

	// Moves left
	this.goBackward = function () {
		this.body.ApplyImpulse(new b2Vec2(-1, 0), this.body.GetWorldCenter());
	};

	// Regills energy
	this.refillEnergy = function (dt) {
		this.energy = this.energy > 1 ? 1 : this.energy + (1 * dt);
	};

	// Handles collisions
	this.handleCollision = function (fixture) {
		// Slow down quicker if touching ground
		if (fixture.GetUserData() == 'ground') {
			this.body.SetLinearDamping(2);
		}
		else {
			this.body.SetLinearDamping(0);
		}
	};

	// Handles separations
	this.handleSeparation = function (fixture) {
		this.body.SetLinearDamping(0);
	};
};
