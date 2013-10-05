<?php

/******************************************************************************
 * Module: support/Auth.php
 ******************************************************************************
 * Description:
 * Facilities for authorizing users.
 *
 * Usage:
 * 		Auth::isAdmin();		// bool
 * 		Auth::isUser();			// bool
 *		Auth::getCurrentUser(); // returns the logged user or null
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';
include_once $BASEPATH . '/support/Utils.php';
include_once $BASEPATH . '/support/Session.php';
 
class Auth {
	static function isAdmin() {
		return Utils::toBool(Session::contains('authuser') && Session::get('isadmin') == True);
	}
	static function isUser() {
		return Utils::toBool(Session::contains('authuser') && Session::get('isadmin') == False);
	}
	static function isLogged() {
		return Auth::isAdmin() || Auth::isUser();
	}
	static function getCurrentUser() {
		return Session::get('authuser');
	}
}
?>