<!doctype html>

<html><!-- manifest="cache.manifest" -->

	<head>

		<meta charset="utf8">
		<meta name="mobile-web-app-capable" content="yes">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, minimal-ui">

		<title>Flappy</title>

		<style>
			<?php echo file_get_contents('css/all.css') ?>
		</style>

	</head>

	<body class="loading">

		<div id="preload">
			<?php foreach (glob('gfx/*.*') as $file) : ?>
				<img src="gfx/<?php echo basename($file) ?>">
			<?php endforeach ?>
			<?php foreach (glob('gfx/pickups/*.*') as $file) : ?>
				<img src="gfx/pickups/<?php echo basename($file) ?>">
			<?php endforeach ?>
		</div>

		<canvas id="game"></canvas>
		<!--<canvas id="debug"></canvas>-->

		<div id="ui">

			<p class="loading"><b>Loading...</b></p>

			<p class="energy"><b></b></p>

			<p class="distance">Distance: <b>Loading...</b>m</p>

			<p class="altitude">Altitude: <b>Loading...</b>m</p>

			<div class="game-over">

				<h2>Game Over</h2>

				<p>You made it <span class="distance"><b>loading...</b></span> meters!</p>

				<p><a href="javascript:window.location.reload()">Try again!</a></p>

			</div>

		</div>

		<script src="js/lib/Box2dWeb-2.1.a.3.js"></script>
		<script src="js/lib/ivank.js"></script>
		<script src="js/all.php"></script>
		<script>
			Game.run(document.getElementById('game'))
		</script>

	</body>

</html>
