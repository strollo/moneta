<?php
$BASEPATH = dirname(__FILE__) . '/../..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/AccountMgr.php';
include_once $BASEPATH . '/support/JSON.php';

JSON::sendJSONResult($_GET, AccountMgr::getAccountTypes());

?>