<?php
$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/ActivityMgr.php';
include_once $BASEPATH . '/support/Auth.php';
include_once $BASEPATH . '/support/JSON.php';

// Only admin can access this functionality
if (!Auth::isLogged()) {
	JSON::sendError('You must be logged in');
	return;
} 

if ((!isset($_GET) || !isset($_GET['action'])) || $_GET['action'] == 'read') {
	// Activities filtered on accounts/activityType
	JSON::sendJSONResult($_GET, ActivityMgr::getDuplicates($_GET));
} else if ($_GET['action'] == 'destroy') {
	JSON::sendJSONResult($_GET, ActivityMgr::delete(json_decode($_GET['records'])));
} else if ($_GET['action'] == 'update') {
	JSON::sendJSONResult($_GET, ActivityMgr::update(json_decode($_GET['records'])));	
}
?>