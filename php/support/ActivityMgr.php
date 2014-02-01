<?php

/******************************************************************************
 * Module: support/ActivityMgr.php
 ******************************************************************************
 * Description:
 * handles the activities (CRUD).
 *****************************************************************************/

$BASEPATH = dirname(__FILE__) . '/..'; 
include_once $BASEPATH . '/support/Log.php';
include_once $BASEPATH . '/support/Auth.php';
include_once $BASEPATH . '/support/ProjectMgr.php';
include_once $BASEPATH . '/support/Session.php';
include_once $BASEPATH . '/support/Utils.php';
include_once $BASEPATH . '/support/JSON.php';
 
class ActivityMgr {
	public static $tableName = 'activities';
	public static $log;
	
	static function init()
	{
		if (!self::$log) {
			self::$log = new Log('ActivityMgr');
		}
	}
	
	static function getAllowedAccounts($type, $from = true) {
		self::$log->info('getActivityTypes');
		$query = null;
		// EXECUTE QUERY
		if ($from) {
			$query = "select account_id as id, account_name as name from allowed_from_acct_view where activity_type='" . Utils::strTrim($type) . "' ";
		} else {
			$query = "select account_id as id, account_name as name from allowed_to_acct_view where activity_type='" . Utils::strTrim($type) . "' ";
		}
		
		$result = ProjectMgr::executeQuery($query);
		$rows = array();
		$rows['data'] = array();
		while($r = mysql_fetch_assoc($result)) {
			$rows['data'][] = $r;
		}
		return $rows['data'];	
	}
	
	static function getActivityTypes($get = null) {
		self::$log->info('getActivityTypes');
		// EXECUTE QUERY
		$query = "select * from activity_types";
		$result = ProjectMgr::executeQuery($query);
		$rows = array();
		while($r = mysql_fetch_assoc($result)) {
			$rows['data'][] = $r;
		}
		return $rows['data'];
	}
	
	static function getTotalCount($get = null) {
		self::$log->info('getTotalCount');
		
		$type = null;
		$from_acct = null;
		$to_acct = null;
		$group_id = null;
		$filters = null;
	
		if (isset($get)) {
			$type = Utils::getParam($get, 'type') or null;
			$from_acct = Utils::getParam($get, 'from') or null;
			$in_out_account = Utils::getParam($get, 'account') or null;
			$to_acct = Utils::getParam($get, 'to') or null;
			$filters = Utils::getParam($get, 'filter') or null;
			$group_id = Utils::getParam($get, 'acct_group') or null;
		}
	
		// PREPARES THE QUERY with filters
		$hasWhere = false;
		$query = "select count(*) AS counter from activity_view";
		$errMsg = null;
		if (!is_null($type)) {
			$query = $query . " WHERE type=" . $type;
			$hasWhere = true;
		} else {
			// don't show in bank accounts the entries that have not already been reconciled
			$query = $query . " WHERE type NOT IN (SELECT id FROM activity_types where (from_sign = '=' or to_sign = '=')) ";
			$hasWhere = true;
		}
		if (!is_null($from_acct)) {
			if (!$hasWhere) {
				$query = $query . " WHERE ";
				$hasWhere = true;
			} else {
				$query = $query . " AND ";
			}
			$query = $query . "`from`=" . $from_acct;
		}
		if (!is_null($to_acct)) {
			if (!$hasWhere) {
				$query = $query . " WHERE ";
				$hasWhere = true;
			} else {
				$query = $query . " AND ";
			}
			$query = $query . "`to`=" . $to_acct;
		}
		if (!is_null($in_out_account)) {
			if (!$hasWhere) {
				$query = $query . " WHERE ";
				$hasWhere = true;
			} else {
				$query = $query . " AND ";
			}
			$query = $query . "(`to`=" . $in_out_account . " OR `from`=" . $in_out_account . ") ";
		}
		if (!is_null($group_id)) {
			if (!$hasWhere) {
				$query = $query . " WHERE ";
				$hasWhere = true;
			} else {
				$query = $query . " AND ";
			}
			$query = $query . "(`from` IN (select id from accounts where `type` = " . $group_id . ") or `to` IN (select id from accounts where `type` = " . $group_id . "))";
		}
		if (!is_null($filters)) {
			$_filterArray = JSON::fromString($filters);
			foreach ($_filterArray as $i => $value) {
				$_elem = $_filterArray[$i];
				$_prop = $_elem->property;
				$_val = $_elem->value;
				
				if (!$hasWhere) {
					$query = $query . " WHERE ";
					$hasWhere = true;
				} else {
					$query = $query . " AND ";
				}
				$query = $query . "(" . $_prop . " like '%" . $_val . "%') ";				
			}			
		}		
		
		// EXECUTE QUERY
		$result = ProjectMgr::executeQuery($query);
		$retval = -1;
		if ($row = mysql_fetch_array($result)) {
			$retval = $row['counter'];
		}
		return $retval;
	}
	
