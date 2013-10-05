<?php

/******************************************************************************
 * Module: support/Session.php
 ******************************************************************************
 * Description:
 * General purpose class for managing session.
 *
 * Usage:
 * 		$val = Session::get('key'); 	// null if not found
 * 		Session::set($key, $value);
 * 		Session::del($key); 			// removes a value from session
 *		Session::destroy(); 			// closes the current session
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';

class Session {
	static function init() {
		if(!isset($_SESSION)){session_start();}
	}
	static function contains($key) {
		Session::init();
		return isset($_SESSION[$key]);
	}
	static function get($key) {
		$log = new Log('Session');
		Session::init();
		if (!isset($_SESSION[$key])) {
			return null;
		}
		return $_SESSION[$key];
	}
	static function del($key) {
		$log = new Log('Session');
		Session::init();
		if (!isset($_SESSION[$key])) {
			return null;
		}
		unset($_SESSION[$key]);
	}
	static function set($key, $value) {
		$log = new Log('Session');
		Session::init();
		$_SESSION[$key] = $value;
	}
	static function destroy() {
		$log = new Log('Session');
		$log->info('Destroying session');
		session_destroy();
	}
}
?>