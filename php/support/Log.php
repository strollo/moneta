<?php

/******************************************************************************
 * Module: support/Log.php
 ******************************************************************************
 * Description:
 * General purpose class for local logging.
 * The logs will be locally saved in the log folder of the project and
 * suffixed with current date.
 * Usage:
 * 		$log = new Log('MyClass');
 *		$log->info('message');
 *		$log->warn('message');
 *		$log->err('message');
 *****************************************************************************/

 
$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/ConfReader.php';
 
class Log {
	private $prefix = null;

	public function __construct($prefix = null) {
		$this->prefix = $prefix;
	}
	
	function log_action($level, $msg) {
		$logDir = ConfReader::getProjectPath() . '/log';
		$prjName = ConfReader::getProjectName();
		$today = date("d.m.Y");
		if (!file_exists($logDir)) {
			if (!mkdir($logDir, 0700, true)) {
				die('Failed to create folder... ' . $logDir);
			}
		}
		$filename = "$logDir/$prjName" . "_" . "$today.txt";
		$content = "[" . date("h:i:s", mktime()) . "] - ";
		if (!is_null($this->prefix)) {
			$content = $content . '<' . $this->prefix . '> ';
		}
		$content = $content . $level . " " . json_encode($msg) . "\n";
		file_put_contents ($filename , $content , FILE_APPEND);
	}
	
	function info($msg) {
		$this->log_action('[INF]', $msg);
	}
	
	function err($msg) {
		$this->log_action('[ERR]', $msg);
	}
	
	function warn($msg) {
		$this->log_action('[WAR]', $msg);
	}
}
?>