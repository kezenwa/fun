// 00-global.js
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
// 01-game-object.js
var GameObject = function (x, y, conf) {
	// Box2D object
	if (typeof(conf.type) != 'undefined') {
		// Body definition
		this.bodyDef			= new b2BodyDef;
		this.bodyDef.type		= conf.type;
		this.bodyDef.position.x	= x;
		this.bodyDef.position.y	= y;

		// Fixture definition
		this.fixtureDef			= new b2FixtureDef;
		this.fixtureDef.shape	= conf.shape;

		if (conf.density) {
			this.fixtureDef.density = conf.density;
		}
		if (conf.friction) {
			this.fixtureDef.friction = conf.friction;
		}
		if (conf.restitution) {
			this.fixtureDef.restitution = conf.restitution;
		}
		if (conf.isSensor) {
			this.fixtureDef.isSensor = true;
		}

		// Create body and fixture
		this.body		= Game.world.CreateBody(this.bodyDef);
		this.fixture	= this.body.CreateFixture(this.fixtureDef);
	}

	// Sprite
	var tmpBM	= new Bitmap(conf.bitmap.data);
		tmpBM.x	= -(conf.bitmap.width / 2);
		tmpBM.y	= -(conf.bitmap.height / 2);

	this.actor	= new Sprite();

	this.actor.addChild(tmpBM);

	// Scale sprite
	if (conf.size) {
		this.size = conf.size;

		this.actor.scaleX = (Game.pxPerM / conf.bitmap.width) * conf.size;
		this.actor.scaleY = (Game.pxPerM / conf.bitmap.height) * conf.size;
	}
	else if (conf.width && conf.height) {
		this.width = conf.width;
		this.height = conf.height;

		this.actor.scaleX = (Game.pxPerM / conf.bitmap.width) * conf.width;
		this.actor.scaleY = (Game.pxPerM / conf.bitmap.height) * conf.height;
	}

	// Add to stage
	Game.stage.addChild(this.actor);

	// So we recognize it later
	if (conf.name) {
		this.body.SetUserData(conf.name);
		this.fixture.SetUserData(conf.name);
	}

	// Give it a category / mask
	if (conf.category && conf.mask) {
		var filterData = new b2FilterData();

		filterData.categoryBits = conf.category;
		filterData.maskBits = conf.mask;

		this.fixture.SetFilterData(filterData);
	}
	else if (conf.category) {
		var filterData = new b2FilterData();

		filterData.categoryBits = conf.category;

		this.fixture.SetFilterData(filterData);
	}
	else if (conf.mask) {
		var filterData = new b2FilterData();

		filterData.maskBits = conf.mask;

		this.fixture.SetFilterData(filterData);
	}

	// Updates position based on Box2D calculations
	var self = this;

	this.updatePosition = function () {
		var b2dPos = self.body.GetPosition();
		var b2dRot = self.body.GetAngle() * 180 / Math.PI; // Radians to degrees

		self.actor.x = b2dPos.x * Game.pxPerM;
		self.actor.y = b2dPos.y * Game.pxPerM;
		self.actor.rotation = b2dRot;
	};
};
// 02-camera.js
var Camera = function () {
	var self = this;

	this.follow = function (gameObj) {
		var paddingTop		= .2 * Game.stage.stageHeight;
		var paddingBottom	= .4 * Game.stage.stageHeight;
		var paddingRight	= .7 * Game.stage.stageWidth;
		var paddingLeft		= .1 * Game.stage.stageWidth;

		var objX	= gameObj.actor.x;
		var objY	= gameObj.actor.y;
		var objW	= gameObj.size ? gameObj.size * Game.pxPerM : gameObj.width * Game.pxPerM;
		var objH	= gameObj.size ? gameObj.size * Game.pxPerM : gameObj.height * Game.pxPerM;
		var stageX	= -Game.stage.x;
		var stageY	= -Game.stage.y;
		var stageW	= Game.stage.stageWidth;
		var stageH	= Game.stage.stageHeight;

		// http://bostongamejams.com/akihabara-tutorials/akihabara-tutorial-part-4-scrolling-map/
		// Right
		if ((objX - stageX) > (stageW - paddingRight)) {
			Game.stage.x = -((stageX + (objX - stageX)) - (stageW - paddingRight));
		}
		// Left
		if ((objX - stageX) < paddingLeft) {
			Game.stage.x = -((stageX + (objX - stageX)) - paddingLeft);
		}
		// Down
		if ((objY - stageY) > (stageH - paddingBottom)) {
			Game.stage.y = -((stageY + (objY - stageY)) - (stageH - paddingBottom));
		}
		// Up
		if ((objY - stageY) < paddingTop) {
			Game.stage.y = -((stageY + (objY - stageY)) - paddingTop);
		}

		// Center camera on top of target
	//	Game.stage.x = -gameObj.actor.x + Game.stage.stageWidth / 2;
	//	Game.stage.y = -gameObj.actor.y + Game.stage.stageHeight / 2;

		// Prevent showing beneath the ground
		if (Game.stage.y < 0) {
			Game.stage.y = 0;
		}
	};
};
// 02-ground.js
var Ground = function () {
	var groundWidth = 100000;
	var groundHeight = 1;
	var groundShape = new b2PolygonShape;

	groundShape.SetAsBox(groundWidth / 2, groundHeight / 2);

	GameObject.call(this, 0, (Game.stage.stageHeight / Game.pxPerM) - (groundHeight / 2), {
		name: 'ground', 
		category: Game.categories.GROUND, 
		type: b2Body.b2_staticBody, 
		shape: groundShape, 
		size: false, 
		width: groundWidth, 
		height: groundHeight, 
		bitmap: {
			data: new BitmapData('gfx/ground.png'), 
			width: 200, 
			height: 200
		}
	});
};
// 02-launcher.js
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
// 02-pickup.js
var Pickup = function (x, y, conf) {
	GameObject.call(this, x, y, {
		name: conf.type, 
		type: b2Body.b2_staticBody, 
		isSensor: true, 
		shape: new b2CircleShape(0.5), 
		size: 1, 
		width: false, 
		height: false, 
		category: Game.categories.PICKUPS, 
		bitmap: {
			data: conf.bitmapData, 
			width: 100, 
			height: 100
		}
	});
};
// 02-player.js
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
			this.body.SetLinearVelocity(new b2Vec2(60, -30));
		}

		// Check if was just launched
		if (objType == 'launcher' && Game.numClicks > 1) {
			Game.hasLaunched = true;
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
// 03-clouds.js
var Clouds = function (num) {
	this.clouds = [];
	this.cloudWidth = 450; // W/h of bitmap
	this.cloudHeight = 300;
	this.bitmapData = [
		new BitmapData('gfx/cloud1.png'), 
		new BitmapData('gfx/cloud2.png'), 
		new BitmapData('gfx/cloud3.png')
	];

	for (var i = 0; i < num; i++) {
		var rand = Math.floor(Math.random() * 3);
		var cloud = new Bitmap(this.bitmapData[rand]);

		cloud.x = i * (Math.random() * 500 + 500);
		cloud.y = Math.random() * 2000 - 1800;
		cloud.scaleX = cloud.scaleY = (Math.random() * 0.8 + 0.5) * (Game.pxPerM / 100);

		Game.stage.addChild(cloud);

		this.clouds.push(cloud);
	}

	var direction = 1;
	var prevX = 0;

	this.updatePosition = function () {
		var stageW = Game.stage.stageWidth;
		var stageH = Game.stage.stageHeight;
		var stageX = -Game.stage.x;
		var stageY = -Game.stage.y;

		if (stageX > prevX) {
			direction = 1;
		}
		else {
			direction = -1;
		}

		// For every cloud
		// Check if it's outside the viewport
		// If so, move it to the left or the right of the viewport
		for (var i = 0; i < this.clouds.length; i++) {
			var cloudX = this.clouds[i].x;
			var cloudY = this.clouds[i].y;
			var cloudW = this.cloudWidth * this.clouds[i].scaleX;
			var cloudH = this.cloudHeight * this.clouds[i].scaleY;

			// The cloud is off to the left and we're moving right - respawn it to the right
			if (direction == 1 && (cloudX + cloudW) < (stageX)) {
				this.clouds[i].x = (Math.random() * (stageW) + stageW + stageX);
				this.clouds[i].y = Math.random() * 2000 - 1800;
			}
			// The cloud is out to the right and we're moving left - respawn it to the left
			if (direction == -1 && cloudX > (stageW + stageX)) {
				this.clouds[i].x = (-(Math.random() * (stageW) + stageW) + stageX);
				this.clouds[i].y = Math.random() * 2000 - 1800;
			}
		}

		prevX = stageX;
	};
};
// 03-pickups.js
var Pickups = function (num) {
	this.pickups = [];
	this.pickupWidth = 100;
	this.pickupHeight = 100;

	var pickupTypes = ['wind', 'ball', 'speed', 'bounce'];
	var bitmapData = [
		new BitmapData('gfx/pickups/wind.png'), 
		new BitmapData('gfx/pickups/ball.png'), 
		new BitmapData('gfx/pickups/speed.png'), 
		new BitmapData('gfx/pickups/bounce.png')
	];

	var groundLevel = (Game.stage.stageHeight / Game.pxPerM - 1.5);

	for (var i = 0; i < num; i++) {
		var rand = Math.floor(Math.random() * 4);
		var y = rand == 3 ? groundLevel : Math.random() * 15 - 13;

		var pickup = new Pickup(i * 10, y, {
			type: pickupTypes[rand], 
			bitmapData: bitmapData[rand]
		});

		pickup.updatePosition();

		this.pickups.push(pickup);
	}

	var direction = 1;
	var prevX = 0;

	this.updatePosition = function () {
		var stageW = Game.stage.stageWidth;
		var stageH = Game.stage.stageHeight;
		var stageX = -Game.stage.x;
		var stageY = -Game.stage.y;

		if (stageX > prevX) {
			direction = 1;
		}
		else {
			direction = -1;
		}

		// For every pickup
		// Check if it's outside the viewport
		// If so, move it to the left or the right of the viewport
		for (var i = 0; i < this.pickups.length; i++) {
			var pickupX = this.pickups[i].actor.x;
			var pickupY = this.pickups[i].actor.y;
			var pickupW = this.pickupWidth * this.pickups[i].actor.scaleX;
			var pickupH = this.pickupHeight * this.pickups[i].actor.scaleY;
			var newX	= (Math.random() * ((stageW / Game.pxPerM) * 1) + (stageW / Game.pxPerM) + (stageX / Game.pxPerM));
			var newY	= Math.random() * 40 - ((40 - groundLevel) + 2);
			var change	= false;
			var rand	= Math.round(Math.random() * 3);

			// Position the bounce pickup on the ground
			newY = rand == 3 ? groundLevel : newY;

			// The pickup is off to the left and we're moving right - respawn it to the right
			if (direction == 1 && (pickupX + pickupW) < (stageX)) {
				this.pickups[i].body.SetPosition(new b2Vec2(newX, newY));
				change = true;
			}
			// The pickup is out to the right and we're moving left - respawn it to the left
			if (direction == -1 && pickupX > (stageW + stageX)) {
				this.pickups[i].body.SetPosition(new b2Vec2(-newX, newY));
				change = true;
			}

			if (change) {
				// Update Box2D user data
				this.pickups[i].body.SetUserData(pickupTypes[rand]);
				this.pickups[i].fixture.SetUserData(pickupTypes[rand]);

				// Change bitmap
				var newBM = new Bitmap(bitmapData[rand]);

				newBM.x -= this.pickupWidth / 2;
				newBM.y -= this.pickupHeight / 2;

				this.pickups[i].actor.removeChildAt(0);
				this.pickups[i].actor.addChild(newBM);
			}

			this.pickups[i].updatePosition();
		}

		prevX = stageX;
	};
};
// 09-game.js
// http://blog.sethladd.com/2011/08/box2d-orientation-for-javascript.html

/*
Todo:
- Slumpa typ av pickup när den flyttas också
	- Sprid ut bättre också - och i närheten av player så även om han är i rymden
- Vid för låg hastighet ska man inte kunna flappa
- Grafik
	- Stjärnor (3d :D)
	- Måne ashögt upp
- Ljud
- UI
- Launchpad

Nästa (TIM):
- Global med BitmapData och Sounds osv (alla assets) (Loading...)
- Smartare GameObjects som extendar Sprite() (som han rekommenderar)
	- Game.player.placeOn(Game.ground) tex
- Hur hantera collection av GameObjects?
	- Borde ha wrapper som hanterar det... (både clouds och pickups tex)
*/

var Game = {
	gravity: 20, 
	pxPerM: 60, 
	canvas: false, 
	debug: false, 
	stage: false, 
	world: false, 
	player: false, 
	ground: false, 
	launcher: false, 
	pickups: false, 
	clouds: false, 
	camera: false, 
	lastTime: 0, 
	ui: false, 
	playerStartX: 3, 
	playerStartY: false, 
	hasLaunched: false, 

	categories: {
		PLAYER: 2, 
		GROUND: 4, 
		PICKUPS: 8, 
		LAUNCHER: 16
	}, 

	run: function (canvas, debug) {
		Game.canvas = canvas;
		Game.debug = debug ? debug : false;

		// Store all UI buttons for later
		var uiWrap = document.getElementById('ui');

		Game.ui = {
			wrap: uiWrap, 
			loading: uiWrap.querySelector('p.loading'), 
			energy: uiWrap.querySelector('p.energy'), 
			distance: uiWrap.querySelector('p.distance'), 
			altitude: uiWrap.querySelector('p.altitude'), 
			gameOverDistance: uiWrap.querySelector('div.game-over').querySelector('span.distance')
		};

		// Set the canvas' size to the same size it's rendered in the browser (because of CSS)
		var canvasSize = Game.canvas.getBoundingClientRect();

		Game.canvas.width = canvasSize.width;
		Game.canvas.height = canvasSize.height;

		// Create Box2D World
		Game.world = new b2World(new b2Vec2(0, Game.gravity), true);

		// Setup Debug Box2D renderer
		if (debug) {
			var debugSize = debug.getBoundingClientRect();

			debug.width = debugSize.width;
			debug.height = debugSize.height;

			Game.setupB2Renderer(debug);
		}

		// Keep track of time
		Game.lastTime = new Date().getTime();

		// Create IvanK stage
		Game.stage = new Stage(Game.canvas.id);

		// Create camera
		Game.camera = new Camera();

		// Background
		Game.addSky();

		// Add clouds
		Game.clouds = new Clouds(10);
	//	Game.addClouds(6);

		// Add some pickups
		Game.pickups = new Pickups(3);

		// Create the player
		Game.playerStartY = (Game.stage.stageHeight / Game.pxPerM - 1.5);

		Game.player = new Player(Game.playerStartX, Game.playerStartY, 1);

		// Create the launcher
		Game.launcher = new Launcher(Game.playerStartX, (Game.stage.stageHeight / Game.pxPerM - 1 + 0.15), -90);

		// Create the ground
		Game.ground = new Ground();

		// Handle input
		Game.numClicks = 0;

		var handleInput = function () {
			Game.numClicks++;

			if (Game.numClicks == 1) {
				Game.player.flap();
			}
			else if (Game.numClicks == 2) {
				Game.launcher.launch();
			}
			else {
				Game.player.flap();
			}
		};

		Game.stage.addEventListener(MouseEvent.MOUSE_DOWN, handleInput);
		Game.stage.addEventListener(KeyboardEvent.KEY_DOWN, handleInput);

		// Handle collisions
		var contactListener = b2ContactListener;

		contactListener.BeginContact = function (contact) {
			if (contact.m_fixtureA.GetUserData() == 'player') {
				Game.player.handleCollision(contact.m_fixtureB);
			}
			else if (contact.m_fixtureB.GetUserData() == 'player') {
				Game.player.handleCollision(contact.m_fixtureA);
			}
		};

		contactListener.EndContact = function (contact) {
			if (contact.m_fixtureA.GetUserData() == 'player') {
				Game.player.handleSeparation(contact.m_fixtureB);
			}
			else if (contact.m_fixtureB.GetUserData() == 'player') {
				Game.player.handleSeparation(contact.m_fixtureA);
			}
		};

		contactListener.PreSolve = function (contact, impulse) {};
		contactListener.PostSolve = function (contact, oldManifold) {};

		Game.world.SetContactListener(contactListener);

		// Hook up on enter frame callback
		Game.stage.addEventListener(Event.ENTER_FRAME, Game.onEnterFrame);

		// Remove loading
		document.body.classList.remove('loading');
	}, 

	// On every frame
	onEnterFrame: function (event) {
		// Game Over?
		var velocity = Game.player.body.GetLinearVelocity();

		if (Game.hasLaunched && !Game.player.body.IsAwake()) {
			document.body.classList.add('game-over');

			return;
		}

		// Keep track of time
		var time = new Date().getTime();
		var dt = (time - Game.lastTime) / 1000;

		// Update physics engine
		Game.world.Step(1 / 60, 3, 3);

		if (Game.debug) {
			Game.world.DrawDebugData();
		}

		Game.world.ClearForces();

		// Update positions of game objects
		Game.player.updatePosition();
		Game.ground.updatePosition();
		Game.clouds.updatePosition();
		Game.pickups.updatePosition();
		Game.launcher.updatePosition();

		// Refill player's energy
		Game.player.refillEnergy(dt);

		// Update camera position
		Game.camera.follow(Game.player);

		// Update UI
		Game.updateUI();

		// Keep track of time
		Game.lastTime = time;
	}, 

	// Updates the UI
	topAltitude: 0, 

	updateUI: function () {
		// Update energy
		var energyPercent = Math.round(Game.player.energy * 100);
			energyPercent = energyPercent > 100 ? 100 : energyPercent;

		Game.ui.energy.children[0].style.width = energyPercent + '%';

		// Update distance
		var distance = Math.round(Game.player.body.GetPosition().x - Game.playerStartX);

		Game.ui.distance.children[0].innerHTML = distance;
		Game.ui.gameOverDistance.children[0].innerHTML = distance;

		// Update altitude
		var altitude = -Math.round(Game.player.body.GetPosition().y + -Game.playerStartY);

		if (altitude > Game.topAltitude) {
			Game.topAltitude = altitude;
		}

		Game.ui.altitude.children[0].innerHTML = Game.topAltitude;
	}, 

	// Gradient BG
	addSky: function () {
		Game.canvas.style.backgroundColor = '#01182f';

		var bg = new Bitmap(new BitmapData('gfx/sky.jpg'));

		bg.scaleX = 200000;
		bg.x = -100000;
		bg.y = -(4000 - Game.stage.stageHeight);

		Game.stage.addChild(bg);
	}, 

	// Debug renderer
	setupB2Renderer: function (canvas) {
		var debugDraw = new b2DebugDraw();

		debugDraw.SetSprite(canvas.getContext('2d'));
		debugDraw.SetDrawScale(30.0);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

		Game.world.SetDebugDraw(debugDraw);

		return debugDraw;
	}
};
