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

		<canvas id="game"></canvas>
		<canvas id="debug"></canvas>

		<div id="ui">

			<p class="loading"><b>Loading...</b></p>

			<p class="energy"><b></b></p>

			<p class="distance"><b>Loading...</b></p>

			<div class="game-over">

				<h2>Game Over</h2>

				<p>You made it <span class="distance"><b>loading...</b></span> meters!</p>

				<p><a href="window.reload()">Try again!</a></p>

			</div>

		</div>

		<script src="js/lib/Box2dWeb-2.1.a.3.js"></script>
		<script src="js/lib/ivank.js"></script>
		<script src="js/all.php"></script>
		<script>
			Game.run(
				document.getElementById('game'), 
				document.getElementById('debug')
			)
		</script>

	</body>

</html>
