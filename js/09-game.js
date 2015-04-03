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
- Hur hantera collection av GameObjects?
	- Borde ha wrapper som hanterar det... (både clouds och pickups tex)
*/

var Game = {
	canvas: false, 
	debug: false, 
	gravity: 20, 
	stage: false, 
	world: false, 
	player: false, 
	ground: false, 
	launcher: false, 
	pickups: false, 
	clouds: false, 
	camera: false, 
	pxPerM: 100, 
	lastTime: 0, 
	ui: false, 
	playerStartX: 3, 

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
		Game.clouds = new Clouds(4);
	//	Game.addClouds(6);

		// Add some pickups
		Game.pickups = new Pickups(6);

		// Create the player
		Game.player = new Player(Game.playerStartX, 4, 1);

	//	Game.player.body.SetLinearVelocity(new b2Vec2(30, -10));

		// Flap
		Game.stage.addEventListener(MouseEvent.MOUSE_DOWN, function () {
			Game.player.flap();
		});

		// DEV only
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

		// Create the launcher
		Game.launcher = new Launcher(1.5, (Game.stage.stageHeight / Game.pxPerM - 3.5), -90);

		// Create the ground
		Game.ground = new Ground();

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
	updateUI: function () {
		// Update energy
		var energyPercent = Math.round(Game.player.energy * 100);
			energyPercent = energyPercent > 100 ? 100 : energyPercent;

		Game.ui.energy.childNodes[0].style.width = energyPercent + '%';

		// Update distance
		var distance = Math.round(Game.player.body.GetPosition().x - Game.playerStartX);

		Game.ui.distance.childNodes[0].innerHTML = distance + 'm';
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
