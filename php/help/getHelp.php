<?php
$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/.header.php';
include_once $BASEPATH . '/support/AccountMgr.php';
include_once $BASEPATH . '/support/Auth.php';
include_once $BASEPATH . '/support/JSON.php';
include_once $BASEPATH . '/support/Utils.php';

// Only admin can access this functionality
if (!Auth::isLogged()) {
	JSON::sendError('You must be logged in');
	return;
} 

class HelpBuilder {
	static function buildNode($id, $label, $leaf=False, $url=null) {
		$elem = null;
		$elem['id'] = $id;
		$elem['text'] = $label;
		if ($leaf == True) {
			$elem['leaf'] = true;
		}
		if ($url) {
			$elem['url'] = $url;
		}
		return $elem;
	}
}

if ((!isset($_GET) || !isset($_GET['action'])) || $_GET['action'] == 'read') {
	$baseURL = Utils::getCurrentURLPath() . '../../help';

	// The first call is $_GET['node'] == 'root' and will be skipped
	if ($_GET['node'] == 'data') {
		$mainMnu = array();
		$mainMnu[] = HelpBuilder::buildNode('main', 'Main');
		$mainMnu[] = HelpBuilder::buildNode('admin', 'Admin');
		$mainMnu[] = HelpBuilder::buildNode('reports', 'Reports');
		$mainMnu[] = HelpBuilder::buildNode('settings', 'Settings');	
		$mainMnu[] = HelpBuilder::buildNode('info', 'Info');	
		JSON::sendJSONResult($_GET, $mainMnu, null, 0, true, true, true);
		return;
	}
	if ($_GET['node'] == 'root') {
		JSON::sendJSONResult($_GET, array(), null, 0);
		return;
	}	
	if ($_GET['node'] == 'main') {
		$retval = array();
		$retval[] = HelpBuilder::buildNode('main::Accounts', 'Accounts', True, $baseURL . '/accounts.html');
		$retval[] = HelpBuilder::buildNode('main::Actions', 'Actions', True, $baseURL . '/actions.html');
		$retval[] = HelpBuilder::buildNode('main::Reconciliations', 'Reconciliations', True, $baseURL . '/reconciliations.html');		
		JSON::sendJSONResult($_GET, $retval, null, 0, true, true, true);
		return;
	}
	else if ($_GET['node'] == 'admin') {
		$retval = array();
		$retval[] = HelpBuilder::buildNode('admin::Users', 'Users', True, Utils::getCurrentURLPath() . 'users.html');
		$retval[] = HelpBuilder::buildNode('admin::Projects', 'Projects', True, '/projects.html');	
		JSON::sendJSONResult($_GET, $retval, null, 0, true, true, true);
		return;
	}
	else if ($_GET['node'] == 'info') {
		$retval = array();
		$retval[] = HelpBuilder::buildNode('admin::Todo', 'Todo', True, $baseURL . '/todo.html');	
		JSON::sendJSONResult($_GET, $retval, null, 0, true, true, true);
		return;
	}
	else {
		JSON::sendJSONResult($_GET, array(), null, 0);
		return;
	}
}
?>