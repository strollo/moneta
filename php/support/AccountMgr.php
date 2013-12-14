<?php

/******************************************************************************
 * Module: support/AccountMgr.php
 ******************************************************************************
 * Description:
 * handles the accounts (CRUD).
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';
include_once $BASEPATH . '/support/Auth.php';
include_once $BASEPATH . '/support/ProjectMgr.php';
include_once $BASEPATH . '/support/Session.php';
include_once $BASEPATH . '/support/Utils.php';
include_once $BASEPATH . '/support/JSON.php';
 
class AccountMgr {
	public static $tableName = 'accounts';
	public static $log;
	
	public static $inc = 0;
	
	static function init()
	{
		if (!self::$log) {
			self::$log = new Log('AccountMgr');
		}
	}
	
	static function getAccountTypes() {
		self::$log->info('getAccountTypes');
		$usr = Auth::getCurrentUser();
		if (!$usr) {
			return null;
		}
		
		$query = "SELECT id,name from account_types";
		$result = ProjectMgr::executeQuery($query);
		$rows = array();
		while($r = mysql_fetch_assoc($result)) {
			$rows['data'][] = $r;
		}
		return $rows['data'];
	}
	
	static function getGroups() {
		self::$log->info('getGroups');
		$query = "select id,name,icon AS iconCls,menuID, description AS qtip from account_types where hidden=0";
		$result = ProjectMgr::executeQuery($query);
		$retval = array();
		while($r = mysql_fetch_assoc($result)) {
			$r['text'] = $r['name'];
			$r['key'] = $r['id'];
			$r['id'] = 'group#' . $r['id'];
			$retval[] = $r;
		}
		return $retval;
	}
	
	static function getInitialBalance($account) {
		$total = 0;
		$query = "select initial_balance from accounts at where id=" . $account;		
		$result = ProjectMgr::executeQuery($query);
		while($r = mysql_fetch_assoc($result)) {
			$total += $r['initial_balance'];
		}
		
		return $total;
	}
	
	static function evalTotal($account, $activity) {
		// self::$log->info('evalTotal');
		$total = 0;
		$query = "select a.*,at.from_sign from activities a, activity_types at where a.type=at.id AND a.from=" . $account . " AND at.id=" . $activity;		
		$result = ProjectMgr::executeQuery($query);
		while($r = mysql_fetch_assoc($result)) {
			if ($r['from_sign'] == '+') {
				$total += $r['amount'];
			}
			else if ($r['from_sign'] == '-') {
				$total -= $r['amount'];
			}
		}
		
		$query = "select a.*,at.to_sign from activities a, activity_types at where a.type=at.id AND a.to=" . $account . " AND at.id=" . $activity;		
		$result = ProjectMgr::executeQuery($query);
		while($r = mysql_fetch_assoc($result)) {
			if ($r['to_sign'] == '+') {
				$total += $r['amount'];
			}
			else if ($r['to_sign'] == '-') {
				$total -= $r['amount'];
			}
		}
		
		return $total;
	}
	
	static function buildInitialBalanceNode($account) {
		$r = array();
		$r['type'] = 'initial-balance';
		$r['total'] = AccountMgr::getInitialBalance($account);
		$r['text'] = "Initial Balance: (" . $r['total'] . ")";		
		$r['iconCls'] = 'ico-accounts-opening';
		$r['leaf'] = true;
		return $r;
	}
	
	static function buildProfitNode($profitValue) {
		$r = array();
		$r['type'] = 'profits';
		$r['total'] = $profitValue;
		$r['text'] = "Profits: (" . $r['total'] . ")";		
		$r['iconCls'] = 'ico-accounts-opening';
		$r['leaf'] = true;
		return $r;
	}
	
	static function getAllowedActivities($group, $account) {
		// self::$log->info('getAllowedActivities');
		$query = "select id, name, icon AS iconCls, description as qtip from activity_types at where at.id IN (select distinct (ap.activity_type) as ID from activity_permissions ap where from_acct_type=" . $group . " OR to_acct_type=" . $group . ")";
		$result = ProjectMgr::executeQuery($query);
		$retval['data'] = array();
		$accountAmount = 0;
		$retval['data'][] = AccountMgr::buildInitialBalanceNode($account);
		
		while($r = mysql_fetch_assoc($result)) {
			$r['type'] = 'activity-type';
			$r['total'] = AccountMgr::evalTotal($account, $r['id']);
			
			# the label to print in the tree			
			$r['text'] = $r['name'] . " (" . $r['total'] . ")";			
			
			# renames the ID as activity#nn the real id will be renamed as key
			$r['key'] = $r['id'];
			
			# the leaf will have information about the containing nodes.
			$r['account_group_id'] = $group;
			$r['account_id'] = $account;
			$r['activity_id'] = $r['id'];
			
			$r['leaf'] = true;
			$r['id'] = "activity#" . (self::$inc++);			
			$accountAmount += $r['total'];
			$retval['data'][] = $r;
		}
		
		$accountAmount += AccountMgr::getInitialBalance($account);
		$retval['total'] = $accountAmount;
		$profit = $retval['total'] - AccountMgr::getInitialBalance($account);
		$retval['data'][] = AccountMgr::buildProfitNode($profit);
		return $retval;
	}

	static function getAll() {
		self::$log->info('getAll');
		$groups = AccountMgr::getGroups();
		$rows = array();
		foreach ($groups as &$group) {
			$numAccountsPerGroup = 0;
			$group['type'] = 'account-group';
			$group['total'] = 0;
			
			$query = "select * from " . self::$tableName . " where type = " . $group['key'];
			$result = ProjectMgr::executeQuery($query);
			while($account = mysql_fetch_assoc($result)) {
				$numAccountsPerGroup++;
				$account['menuID'] = $group['menuID'];
				
				# rename of account ID
				$account['key'] = $account['id'];
				$account['id'] = 'account#' . $account['id'];
				
				$account['type'] = 'account';
				$account['group_id'] = $group['key'];
				$activities = AccountMgr::getAllowedActivities($group['key'], $account['key']);
				
				$account['text'] = $account['name'] . " (" . $activities['total'] . ")";
				
				$account['children'] = $activities['data'];
				$group['total'] += $activities['total'];
				$group['children'][] = $account;				
			}
			if ($numAccountsPerGroup == 0) {
				$group['leaf'] = true;			
			}
			$numAccountsPerGroup = 0;
			
			$group['text'] = $group['text'] . " (" . $group['total'] . ")";			
			$rows['data']['children'][] = $group;
		}
		
		return $rows['data']['children'];
	}
	
	static function delete($param) {
		self::$log->info('Delete: ' . $param->id);
		$query = "delete from " . self::$tableName . " where id=" . Utils::strTrim($param->id);
		return ProjectMgr::executeQuery($query);
	}
	
		
	static function update($param) {
		self::$log->info('Update: '. $param->id);
		$query = "UPDATE " . self::$tableName . " SET "
			. "name='" . Utils::strTrim($param->name) . "',"
			. "initial_balance=" . $param->initial_balance . ","
			. "type=" . $param->type . " "
			. "WHERE id=" . $param->id;
		$retval = ProjectMgr::executeQuery($query);	
		return $retval;
	}
	
	static function create($param) {
		self::$log->info('Create: '. $param->name);		
		$type = Utils::dbGetIDByName('account_types', Utils::strTrim($param->type));		
		$query = "INSERT INTO " . self::$tableName . " (name, initial_balance, type) VALUES (" 
			. "'" . Utils::strTrim($param->name) . "',"
			. $param->initial_balance . ","
			. $param->type
		. ")";
		return ProjectMgr::executeQuery($query);
	}	
}

// Applies the initialization of static fields
AccountMgr::init();
 
 ?>