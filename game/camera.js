var Camera = function () {
	var self = this;

	this.i = 0;

	this.follow = function (gameObj) {
		var paddingTop		= .2 * Game.stage.stageHeight;
		var paddingBottom	= .2 * Game.stage.stageHeight;
		var paddingRight	= .5 * Game.stage.stageWidth;
		var paddingLeft		= .2 * Game.stage.stageWidth;

		var objX	= gameObj.actor.x;
		var objY	= gameObj.actor.y;
		var objW	= gameObj.size ? gameObj.size * Game.pxPerM : gameObj.width * Game.pxPerM;
		var objH	= gameObj.size ? gameObj.size * Game.pxPerM : gameObj.height * Game.pxPerM;
		var stageX	= Game.stage.x;
		var stageY	= Game.stage.y;
		var stageW	= Game.stage.stageWidth;
		var stageH	= Game.stage.stageHeight;

		if (this.i++ % 300 == 0) {
			console.dir(gameObj);
			console.log(objX, objY, objW, objH, stageX, stageY, stageW, stageH);
		}

		Game.stage.x = -gameObj.actor.x + Game.stage.stageWidth / 2;
		Game.stage.y = -gameObj.actor.y + Game.stage.stageHeight / 2;

		// Prevent showing beneath the ground
		if (Game.stage.y < 0) {
			Game.stage.y = 0;
		}
	};
};
