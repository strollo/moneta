<?php
$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/UserMgr.php';
include_once $BASEPATH . '/support/Auth.php';
include_once $BASEPATH . '/support/JSON.php';

// Only admin can access this functionality
if (!Auth::isAdmin()) {
	JSON::sendError('Only admin is allowed');
	return;
} 

if ((!isset($_GET) || !isset($_GET['action'])) || $_GET['action'] == 'read') {
	JSON::sendJSONResult($_GET, UserMgr::getAll());
} else if ($_GET['action'] == 'destroy') {
	JSON::sendJSONResult($_GET, UserMgr::delete(json_decode($_GET['records'])));
} else if ($_GET['action'] == 'update') {
	JSON::sendJSONResult($_GET, UserMgr::update(json_decode($_GET['records'])));	
}  else if ($_GET['action'] == 'create') {
	JSON::sendJSONResult($_GET, UserMgr::create(json_decode($_GET['records'])));
}
?>