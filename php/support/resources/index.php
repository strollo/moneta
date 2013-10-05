
<?php
	if(!isset($_SESSION)){session_start();}
	if(!isset($_SESSION['authuser'])) {
		header("location: ../../../index.php");
		return;
	}
?>