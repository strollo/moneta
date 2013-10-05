<?php
$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/AccountMgr.php';
include_once $BASEPATH . '/support/Auth.php';
include_once $BASEPATH . '/support/JSON.php';

// Only admin can access this functionality
if (!Auth::isLogged()) {
	JSON::sendError('You must be logged in');
	return;
} 

if ((!isset($_GET) || !isset($_GET['action'])) || $_GET['action'] == 'read') {
	// The first call is $_GET['node'] == 'root' and will be skipped
	if ($_GET['node'] == 'data') {
		JSON::sendJSONResult($_GET, AccountMgr::getAll(), null, -1, true, true, true);
	}
	if ($_GET['node'] == 'root') {
		JSON::sendJSONResult($_GET, array(), null, 0);
	}
} else if ($_GET['action'] == 'destroy') {
	JSON::sendJSONResult($_GET, AccountMgr::delete(json_decode($_GET['records'])));
} else if ($_GET['action'] == 'update') {
	JSON::sendJSONResult($_GET, AccountMgr::update(json_decode($_GET['records'])));	
}  else if ($_GET['action'] == 'create') {
	JSON::sendJSONResult($_GET, AccountMgr::create(json_decode($_GET['records'])));
}
?>