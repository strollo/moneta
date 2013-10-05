<?php
	if(!isset($_SESSION)){session_start();}

	$BASEPATH = dirname(__FILE__);
	include_once $BASEPATH . '/support/MonetaDB.php';
	
	function checkUser($usr, $pwd) {
		$query = "SELECT * FROM users where user='" . addslashes($usr) . "' and password=MD5('" . addslashes($pwd) . "')";
		
		$result = MonetaDB::executeQuery($query, False);
		
		while ($row = mysql_fetch_array($result)) {
			$_SESSION['authuser'] = $row['user'];
			if ($row['isAdmin'] == 1) {
				$_SESSION['isadmin'] = True;				
			} else {
				$_SESSION['isadmin'] = False;
			}
			return;
		}
	}	
	checkUser($_POST['usr'], $_POST['pwd']);
	echo ('{"success":true}');
?>