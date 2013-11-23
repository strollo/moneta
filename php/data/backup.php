<?php
$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/ProjectMgr.php';
include_once $BASEPATH . '/support/Auth.php';
include_once $BASEPATH . '/support/JSON.php';

// Only admin can access this functionality
if (!Auth::isAdmin()) {
	JSON::sendError('Only admin is allowed');
	return;
} 

$req = null;
if (isset($_GET) && isset($_GET['action'])) {
	$req = $_GET;
} else if (isset($_POST) && isset($_POST['action'])) {
	$req = $_POST;
}

if (!isset($req)) {
	JSON::sendError('Invalid request');
	return;
}

if ($req['action'] == 'backup') {
	if (!isset($req['id'])) {
		JSON::sendError('Cannot execute backup. No project selected.');
		die();
	}
	ProjectMgr::backup(json_decode($req['id']));
	return;
} else if ($req['action'] == 'restore') {
	if (!isset($req['id'])) {
		JSON::sendError('Cannot execute backup. No project selected.');
		die();
	}
	ProjectMgr::restore(json_decode($req['id']));
	return;
} else {
	JSON::sendError('Invalid request or action');
	return;
}
?>