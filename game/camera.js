var Camera = function () {
	var self = this;

	this.follow = function (gameObj) {
		var paddingTop		= .2 * Game.stage.stageHeight;
		var paddingBottom	= .2 * Game.stage.stageHeight;
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
