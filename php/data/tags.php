<?php
$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/TagMgr.php';
include_once $BASEPATH . '/support/JSON.php';

if ((!isset($_GET) || !isset($_GET['action'])) || $_GET['action'] == 'read') {
	JSON::sendJSONResult($_GET, TagMgr::getAll());
} else if ($_GET['action'] == 'destroy') {
	JSON::sendJSONResult($_GET, TagMgr::delete(json_decode($_GET['records'])));
} else if ($_GET['action'] == 'update') {
	JSON::sendJSONResult($_GET, TagMgr::update(json_decode($_GET['records'])));	
}  else if ($_GET['action'] == 'create') {
	JSON::sendJSONResult($_GET, TagMgr::create(json_decode($_GET['records'])));
}

?>