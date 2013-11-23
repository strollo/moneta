<?php

/******************************************************************************
 * Module: support/ProjectMgr.php
 ******************************************************************************
 * Description:
 * handles the projects (CRUD).
 * Notice: the key used for retrieving the current project is name since
 * it is unique.
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';
include_once $BASEPATH . '/support/Auth.php';
include_once $BASEPATH . '/support/MonetaDB.php';
include_once $BASEPATH . '/support/Session.php';
include_once $BASEPATH . '/support/Utils.php';
include_once $BASEPATH . '/support/JSON.php';

class ProjectMgr {	
	public static $log;
	public static $showQueries = true;
	
	static function init()
	{	
		if (!self::$log) {
			self::$log = new Log('ProjectMgr');
			if (!self::$showQueries) {
				self::$log->warn('Queries will not be shown to enable set ProjectMgr::$showQueries flag');
			}
		}
	}
	
	static function backup($prj) {
		$backupDir = $BASEPATH . "/temp/";
		if (!file_exists($backupDir)) {
			if (!mkdir($backupDir, 0700, true)) {
				die('Failed to create folder... ' . $backupDir);
			}
		}
	
		$backupFile = $backupDir . "/temp/file.zip";
		
		$command = 'mysqldump'
			. ' --host=' . Utils::strTrim($prj->dbhost)
			. ' --user=' . Utils::strTrim($prj->dbuser)
			. ' --password=' . Utils::strTrim($prj->dbpassword)
			. ' --port=' . Utils::strTrim($prj->dbport)
			. ' ' . $prj->name
			. ' > ' . $backupFile;
		$output = shell_exec($command);
		
		
        if (file_exists($backupFile)) {
            header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
            header("Cache-Control: public"); // needed for i.e.
            header("Content-Type: application/zip");
            header("Content-Transfer-Encoding: Binary");
            header("Content-Length:" . filesize($backupFile));
            header("Content-Disposition: attachment; filename=" . $backupFile);
            readfile($backupFile);
            die();        
        } else {
            die("Error: File not found.");
        } 
	}
	
	/*
	 * Returns the list on which the current user is enabled.
	 * Uses the json representation.
	 * The result can be sent back with 
	 * JSON::sendJSONResult
	 */
	static function getAvailableProjects() {
		self::$log->info('getAvailableProjects');
		$usr = Auth::getCurrentUser();
		if (!$usr) {
			return null;
		}
		if (Auth::isAdmin()) {
			return ProjectMgr::getAllProjects();
		}
		
		$query = "SELECT projects from users where user='" . Utils::strTrim($usr) . "'";
		$result = MonetaDB::executeQuery($query);
		$r = mysql_fetch_assoc($result);
		$thePrjs = split(',', $r['projects']);
		// For * all the projects in the system will be listed
		if (in_array('*', $thePrjs)) {		
			$query = "select id, name from projects";
			$result = MonetaDB::executeQuery($query);
			$rows = array();
			$rows['data'] = array();
			while($r = mysql_fetch_assoc($result)) {
				$rows['data'][] = $r;
			}
			return $rows['data'];
			
		} 
		// Otherwise the specific projects have been declared
		else {	
			$query = "select id, name from projects WHERE name in (";
			for ($i=0; $i < count($thePrjs); $i++) {
				$query = $query . "'" . $thePrjs[$i] . "',";
			}
			$query = $query . 'NULL)';
			$result = MonetaDB::executeQuery($query);
			$rows = array();
			$rows['data'] = array();
			while($r = mysql_fetch_assoc($result)) {
				$rows['data'][] = $r;
			}
			return $rows['data'];
		}
		// Empty set
		return array();
	}
	
	
	// The list of all registered projects
	static function getAllProjects() {
		self::$log->info('getAllProjects');
		$query = "select * from projects";
		$result = MonetaDB::executeQuery($query);
		$rows = array();
		$rows['data'] = array();
		while($r = mysql_fetch_assoc($result)) {
			$rows['data'][] = $r;
		}
		return $rows['data'];		
	}
	
	// When the user changes or closes the current project
	static function reset() {
		Session::del('project');
		Session::del('projectConfig');
	}
	
	static function getConfig() {
		$prjID = Session::get('project');
		
		if (is_null($prjID)) {
			self::$log->info('Project not selected or not in session');
			return null;
		}
		if (Session::contains('projectConfig')) {
			return Session::get('projectConfig');
		}
	
		
		$query = "select name, dbhost, dbport, dbuser, dbpassword from projects where name='" . Utils::strTrim(Session::get('project')) . "'";
		$result = MonetaDB::executeQuery($query);
		$conf = mysql_fetch_assoc($result);		
		Session::set('projectConfig', $conf);
		self::$log->warn($conf);
		return $conf;
	}
	
	// connects to the project and returns its DB handle
	static function connect() {
		$conf = ProjectMgr::getConfig();
		if ($conf == null) {
			return null;
		}
		$link = null;
		
		// Connecting, selecting database
		$link = mysql_connect($conf['dbhost'], $conf['dbuser'], $conf['dbpassword'], $conf['dbport'])
			or JSON::sendError('Could not connect: ' . mysql_error());
		mysql_select_db($conf['name']) or JSON::sendError('Could not select database');
		// self::$log->info("connect() -> [OK]");
		return $link;
	}
	// disconnects the project
	static function disconnect($link) {
		// self::$log->info("disconnect() -> [OK]");
		// Closing connection
		mysql_close($link);
	}

	// Removes a project from the DB
	static function delete($prj) {
		self::$log->info('Delete project: ' . $prj->id . ':' . $prj->name);
		$query = "delete from projects where name='" . Utils::strTrim($prj->name) . "' and id=" . $prj->id;
		$result = MonetaDB::executeQuery($query, False);
		return $result;
	}
	// Creates a new project configuration
	static function createProjectDB($prj) {
		self::$log->info('Create prj: '. $prj->name);
		
		if (!mysql_select_db(Utils::strTrim($prj->name))) {
			self::$log->warn('Creating database ... [' . Utils::strTrim($prj->name) . ']' . ' --> ' . dirname($_SERVER['PHP_SELF']));
			
			$script_path = dirname(__FILE__) . '/resources/project.sql';
			$command = 'mysql'
					. ' --host=' . Utils::strTrim($prj->dbhost)
					. ' --user=' . Utils::strTrim($prj->dbuser)
					. ' --password=' . Utils::strTrim($prj->dbpassword)
					. ' --port=' . Utils::strTrim($prj->dbport)
					. ' --execute="CREATE DATABASE IF NOT EXISTS ' . $prj->name . '"';
			
			self::$log->warn('Executing: ' . $command);
			$output = shell_exec($command);

			$command = 'mysql'
					. ' --host=' . Utils::strTrim($prj->dbhost)
					. ' --user=' . Utils::strTrim($prj->dbuser)
					. ' --password=' . Utils::strTrim($prj->dbpassword)
					. ' --port=' . Utils::strTrim($prj->dbport)
					. ' --execute="SOURCE ' . $script_path . '" '
					. $prj->name;
			
			self::$log->warn('Executing: ' . $command);
			$output = shell_exec($command);
		}
		return True;
	}
	
	static function create($prj) {
		$link = mysql_connect($prj->dbhost, $prj->dbuser, $prj->dbpassword, $prj->dbport) or JSON::sendError(mysql_error());
		if (!$link) {
			ProjectMgr::createProjectDB($prj);
		}
		$db_selected = mysql_select_db($prj->name, $link); 
		if (!$db_selected) {
			ProjectMgr::createProjectDB($prj);
		}
		$_id = 'NULL';
		if (property_exists($prj, 'id')) {
			$_id = $prj->id;
		}
		// Storing configuration inside the monetaDB
		$query = "INSERT INTO projects (id, name, dbhost, dbport, dbuser, dbpassword) VALUES (" 
			. $_id . ","
			. "'" . Utils::strTrim($prj->name) . "',"
			. "'" . Utils::strTrim($prj->dbhost) . "',"
			. "" . Utils::strTrim($prj->dbport) . ","
			. "'" . Utils::strTrim($prj->dbuser) . "',"
			. "'" . Utils::strTrim($prj->dbpassword) . "')";
		$result = MonetaDB::executeQuery($query, False);
		return $result;
	}
	
	// Updates a project configuration
	static function update($prj) {
		self::$log->info('Update prj: '. $prj->name);
		
		$query = "UPDATE projects SET "
			. "name='" . Utils::strTrim($prj->name) . "',"
			. "dbhost='" . Utils::strTrim($prj->dbhost) . "',"
			. "dbport=" . Utils::strTrim($prj->dbport) . ","
			. "dbuser='" . Utils::strTrim($prj->dbuser) . "',"
			. "dbpassword='" . Utils::strTrim($prj->dbpassword) . "'"
			. "WHERE id=" . $prj->id;
		$result = MonetaDB::executeQuery($query, False);
		return $result;
	}
	
		
	/*
	 * Check if the current user (in the session) is enabled
	 * to access the project (specified by ID).
	 */
	static function isUserEnabled($usr, $prjName) {
		self::$log->info('isUserEnabled ' . $usr . ' on ' . $prjName);
		if (!$usr) {
			return false;
		}
		$query = "select projects from users where user='" . Utils::strTrim($usr) . "'";
		$result = MonetaDB::executeQuery($query);
		$r = mysql_fetch_assoc($result);
		$thePrjs = split(',', $r['projects']);
		
		// For * all the projects in the system will be listed
		if (in_array('*', $thePrjs) || in_array($prjName, $thePrjs)) {	
			$query = "select id, name from projects where name='" . Utils::strTrim($prjName) . "'";
			// the result is bool
			$result = MonetaDB::executeQuery($query);
		} 
		return $result;
	}
	 
	static function setCurrentProject($req) {
		ProjectMgr::reset();
		if (isset($req) && isset($req['chosenPrj']) && ProjectMgr::isUserEnabled(Auth::getCurrentUser(), $req['chosenPrj'])) {		
			// Stores the current project ID in the session
			Session::set('project', $req['chosenPrj']);
			return true;
		}
		return false;
	}
	
	static function executeQuery($query) {
		$errMsg = null;		
		$db = ProjectMgr::connect();
		if (self::$showQueries) {
			self::$log->info('[executeQuery] ~> ' . $query);
		}
		$result = mysql_query($query);
		self::$log->info('[executeQuery] result ~> ' . JSON::toString($result));
		if (!$result) {
			$errMsg = mysql_error();
		}
		ProjectMgr::disconnect($db);
		if (!$result) {
			JSON::sendError($errMsg);
		}
		return $result;
	}
}

// Applies the initialization of static fields
ProjectMgr::init();

?>