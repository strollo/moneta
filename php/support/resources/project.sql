-- ----------------------------------------------------------------------------
--  TABLES
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `account_types`;
CREATE TABLE `account_types` (
  `id` int(64) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `has_reconciliation` tinyint(1) NOT NULL DEFAULT '0',
  `hidden` tinyint(1) NOT NULL DEFAULT '0',
  `icon` varchar(64) DEFAULT NULL,
  `menuID` varchar(45) DEFAULT NULL,
  `description` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
);

DROP TABLE IF EXISTS `activity_types`;
CREATE TABLE `activity_types` (
  `id` int(64) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `description` longtext,
  `from_sign` enum('-','=','+') NOT NULL DEFAULT '=',
  `to_sign` enum('-','=','+') NOT NULL DEFAULT '=',
  `icon` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `acttype_unique` (`name`)
);

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` int(64) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tag_name_unique` (`name`)
);

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` int(64) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `initial_balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `type` int(64) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `FK_accounts_type` (`type`),
  CONSTRAINT `FK_accounts_type` FOREIGN KEY (`type`) REFERENCES `account_types` (`id`) ON UPDATE CASCADE
);

DROP TABLE IF EXISTS `activity_permissions`;
CREATE TABLE `activity_permissions` (
  `activity_type` int(64) unsigned NOT NULL AUTO_INCREMENT,
  `from_acct_type` int(64) unsigned NOT NULL,
  `to_acct_type` int(64) unsigned NOT NULL,
  PRIMARY KEY (`activity_type`,`to_acct_type`,`from_acct_type`),
  KEY `FK_activity_perm_from` (`from_acct_type`),
  KEY `FK_activity_perm_to` (`to_acct_type`),
  CONSTRAINT `FK_activity_perm_type` FOREIGN KEY (`activity_type`) REFERENCES `activity_types` (`id`),
  CONSTRAINT `FK_activity_perm_from` FOREIGN KEY (`from_acct_type`) REFERENCES `account_types` (`id`),
  CONSTRAINT `FK_activity_perm_to` FOREIGN KEY (`to_acct_type`) REFERENCES `account_types` (`id`)
);

DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities` (
  `id` int(64) unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL DEFAULT '0000-00-00',
  `from` int(64) unsigned NOT NULL,
  `to` int(64) unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `description` varchar(512) NOT NULL,
  `tag` int(64) unsigned DEFAULT NULL,
  `type` int(64) unsigned NOT NULL,
  `origsrc` int(64) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNQ_accounts` (`date`,`from`,`to`,`amount`,`description`(255),`tag`),
  KEY `FK_activities_tag` (`tag`),
  KEY `FK_activities_type` (`type`),
  KEY `FK_activities_from` (`from`),
  KEY `FK_activities_to` (`to`),
  KEY `FK_activities_reconciliation` (`origsrc`),
  CONSTRAINT `FK_activities_from` FOREIGN KEY (`from`) REFERENCES `accounts` (`id`),
  CONSTRAINT `FK_activities_reconciliation` FOREIGN KEY (`origsrc`) REFERENCES `accounts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_activities_tag` FOREIGN KEY (`tag`) REFERENCES `tags` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_activities_to` FOREIGN KEY (`to`) REFERENCES `accounts` (`id`),
  CONSTRAINT `FK_activities_type` FOREIGN KEY (`type`) REFERENCES `activity_types` (`id`)
);

-- ----------------------------------------------------------------------------
--  FUNCTIONS
-- ----------------------------------------------------------------------------
DROP FUNCTION IF EXISTS `createTag`;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` FUNCTION `createTag`(tagName varchar(64)) RETURNS int(11)
BEGIN
  DECLARE retval INT;
  DECLARE cur1 CURSOR FOR select id FROM tags where name = tagName;
  DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' return NULL;
  DECLARE CONTINUE HANDLER FOR SQLSTATE '23000' BEGIN END;
  IF tagName IS NULL THEN
    RETURN NULL;
  END IF;
  INSERT INTO tags (name) VALUES (tagName);
  OPEN cur1;
  FETCH cur1 INTO retval;
  RETURN retval;
END $$
DELIMITER ;

DROP FUNCTION IF EXISTS `getAccountName`;
DELIMITER $$
CREATE FUNCTION `getAccountName`(accountID INT) RETURNS varchar(64) CHARSET utf8
BEGIN
  DECLARE retval VARCHAR(64);
  DECLARE cur1 CURSOR FOR select name FROM accounts where id = accountID;
  -- Handles the no data found so that null is returned in this case
  DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' return NULL;
  OPEN cur1;
  FETCH cur1 INTO retval;
  RETURN retval;
END $$
DELIMITER ;

