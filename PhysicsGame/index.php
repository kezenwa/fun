<!doctype html>

<html><!-- manifest="cache.manifest" -->

	<head>

		<meta charset="utf8">
		<meta name="mobile-web-app-capable" content="yes">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimal-ui">

		<title>Physics Game</title>

		<style>
			<?php echo file_get_contents('css/all.css') ?>
		</style>

	</head>

	<body class="loading">

		<!-- TODO: Embed all audio and images (and video? etc).. -->
		<div id="assets">
			<?php foreach (glob('assets/*.*') as $file) : ?>
				<img src="assets/<?php echo basename($file) ?>">
			<?php endforeach ?>
		</div>

		<canvas id="game"></canvas>
		<canvas id="debug"></canvas>

		<script src="js/lib/Box2dWeb-2.1.a.3.js"></script>
		<script src="js/lib/ivank.js"></script>
		<script src="js/all.php"></script>
		<script>
			Game.init(document.getElementById('game'), document.getElementById('debug'));

			Game.onInput = function (event) {
				if (event.keys.ESC) {
					if (Game.paused) {
						Game.start();
					}
					else {
						Game.pause();
					}
				}
			};

			Game.start(new Level().loadFromFile('assets/levels/level-1.json'));
		</script>

	</body>

</html>
