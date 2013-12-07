<?php

$BASEPATH = dirname(__FILE__); 
include_once $BASEPATH . '/support/Log.php';

/*
 * TEST MODE
 */
/*
echo('{"error":"true", "msg": "Session expired"}');
return;
*/

if(!isset($_SESSION)){session_start();}
if(!isset($_SESSION['authuser'])) {
	echo('{"error":"true", "msg": "Session expired"}');
	return;
}

echo ('{"success":true}');
?>