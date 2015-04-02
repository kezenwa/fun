var Game = {
	canvas: false, 
	gravity: 10, 
	stage: false, 
	world: false, 
	player: false, 
	ground: false, 
	pickups: [], 
	clouds: [], 
	camera: false, 
	pxPerM: 100, 
	lastTime: 0, 
	ui: false, 

	run: function (canvas, debug) {
		Game.canvas = canvas;

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

		Game.stage.addEventListener(Event.ENTER_FRAME, Game.onEnterFrame);

		// Background
		Game.addSky();

		// TMP Clouds for reference
		for (var i = 0; i < 10; i++) {
			var cloud = new Bitmap(new BitmapData('gfx/cloud.png'));

			cloud.x = i * 1000;
			cloud.y = Math.random() * 20;

			Game.stage.addChild(cloud);
		}

		// Create camera
		Game.camera = new Camera();

		// Create the player
		Game.player = new Player(4, 4, 1);

		Game.stage.addEventListener(MouseEvent.MOUSE_DOWN, function () {
			Game.player.flap();
		});

		Game.stage.addEventListener(KeyboardEvent.KEY_DOWN, function (e) {
			if (e.keyCode == 37) {
				Game.player.goBackward();
			}
			if (e.keyCode == 39) {
				Game.player.goForward();
			}
			if (e.keyCode == 38) {
				Game.player.flap();
			}
		});

		// Create the ground
		Game.ground = new Ground();

		// Add player and ground to stage
		Game.stage.addChild(Game.player.actor);
		Game.stage.addChild(Game.ground.actor);
	}, 

	// On every frame
	onEnterFrame: function (event) {
		var time = new Date().getTime();
		var dt = (time - Game.lastTime) / 1000;

		// Update physics engine
		Game.world.Step(1 / 60, 3, 3);
		Game.world.DrawDebugData();
		Game.world.ClearForces();

		// Update positions of game objects
		Game.player.updatePosition();
		Game.ground.updatePosition();

		// Refill player's energy
		Game.player.refillEnergy(dt);

		// Update camera position
		Game.camera.follow(Game.player);

		Game.lastTime = time;
	}, 

	// Gradient BG
	addSky: function () {
		Game.canvas.style.backgroundColor = '#01182f';

		var bg = new Bitmap(new BitmapData('gfx/sky.png'));

		bg.scaleX = 100000;
		bg.x = -500000;
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