	// type $ledgerID, $start, $limit, $sort, $dir
	static function getActivities($get = null) {
		self::$log->info('getActivities');
		
		$type = null;
		$from_acct = null;
		$to_acct = null;
		$group_id = null;
		$start = null;
		$limit = null;
		$sortCol = null;
		$sortDir = null;
		$filters = null;
	
		if (isset($get)) {
			$type = Utils::getParam($get, 'type') or null;
			$from_acct = Utils::getParam($get, 'from') or null;
			$in_out_account = Utils::getParam($get, 'account') or null;
			$to_acct = Utils::getParam($get, 'to') or null;
			$group_id = Utils::getParam($get, 'acct_group') or null;
			$filters = Utils::getParam($get, 'filter') or null;
			$start = Utils::getParam($get, 'start') or null;
			$limit = Utils::getParam($get, 'limit') or null;
			if (Utils::getParam($get, 'sort') != null) {
				$sorter = JSON::fromString(Utils::getParam($get, 'sort'));
				self::$log->info('Sorter: ' . $sorter);
				if (is_string($sorter)) {
					self::$log->info('STRING');
					$sortCol = Utils::getParam($get, 'sort');
					$sortDir = Utils::getParam($get, 'dir');
				} else {
					self::$log->info('JSON');
					if (is_array($sorter)) {
						self::$log->info('ARRAY');
						$sorter = $sorter[0];
					}
					$sortCol = $sorter->property;
					$sortDir = $sorter->direction;
				}
			}
		}
	
		// PREPARES THE QUERY with filters
		$hasWhere = false;
		$query = "select * from activity_view";
		$errMsg = null;
		if (!is_null($type)) {
			$query = $query . " WHERE type=" . $type;
			$hasWhere = true;
		} else {
			// don't show in bank accounts the entries that have not already been reconciled
			$query = $query . " WHERE type NOT IN (SELECT id FROM activity_types where (from_sign = '=' or to_sign = '=')) ";
			$hasWhere = true;
		}
		if (!is_null($from_acct)) {
			if (!$hasWhere) {
				$query = $query . " WHERE ";
				$hasWhere = true;
			} else {
				$query = $query . " AND ";
			}
			$query = $query . "`from`=" . $from_acct;
		}
		if (!is_null($to_acct)) {
			if (!$hasWhere) {
				$query = $query . " WHERE ";
				$hasWhere = true;
			} else {
				$query = $query . " AND ";
			}
			$query = $query . "`to`=" . $to_acct;
		}
		if (!is_null($in_out_account)) {
			if (!$hasWhere) {
				$query = $query . " WHERE ";
				$hasWhere = true;
			} else {
				$query = $query . " AND ";
			}
			$query = $query . "(`to`=" . $in_out_account . " OR `from`=" . $in_out_account . ") ";
		}
		if (!is_null($group_id)) {
			if (!$hasWhere) {
				$query = $query . " WHERE ";
				$hasWhere = true;
			} else {
				$query = $query . " AND ";
			}
			$query = $query . "(`from` IN (select id from accounts where `type` = " . $group_id . ") or `to` IN (select id from accounts where `type` = " . $group_id . "))";
		}
		if (!is_null($filters)) {
			$_filterArray = JSON::fromString($filters);
			foreach ($_filterArray as $i => $value) {
				$_elem = $_filterArray[$i];
				$_prop = $_elem->property;
				$_val = $_elem->value;
				
				if (!$hasWhere) {
					$query = $query . " WHERE ";
					$hasWhere = true;
				} else {
					$query = $query . " AND ";
				}
				$query = $query . "(" . $_prop . " like '%" . $_val . "%') ";				
			}			
		}
		
		if ($sortCol) {
			$query = $query . " ORDER BY " . $sortCol . " ";
			if ($sortDir) {
				$query = $query . $sortDir . " ";
			}
		}
		if ($limit) {
			$query = $query . " LIMIT ";
			if ($start) {
				$query = $query . $start . ',';
			}
			$query = $query . $limit . " ";
		}
		// EXECUTE QUERY
		$result = ProjectMgr::executeQuery($query);
		$rows = array();
		$rows['data'] = array();
		while($r = mysql_fetch_assoc($result)) {
			$rows['data'][] = $r;
		}
		return $rows['data'];
	}
	
