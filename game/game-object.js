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

	// Updates position
	var self = this;

	this.updatePosition = function () {
		var b2dPos = self.body.GetPosition();
		var b2dRot = self.body.GetAngle() * 180 / Math.PI; // Radians to degrees

		self.actor.x = b2dPos.x * Game.pxPerM;
		self.actor.y = b2dPos.y * Game.pxPerM;
		self.actor.rotation = b2dRot;
	};
};
