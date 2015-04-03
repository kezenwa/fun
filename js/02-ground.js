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
