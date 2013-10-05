<?php 
$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/ProjectMgr.php';	
include_once $BASEPATH . '/support/ChartMgr.php';	
include_once $BASEPATH . '/support/JSON.php';
include_once $BASEPATH . '/support/Utils.php';

if (!isset($_GET['activity_type'])) {
	JSON::sendError('No proper activity_type parameter specified');
}

function buildChartData($req) {
	JSON::sendJSONResult($_GET, 
		ChartMgr::getChartData(
			Utils::getParam($_GET, 'activity_type'),
			Utils::getParam($_GET, 'groupBy'),
			Utils::getParam($_GET, 'limit')
		)
	);
}

function buildStockData($req) {
	JSON::sendJSONResult($_GET, 
		ChartMgr::getStockFunction(
			Utils::getParam($_GET, 'activity_type')
		)
	);
}

if ((!isset($_GET) || !isset($_GET['graphT'])) || $_GET['graphT'] == 'chart') {
	buildChartData($_GET);
} else if ($_GET['graphT'] == 'stock') {
	buildStockData($_GET);
}


?>