<?php
$BASEPATH = dirname(__FILE__) . '/../..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/ActivityMgr.php';
include_once $BASEPATH . '/support/JSON.php';


JSON::sendJSONResult($_GET, JSON::fromString('[{"id":"tag","name":"tag"},{"id":"from","name":"from"},{"id":"to","name":"to"}]'));

?>