<?php

/******************************************************************************
 * Module: support/ChartMgr.php
 ******************************************************************************
 * Description:
 * handles the projects (CRUD).
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';
include_once $BASEPATH . '/support/Auth.php';
include_once $BASEPATH . '/support/ProjectMgr.php';
include_once $BASEPATH . '/support/Utils.php';
include_once $BASEPATH . '/support/JSON.php';
 
class ChartMgr {
	public static $log;
	
	static function init()
	{
		if (!self::$log) {
			self::$log = new Log('ChartMgr');
		}
	}
	
	static function getStockData($activityType=2) {
		self::$log->info('getByTag');
		$query = "select UNIX_TIMESTAMP(date)*1000 as name, activities.amount as value FROM activities where type=" . $activityType . " order by date";
		$result = ProjectMgr::executeQuery($query);
		$rows = array();
		while($r = mysql_fetch_assoc($result)) {
			$rows['data'][] = $r;
		}
		if (!isset($rows['data'])) {
			return $rows;
		}		
		return $rows['data'];
	}
	
	/**
	 * Gives for each month the trend incomes/expenses difference.
	 */
	static function getNetGrossTrend($INactivityType=1, $OUTactivityType=2) {
		self::$log->info('getNetGrossTrend');
		$query = 
			"select UNIX_TIMESTAMP(A.date)*1000 AS name, (A._in_value - B._out_value) AS value from" .
			"( select date, concat(year(date), '-', month(date)) as _in_month, sum(activities.amount) AS _in_value FROM activities where type=" . $INactivityType ." group by _in_month) AS A, " .
			"( select concat(year(date), '-', month(date)) as _out_month, sum(activities.amount) AS _out_value FROM activities where type=". $OUTactivityType ." group by _out_month ) AS B " .
			"WHERE A._in_month = B._out_month " .
			"order by name";
		$result = ProjectMgr::executeQuery($query);
		$rows = array();
		while($r = mysql_fetch_assoc($result)) {
			$rows['data'][] = $r;
		}
		if (!isset($rows['data'])) {
			return $rows;
		}		
		return $rows['data'];
	}
	
	static function getChartData($activityType, $groupBy='tag', $limit=10) {
		self::$log->info('getChartData');
		$query = "SELECT `" . Utils::strTrim($groupBy) . "` as name, sum(amount) as value FROM activity_view_chart where type_id=" 
				. $activityType . " group by `" . Utils::strTrim($groupBy) 
				. "` ORDER BY sum(amount) DESC limit " . $limit;
		$result = ProjectMgr::executeQuery($query);
		$rows = array();
		while($r = mysql_fetch_assoc($result)) {
			$rows['data'][] = $r;
		}
		
		$query = 'select "Others" as name, IFNULL(sum(total),0) as value from (SELECT sum(amount) as total, tag as tag FROM activity_view_chart where type_id=' 
				. $activityType . ' group by `' . Utils::strTrim($groupBy) . '`  ORDER BY sum(amount) DESC limit ' . $limit . ',1000) AS T';
		$result = ProjectMgr::executeQuery($query);
		while($r = mysql_fetch_assoc($result)) {
			if ($r && $r['value'] != 0) {
				$rows['data'][] = $r;
			}
		}
		
		if (!isset($rows['data'])) {
			return $rows;
		}
		
		return $rows['data'];
	}

}

// Applies the initialization of static fields
ChartMgr::init();
 ?>