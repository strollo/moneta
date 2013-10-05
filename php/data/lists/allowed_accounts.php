<?php
/*
 * From the activity type the list of accounts that have permission in from/to direction.
 */

$BASEPATH = dirname(__FILE__) . '/../..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/ActivityMgr.php';
include_once $BASEPATH . '/support/JSON.php';

$from = true;
if (isset($_GET['direction']) && $_GET['direction'] == 'to') {
	$from = false;
}
JSON::sendJSONResult($_GET, ActivityMgr::getAllowedAccounts($_GET['type'], $from));

?>