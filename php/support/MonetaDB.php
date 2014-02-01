<?php

/******************************************************************************
 * Module: support/MonetaDB.php
 ******************************************************************************
 * Description:
 * all the DB stored information 
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';
include_once $BASEPATH . '/support/ConfReader.php';
include_once $BASEPATH . '/support/JSON.php';
include_once $BASEPATH . '/support/Utils.php';

class MonetaDB {
	public static $log;
	
	static function init()
	{	
		if (!self::$log) {
			self::$log = new Log('MonetaDB');
		}
	}
	
	static function createDB() {
		$conf = ConfReader::getConfig();
		// The monetaDB does not exists ... creating a new one
		self::$log->warn('Creating database ... [' . $conf['db_name'] . ']');
		
		$script_path = dirname(__FILE__) . '/resources/moneta.sql';
		$command = 'mysql'
			. ' --host=' . Utils::strTrim($conf['db_hostname'])
			. ' --user=' . Utils::strTrim($conf['db_username'])
			. ' --password=' . Utils::strTrim($conf['db_password'])
			. ' --port=' . Utils::strTrim($conf['db_port'])
			. ' --execute="CREATE DATABASE IF NOT EXISTS ' . $conf['db_name'] . '"';
		$output = shell_exec($command);
		
		
		$command = 'mysql'
				. ' --host=' . $conf['db_hostname']
				. ' --user=' . $conf['db_username']
				. ' --password=' . $conf['db_password']
				. ' --port=' . $conf['db_port']
				. ' --execute="SOURCE ' . $script_path . '" '
				. $conf['db_name'];
		$output = shell_exec($command);
		
		return mysql_connect($conf['db_hostname'], $conf['db_username'], $conf['db_password'], $conf['db_port']);
	}
	
	static function connect() {
		$conf = ConfReader::getConfig();
		$link = null;
		if ($conf['db_type'] && $conf['db_type'] == 'mysql') {
			$link = mysql_connect($conf['db_hostname'], $conf['db_username'], $conf['db_password'], $conf['db_port']);
			if (!$link) {
				return MonetaDB::createDB();
			}
			$db_selected = mysql_select_db($conf['db_name'], $link); 
			if (!$db_selected) {
				return MonetaDB::createDB();
			}
		}
		return $link;
	}
	static function disconnect($link) {
		$conf = ConfReader::getConfig();
		self::$log->info("disconnect(" . $conf['db_name'] . ") -> [OK]");
		// Closing connection
		mysql_close($link);
	}
	
	static function executeQuery($query, $traceLog=False) {
		$errMsg = null;		
		$db = MonetaDB::connect();
		if ($traceLog) {
			self::$log->info('[executeQuery] ~> ' . $query);
		}
		$result = mysql_query($query);
		if (!$result) {
			$errMsg = mysql_error();
		}
		MonetaDB::disconnect($db);
		if (!$result) {
			JSON::sendError($errMsg);
		}
		return $result;
	}
}

MonetaDB::init();
?>