	// type $ledgerID, $start, $limit, $sort, $dir
	static function getReconciliations($get = null) {
		self::$log->info('getReconciliations');
		
		$start = null;
		$limit = null;
		$sortCol = null;
		$sortDir = null;
		
		$reconciliationType = 7;
		$result = ProjectMgr::executeQuery("SELECT id FROM activity_types where name='Reconciliation'");
		$reconciliationType = $result['id'];
		$r = mysql_fetch_assoc($result);
		$reconciliationType = $r['id'];
	
		if (isset($get)) {
			$start = Utils::getParam($get, 'start') or null;
			$limit = Utils::getParam($get, 'limit') or null;
			if (Utils::getParam($get, 'sort') != null) {
				$sorter = JSON::fromString(Utils::getParam($get, 'sort'));
				self::$log->info('Sorter: ' . $sorter);
				if (is_string($sorter)) {
					self::$log->info('STRING');
					$sortCol = Utils::getParam($get, 'sort');
					$sortDir = Utils::getParam($get, 'dir');
				} else {
					self::$log->info('JSON');
					if (is_array($sorter)) {
						self::$log->info('ARRAY');
						$sorter = $sorter[0];
					}
					$sortCol = $sorter->property;
					$sortDir = $sorter->direction;
				}
			}
		}
	
		// PREPARES THE QUERY with filters
		$query = "select * from activity_reconciliation_view";
		$errMsg = null;
		if ($sortCol) {
			$query = $query . " ORDER BY " . $sortCol . " ";
			if ($sortDir) {
				$query = $query . $sortDir . " ";
			}
		}
		if ($limit) {
			$query = $query . " LIMIT ";
			if ($start) {
				$query = $query . $start . ',';
			}
			$query = $query . $limit . " ";
		}
		// EXECUTE QUERY
		$result = ProjectMgr::executeQuery($query);
		$rows = array();
		$rows['data'] = array();
		while($r = mysql_fetch_assoc($result)) {
			$r['reconciliationType'] = $reconciliationType;
			$rows['data'][] = $r;			
		}
		return $rows['data'];
	}
	
	static function delete($param) {
		self::$log->info('Delete: ' . $param->id);
		$query = "delete from " . self::$tableName . " where id=" . Utils::strTrim($param->id);
		$result = ProjectMgr::executeQuery($query);
		return $result;
	}
	
		
	static function update($param) {
		
		if (!isset($param->id) || 
			!isset($param->date) || 
			!isset($param->type_v) ||
			!isset($param->from_v) ||
			!isset($param->to_v) ||
			!isset($param->amount) ||
			!isset($param->description) ||
			!is_numeric($param->amount)
			) 
		{
			JSON::sendError('Invalid or missing required parameters');
			return;
		}
		self::$log->info('Update: '. $param->id);
		
		$query = "UPDATE activities SET "
			. "`date`=" . "STR_TO_DATE('" . $param->date . "', '%d/%m/%Y')," 
			. "`from`='" . Utils::strTrim($param->from_v) . "',"
			. "`to`='" . Utils::strTrim($param->to_v) . "',"
			. "amount=" . $param->amount . ","
			. "description='" . Utils::strTrim($param->description) . "',"
			. (isset($param->tag) && !isset($param->tag_v) ? "tag=" . $param->tag . "," : "")
			. (isset($param->tag_v) ? "tag=createTag('" . $param->tag_v . "')," : "")
			. "`type`=" . $param->type_v . " " 
			. "WHERE id=" . $param->id;		
		$result = ProjectMgr::executeQuery($query);
		return $result;
	}
	
	static function create($param) {
		self::$log->info('Create');
		if (!isset($param->date) || 
			!isset($param->type_v) ||
			!isset($param->from_v) ||
			!isset($param->to_v) ||
			!isset($param->amount) ||
			!isset($param->description) ||
			!is_numeric($param->amount)
			) 
		{
			JSON::sendError('Invalid or missing required parameters');
			return;
		}
		
		$tagID = null;
		if (isset($param->tag_v)) {
			$tagID = Utils::dbGetIDByName('tags', $param->tag_v);
		}
		if ($tagID == -1) {
			// The user has specified a new tag value that must be stored
			$query = "INSERT INTO tags (name) VALUES ('" . Utils::strTrim($param->tag_v) . "')";
			$result = ProjectMgr::executeQuery($query);
			$tagID = Utils::dbGetIDByName('tags', $param->tag_v);
		}
		
		$query = "INSERT INTO activities (date, `from`, `to`, amount, description, tag, type) VALUES (" 
				. "STR_TO_DATE('" . $param->date . "', '%d/%m/%Y')," 
				. Utils::strTrim($param->from_v) . "," 
				. Utils::strTrim($param->to_v) . "," 
				. Utils::strTrim($param->amount) . "," 
				. "'" . Utils::strTrim($param->description) . "'," 
				. Utils::strTrim($tagID) . "," 
				. Utils::strTrim($param->type_v) . "" 
				. ")";
		
		$result = ProjectMgr::executeQuery($query);		
		return $result;
	}	
}

// Applies the initialization of static fields
ActivityMgr::init();
 ?>