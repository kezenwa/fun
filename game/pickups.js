var Pickups = function (num) {
	this.pickups = [];

	var pickupTypes = ['wind', 'ball', 'speed', 'bounce'];
	var bitmapData = [
		new BitmapData('gfx/pickups/wind.png'), 
		new BitmapData('gfx/pickups/ball.png'), 
		new BitmapData('gfx/pickups/speed.png'), 
		new BitmapData('gfx/pickups/bounce.png')
	];

	for (var i = 0; i < num; i++) {
		var rand = Math.floor(Math.random() * 4);
		var y = rand == 3 ? (Game.stage.stageHeight / Game.pxPerM - 1) : Math.random() * 5 - 2;

		var pickup = new Pickup(i * 6, y, {
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
	/*	for (var i = 0; i < this.pickups.length; i++) {
			var pickupX = this.pickups[i].x;
			var pickupY = this.pickups[i].y;
			var pickupW = this.pickupWidth * this.pickups[i].scaleX;
			var pickupH = this.pickupHeight * this.pickups[i].scaleY;

			// The pickup is off to the left and we're moving right - respawn it to the right
			if (direction == 1 && (pickupX + pickupW) < (stageX)) {
				this.pickups[i].x = (Math.random() * (stageW * 4) + stageW + stageX);
				this.pickups[i].y = Math.random() * 1000 - 800;
			}
			// The pickup is out to the right and we're moving left - respawn it to the left
			if (direction == -1 && pickupX > (stageW + stageX)) {
				this.pickups[i].x = (-(Math.random() * (stageW * 4) + stageW) + stageX);
				this.pickups[i].y = Math.random() * 1000 - 800;
			}
		} */

		prevX = stageX;
	};
};
