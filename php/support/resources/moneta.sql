

--
-- Definition of table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL COMMENT 'The project name identifies the dbname itself.',
  `dbhost` varchar(64) NOT NULL DEFAULT '127.0.0.1',
  `dbport` int(10) unsigned NOT NULL DEFAULT '3306',
  `dbuser` varchar(64) NOT NULL,
  `dbpassword` varchar(128) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prjname_UNIQUE` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


--
-- Definition of table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(64) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `password` varchar(128) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `email` varchar(128) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `projects` blob,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_UNIQUE` (`user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


START TRANSACTION;
INSERT INTO `users` (`user`, `password`, `email`, `isAdmin`, `projects`) VALUES ('admin', MD5('admin'), NULL, true, NULL);
COMMIT;

