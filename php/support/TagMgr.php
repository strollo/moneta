<?php

/******************************************************************************
 * Module: support/TagMgr.php
 ******************************************************************************
 * Description:
 * handles the projects (CRUD).
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';
include_once $BASEPATH . '/support/Auth.php';
include_once $BASEPATH . '/support/ProjectMgr.php';
include_once $BASEPATH . '/support/Session.php';
include_once $BASEPATH . '/support/Utils.php';
include_once $BASEPATH . '/support/JSON.php';
 
class TagMgr {
	public static $log;
	
	static function init()
	{
		if (!self::$log) {
			self::$log = new Log('TagMgr');
		}
	}

	static function getAll() {
		self::$log->info('getAll');
		$query = "select id, name AS name from tags";
		$result = ProjectMgr::executeQuery($query);
		$rows = array();
		while($r = mysql_fetch_assoc($result)) {
			$rows['data'][] = $r;
		}
		if (!isset($rows['data'])) {
			return $rows;
		}
		self::$log->info($rows['data']);
		return $rows['data'];
	}
	
	static function delete($param) {
		self::$log->info('Delete tags: ' . $param->id);
		$query = "delete from tags where id=" . Utils::strTrim($param->id);
		return ProjectMgr::executeQuery($query);
	}
	
		
	static function update($param) {
		self::$log->info('Update tag: '. $param->id);
		$query = "UPDATE tags SET "
			. "name='" . Utils::strTrim($param->name) . "' "
			. "WHERE id=" . $param->id;		
		return ProjectMgr::executeQuery($query);
	}
	
	static function create($param) {
		self::$log->info('Create tag: '. $param->name);
		$query = "INSERT INTO tags (name) VALUES (" 
			. "'" . Utils::strTrim($param->name) . "')";
		return ProjectMgr::executeQuery($query);
	}	
}

// Applies the initialization of static fields
TagMgr::init(); 
 ?>