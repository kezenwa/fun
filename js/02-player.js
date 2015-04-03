var Player = function (x, y, s) {
	var defaultRestitution = 0.05;
	var defaultDamping = 0.2;
	var ballRestitution = 2;
	var groundDamping = 2;

	this.energy = 1;

	GameObject.call(this, x, y, {
		name: 'player', 
		category: Game.categories.PLAYER, 
		mask: Game.categories.GROUND | Game.categories.PICKUPS | Game.categories.LAUNCHER, 
		type: b2Body.b2_dynamicBody, 
		shape: new b2CircleShape(s / 2), 
		density: 1, 
		friction: 0.2, 
		restitution: defaultRestitution, 
		size: s, 
		width: false, 
		height: false, 
		bitmap: {
			data: new BitmapData('gfx/player.png'), 
			width: 200, 
			height: 200
		}
	});

	this.body.SetLinearDamping(defaultDamping);

	// Flap, flaaaaaap
	var lastFlap = new Date().getTime();

	this.flap = function () {
		var now = new Date().getTime();
		var dt = now - lastFlap;

		if (dt > 200) {
			this.body.ApplyImpulse(new b2Vec2(0, -15 * this.energy), this.body.GetWorldCenter());

			this.energy = this.energy * 0.65;

			lastFlap = now;
		}
	};

	// Refills energy
	this.refillEnergy = function (dt) {
		this.energy = this.energy > 1 ? 1 : this.energy + (0.25 * dt); // 4s to refill
	};

	// Moves right
	this.goForward = function () {
		this.body.ApplyImpulse(new b2Vec2(1, 0), this.body.GetWorldCenter());
	};

	// Moves left
	this.goBackward = function () {
		this.body.ApplyImpulse(new b2Vec2(-1, 0), this.body.GetWorldCenter());
	};

	// Handles collisions
	this.handleCollision = function (fixture) {
		var objType = fixture.GetUserData();

		// Slow down quicker if touching ground
		if (objType == 'ground') {
			this.body.SetLinearDamping(groundDamping);
		}
		else {
			this.body.SetLinearDamping(defaultDamping);
		}

		// Check if touched a pickup
		if (objType == 'wind') {
			this.body.ApplyImpulse(new b2Vec2(0, -20), this.body.GetWorldCenter());
		}
		else if (objType == 'speed') {
			this.body.SetLinearVelocity(new b2Vec2(35, 0));
			this.body.ApplyImpulse(new b2Vec2(0, -2), this.body.GetWorldCenter());
		}
		else if (objType == 'ball') {
			this.hasBall = true;
			this.fixture.SetRestitution(ballRestitution);
		}
		else if (objType == 'bounce') {
			this.body.SetLinearVelocity(new b2Vec2(35, -15));
		}
	};

	// Handles separations
	this.handleSeparation = function (fixture) {
		this.body.SetLinearDamping(defaultDamping);

		if (fixture.GetUserData() == 'ground' && this.hasBall) {
			this.fixture.SetRestitution(defaultRestitution);
			this.hasBall = false;
		}
	};
};
