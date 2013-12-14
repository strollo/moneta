<?php 
$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/ProjectMgr.php';	
include_once $BASEPATH . '/support/ChartMgr.php';	
include_once $BASEPATH . '/support/JSON.php';
include_once $BASEPATH . '/support/Utils.php';

function buildChartData($req) {
	JSON::sendJSONResult($req, 
		ChartMgr::getChartData(
			Utils::getParam($req, 'activity_type'),
			Utils::getParam($req, 'groupBy'),
			Utils::getParam($req, 'limit')
		)
	);
}

function buildStockData($req) {
	JSON::sendJSONResult($req, 
		ChartMgr::getStockData(
			Utils::getParam($req, 'activity_type')
		)
	);
}

function buildStockNetGross($req) {
	JSON::sendJSONResult($req, 
		ChartMgr::getNetGrossTrend()
	);
}

if ((!isset($_GET) || !isset($_GET['graphT'])) || $_GET['graphT'] == 'chart') {
	buildChartData($_GET);
} else if ($_GET['graphT'] === 'stock') {
	//echo('HELLO');
	buildStockData($_GET);
} else if ($_GET['graphT'] == 'stocknetgross') {
	buildStockNetGross($_GET);
} else if ($_GET['graphT'] == 'incrementalprofits') {
	JSON::sendJSONResult($_GET, ChartMgr::getIncrementalProfits());
}

?>