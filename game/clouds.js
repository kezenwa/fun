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
		cloud.y = Math.random() * 1500 - 1300;
		cloud.scaleX = cloud.scaleY = Math.random() * 0.8 + 0.5;

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
				this.clouds[i].x = (Math.random() * (stageW * 4) + stageW + stageX);
				this.clouds[i].y = Math.random() * 1500 - 1300;
			}
			// The cloud is out to the right and we're moving left - respawn it to the left
			if (direction == -1 && cloudX > (stageW + stageX)) {
				this.clouds[i].x = (-(Math.random() * (stageW * 4) + stageW) + stageX);
				this.clouds[i].y = Math.random() * 1500 - 1300;
			}
		}

		prevX = stageX;
	};
};