DROP FUNCTION IF EXISTS `getAccountTypeID`;
DELIMITER $$
CREATE FUNCTION `getAccountTypeID`(accountID INT) RETURNS varchar(64) CHARSET utf8
BEGIN
  DECLARE retval INT(64);
  DECLARE cur1 CURSOR FOR select at.id from accounts act, account_types at where act.type = at.id AND act.id=accountID;
  -- Handles the no data found so that null is returned in this case
  DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' return NULL;
  OPEN cur1;
  FETCH cur1 INTO retval;
  RETURN retval;
END $$
DELIMITER ;

DROP FUNCTION IF EXISTS `getAccountTypeName`;
DELIMITER $$
CREATE FUNCTION `getAccountTypeName`(accountID INT) RETURNS varchar(64) CHARSET utf8
BEGIN
  DECLARE retval VARCHAR(64);
  DECLARE cur1 CURSOR FOR select name FROM account_types where id = accountID;
  -- Handles the no data found so that null is returned in this case
  DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' return NULL;
  OPEN cur1;
  FETCH cur1 INTO retval;
  RETURN retval;
END $$
DELIMITER ;

DROP FUNCTION IF EXISTS `getTagName`;
DELIMITER $$
CREATE FUNCTION `getTagName`(tagID INT) RETURNS varchar(64) CHARSET utf8
BEGIN
  DECLARE retval VARCHAR(64);
  DECLARE cur1 CURSOR FOR select name FROM tags where id = tagID;
  -- Handles the no data found so that null is returned in this case
  DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' return NULL;
  OPEN cur1;
  FETCH cur1 INTO retval;
  RETURN retval;
END $$
DELIMITER ;

DROP FUNCTION IF EXISTS `isValidPermission`;
DELIMITER $$
CREATE FUNCTION `isValidPermission`(actType INT, fromID INT, toID INT) RETURNS tinyint(1)
BEGIN
  DECLARE retval VARCHAR(64);
  DECLARE cur1 CURSOR FOR select count(*) > 0 FROM activity_permissions where activity_type=actType AND from_acct_type=getAccountTypeID(fromID) AND to_acct_type = getAccountTypeID(toID);
  -- Handles the no data found so that null is returned in this case
  DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' return NULL;
  OPEN cur1;
  FETCH cur1 INTO retval;
  RETURN retval;
END $$
DELIMITER ;

-- ----------------------------------------------------------------------------
--  TRIGGERS
-- ----------------------------------------------------------------------------
DROP TRIGGER /*!50030 IF EXISTS */ `ins_activity_check`;
DELIMITER $$
CREATE TRIGGER `ins_activity_check` BEFORE INSERT ON `activities` FOR EACH ROW BEGIN
  IF isValidPermission(NEW.type, NEW.from, NEW.to) <> 1
  THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Operation not allowed';
  END IF;
END $$
DELIMITER ;

DROP TRIGGER /*!50030 IF EXISTS */ `upd_activity_check`;
DELIMITER $$
CREATE TRIGGER `upd_activity_check` BEFORE UPDATE ON `activities` FOR EACH ROW BEGIN
  IF isValidPermission(NEW.type, NEW.from, NEW.to) <> 1
  THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Operation not allowed';
  END IF;
END $$
DELIMITER ;

-- ----------------------------------------------------------------------------
--  DATA
-- ----------------------------------------------------------------------------
INSERT INTO `account_types` (`id`,`name`,`has_reconciliation`,`hidden`,`icon`,`menuID`,`description`) VALUES 
 (1,'Bank and Cash accounts',0,0,'ico-accounts-bank','default','Bank accounts, Wallet, Debt Cards other investments...'),
 (2,'Credit Cards',1,0,'ico-accounts-creditcards','default','Credit Cards that need reconciliation'),
 (4,'Incoming Accounts',0,0,'ico-accounts-incomes','acct-incomes','Accounts from which money is received... (e.g. Gifts, Salary...)'),
 (5,'Outgoing Accounts',0,0,'ico-accounts-outgoings','acct-outgoings','Accounts to which money is moved as exits (e.g. Expenses)'),
 (6,'Persons',1,0,'ico-accounts-persons','acct-persons','Persons to which have loans or debts');
 
INSERT INTO `activity_types` (`id`,`name`,`description`,`from_sign`,`to_sign`,`icon`) VALUES 
 (1,'Incomes','Incoming money from banks or other sources to banks, debt cards ...','+','+','ico-accounts-incomes'),
 (2,'Outgoings','Money moved from debt cards or banks to outgoing accounts (expenses)','-','+','ico-accounts-expenses'),
 (3,'Transfers','Money transfers from accounts with no reconciliation','-','+','ico-accounts-intransfer'),
 (4,'Credit Payments','Money transfers to credit cards or accounts that need reconciliation','-','=','ico-accounts-creditpayments'),
 (5,'Loans','Loans to persons','+','-','ico-accounts-loans'),
 (6,'Debts','Debts with persons','+','-','ico-accounts-debts'),
 (7,'Reconciliation','Reconciliation from Credit Cards, Loans, Debts...','-','+',NULL);

