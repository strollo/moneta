<?php

/******************************************************************************
 * Module: support/Utils.php
 ******************************************************************************
 * Description:
 * Facilities for authorizing users.
 *
 * Usage:
 * 		Utils::boolToStr($var);	// converts strings and other types to bool
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';
include_once $BASEPATH . '/support/ProjectMgr.php';

class Utils {
	public static $log;
	
	static function init()
	{
		if (!self::$log) {
			self::$log = new Log('Utils');
		}
	}
	
	static function strTrim($param, $quote=true) {
		if (is_null($param)) {
			return null;
		}
		if (is_string($param)) {
			if ($quote) {
				return addslashes(trim($param));
			} else {
				return trim($param);
			}
		}
		if (is_numeric($param)) {
			return addslashes($param);
		}
		return null;
	}

	static function getParam($get, $pname, $default = null) {
		if (is_null($get) || !isset($get[$pname])) {
			return $default;
		} else {
			return $get[$pname];
		}
	}

	static function toBool($var) {
		if (is_null($var)) {
			return false;
		}
	
		if (is_bool($var) === true) {
			if ($var == true) {
				return true;
			} else {
				return false;
			}
		}	
		switch (strtolower($var)) {
			case ("1"):
			case ("yes"):
			case ("true"):
			case ("on"):
				return true;
				break;			
			default:
				return false;
		}
	}

	// strings tyecasting as boolean values:
	static function boolToStr($var) {
		if (is_null($var)) {
			return 'false';
		}
	
		if (is_bool($var) === true) {
			if ($var == true) {
				return 'true';
			} else {
				return 'false';
			}
		}
	
		switch (strtolower($var)) {
			case ("1"):
			case ("yes"):
			case ("true"):
			case ("on"):
				return 'true';
				break;
			case ("false"):
				return 'false';
				break;
			default:
				die("<br />\n<b>Warning:</b> Invalid argument supplied for ".__FUNCTION__." function in <b>".__FILE__."</b> on line <b>".__LINE__."</b>: the argument can contain only 'true' or 'false' values as a string.<br />\n");
		}
	}
	
	static function dbGetIDByName($table, $value, $column = 'name') {
		self::$log->info('dbGetIDByName');
		$query = "select id FROM " . $table . " WHERE " . $column . " = '" . $value . "'";
		$result = ProjectMgr::executeQuery($query);
		$retval = -1;
		if ($row = mysql_fetch_array($result)) {
			$retval = $row['id'];
		}
		return $retval;
	}
}

// Applies the initialization of static fields
Utils::init();
?>


	