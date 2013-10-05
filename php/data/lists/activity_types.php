<?php
$BASEPATH = dirname(__FILE__) . '/../..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/ActivityMgr.php';
include_once $BASEPATH . '/support/JSON.php';

JSON::sendJSONResult($_GET, ActivityMgr::getActivityTypes());

?>