INSERT INTO `activity_permissions` (`activity_type`,`from_acct_type`,`to_acct_type`) VALUES 
 (2,1,5),
 (3,1,6),
 (3,1,1),
 (5,1,6),
 (7,1,5),
 (4,2,1),
 (1,4,1),
 (1,6,1),
 (6,6,1);

-- ----------------------------------------------------------------------------
--  VIEWS
-- ----------------------------------------------------------------------------
DROP VIEW IF EXISTS `activity_view`;
CREATE VIEW `activity_view` AS select `act`.`id` AS `id`,`act`.`date` AS `date`,`t`.`name` AS `type_v`,`getAccountName`(`act`.`from`) AS `from_v`,`getAccountName`(`act`.`to`) AS `to_v`,`act`.`amount` AS `amount`,`act`.`description` AS `description`,`getTagName`(`act`.`tag`) AS `tag_v`,`act`.`tag` AS `tag`,`act`.`from` AS `from`,`act`.`to` AS `to`,`act`.`type` AS `type`,`act`.`origsrc` AS `origsrc`,`getAccountName`(`act`.`origsrc`) AS `origsrc_v` from (`activities` `act` join `activity_types` `t`) where (`act`.`type` = `t`.`id`);

DROP VIEW IF EXISTS `activity_reconciliation_view`;
CREATE VIEW `activity_reconciliation_view` AS select `acts`.`id` AS `id`,`acts`.`date` AS `date`,`acts`.`type_v` AS `type_v`,`acts`.`from_v` AS `from_v`,`acts`.`to_v` AS `to_v`,`acts`.`amount` AS `amount`,`acts`.`description` AS `description`,`acts`.`tag_v` AS `tag_v`,`acts`.`tag` AS `tag`,`acts`.`from` AS `from`,`acts`.`to` AS `to`,`acts`.`type` AS `type`,`acts`.`origsrc` AS `origsrc`,`acts`.`origsrc_v` AS `origsrc_v` from `activity_view` `acts` where (`acts`.`from` in (select `a`.`id` from (`accounts` `a` join `account_types` `t`) where ((`a`.`type` = `t`.`id`) and (`t`.`has_reconciliation` = 1))) and isnull(`acts`.`origsrc`));

DROP VIEW IF EXISTS `activity_view_chart`;
CREATE VIEW `activity_view_chart` AS select `act`.`id` AS `id`,`act`.`date` AS `date`,`t`.`id` AS `type_id`,`t`.`name` AS `type`,`getAccountName`(`act`.`from`) AS `from`,`getAccountName`(`act`.`to`) AS `to`,`act`.`amount` AS `amount`,`act`.`description` AS `description`,`getTagName`(`act`.`tag`) AS `tag` from (`activities` `act` join `activity_types` `t`) where (`act`.`type` = `t`.`id`);

DROP VIEW IF EXISTS `allowed_from_acct_view`;
CREATE VIEW `allowed_from_acct_view` AS select `a`.`id` AS `account_id`,`a`.`name` AS `account_name`,`p`.`activity_type` AS `activity_type`,`t`.`name` AS `activity_name` from ((`accounts` `a` join `activity_permissions` `p`) join `activity_types` `t`) where ((`a`.`type` = `p`.`from_acct_type`) and (`t`.`id` = `p`.`activity_type`));

DROP VIEW IF EXISTS `allowed_to_acct_view`;
CREATE VIEW `allowed_to_acct_view` AS select `a`.`id` AS `account_id`,`a`.`name` AS `account_name`,`p`.`activity_type` AS `activity_type`,`t`.`name` AS `activity_name` from ((`accounts` `a` join `activity_permissions` `p`) join `activity_types` `t`) where ((`a`.`type` = `p`.`to_acct_type`) and (`t`.`id` = `p`.`activity_type`));

DROP VIEW IF EXISTS `permissions_view`;
CREATE VIEW `permissions_view` AS select `at`.`name` AS `activityType`,`ap`.`from_acct_type` AS `from_id`,`getAccountTypeName`(`ap`.`from_acct_type`) AS `fromAcctType`,`getAccountTypeName`(`ap`.`to_acct_type`) AS `toAcctType` from (`activity_types` `at` join `activity_permissions` `ap`) where (`ap`.`activity_type` = `at`.`id`);

