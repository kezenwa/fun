<?php
error_reporting(E_ALL);
ini_set('display_errors', true);

header('Content-type: application/x-javascript');

require_once 'JavaScriptPacker.php';

$code = '';

foreach (glob('*.js') as $file) {
	if (basename($file) != 'all.js') {
		$code .= "// $file\n";
		$code .= file_get_contents($file);
	}
}

$packer = new JavaScriptPacker($code, 0);
# $code = $packer->pack();

echo $code;

file_put_contents(dirname(__FILE__) . '/all.js', $code);
