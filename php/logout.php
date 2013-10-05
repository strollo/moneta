<?php
	$BASEPATH = dirname(__FILE__);
	include_once $BASEPATH . '/support/Log.php';

	if(!isset($_SESSION)){session_start();}

	session_destroy();
	header("location: ../index.php");
?>