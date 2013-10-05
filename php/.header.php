
<?php
	if(!isset($_SESSION)){session_start();}
	if(!isset($_SESSION['authuser'])) {
		header("location: " . $_SERVER['HTTP_REFERER']);
		return;
	}
?>