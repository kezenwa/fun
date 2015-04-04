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

		<div id="preload">
			<?php foreach (glob('assets/*.*') as $file) : ?>
				<img src="gfx/<?php echo basename($file) ?>">
			<?php endforeach ?>
		</div>

		<canvas id="game"></canvas>
		<canvas id="debug"></canvas>

		<script src="js/lib/Box2dWeb-2.1.a.3.js"></script>
		<script src="js/lib/ivank.js"></script>
		<script src="js/game/all.php"></script>
		<script src="js/all.php"></script>
		<script>
			var newGame = new Game(document.getElementById('game'), document.getElementById('debug'));

			newGame.start();
		</script>

	</body>

</html>
