<?php
$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/ProjectMgr.php';
include_once $BASEPATH . '/support/JSON.php';

JSON::sendJSONResult($_POST, ProjectMgr::setCurrentProject($_POST), 'Set Project');
?>