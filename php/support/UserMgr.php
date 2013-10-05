<?php

/******************************************************************************
 * Module: support/UserMgr.php
 ******************************************************************************
 * Description:
 * handles the projects (CRUD).
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';
include_once $BASEPATH . '/support/Auth.php';
include_once $BASEPATH . '/support/MonetaDB.php';
include_once $BASEPATH . '/support/Session.php';
include_once $BASEPATH . '/support/Utils.php';
include_once $BASEPATH . '/support/JSON.php';
 
class UserMgr {
	public static $log;
	
	static function init()
	{
		if (!self::$log) {
			self::$log = new Log('UserMgr');
		}
	}

	static function getAll() {
		self::$log->info('getAll');
		$query = "select * from users";
		$result = MonetaDB::executeQuery($query);
		$rows = array();
		while($r = mysql_fetch_assoc($result)) {
			$rows['data'][] = $r;
		}
		return $rows['data'];
	}
	
	static function delete($user) {
		self::$log->info('Delete user: ' . $user->id . ':' . $user->user);
		$query = "delete from users where user='" . Utils::strTrim($user->user) . "' AND id=" . $user->id;
		return MonetaDB::executeQuery($query);
	}
	
	static function getProjects($user) {
		self::$log->info('getProjects: '. $user->projects);
		if (!isset($user->projects)) {
			self::$log->info('getProjects: NULL param');
			return null;
		}
		if ($is_string($user->projects)) {
			return Utils::strTrim($user->projects);
		}
		return implode(',', $user->projects);			
	}
		
	static function update($user) {
		self::$log->info('Update user: '. $user->user);
		$query = "UPDATE users SET "
			. "user='" . Utils::strTrim($user->user) . "',"
			. "email='" . Utils::strTrim($user->email) . "',"
			. "isAdmin=" . Utils::boolToStr($user->isAdmin) . ","
			. "projects='" . Utils::strTrim($user->projects) . "' "
			. "WHERE id=" . $user->id;
		MonetaDB::executeQuery($query);
		
		// Password is in MD5... It changes only if not arrived back the original MD5 pwd.
		$query = "UPDATE users SET "
				. "password=MD5('" . Utils::strTrim($user->password) . "')"
				. "WHERE id=" . $user->id . " AND password <> '" . Utils::strTrim($user->password) . "'";
		return MonetaDB::executeQuery($query);
	}
	
	static function create($user) {
		// Adjusts the fields
		if (!property_exists($user, 'isAdmin')) {
			$user->isAdmin = false;
		}
		$_id = 'NULL';
		if (property_exists($user, 'id')) {
			$_id = $user->id;
		}
	
		self::$log->info('Create user: '. $user->user);
		$query = "INSERT INTO users (id, user, password, email, isAdmin, projects) VALUES (" 
			. $_id . ","
			. "'" . Utils::strTrim($user->user) . "',"
			. "MD5('" . Utils::strTrim($user->password) . "'),"
			. "'" . Utils::strTrim($user->email) . "',"
			. "" . Utils::boolToStr($user->isAdmin) . ","
			. "'" . implode(',', $user->projects) . "')";
		return MonetaDB::executeQuery($query);
	}	
}

// Applies the initialization of static fields
UserMgr::init();
 ?>