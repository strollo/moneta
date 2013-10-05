<?php

/******************************************************************************
 * Module: support/ConfReader.php
 ******************************************************************************
 * Description:
 * reads the configuration from the moneta.ini file
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';

class ConfReader {
	static $_conf = null;
	
	static function getProjectName() {
		return (strtok($_SERVER['PHP_SELF'], '/'));		
	}

	// The absoulte path of this this project
	static function getProjectPath() {
		return ($_SERVER['DOCUMENT_ROOT'] . '/' . strtok($_SERVER['PHP_SELF'], '/'));		
	}
	
	static function getConfig() {
		$log = new Log('ConfReader');
		if (ConfReader::$_conf == null) {
			$log->info('Parsing configuration file');
			$confPath = ConfReader::getProjectPath() . "/config";
			$ini_array = parse_ini_file($confPath . "/moneta.ini");
			ConfReader::$_conf = $ini_array;			
		}
		return ConfReader::$_conf;
	}
}
?>