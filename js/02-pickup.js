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
