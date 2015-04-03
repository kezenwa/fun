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
			var newY	= Math.random() * 40 - (40 - groundLevel);
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
