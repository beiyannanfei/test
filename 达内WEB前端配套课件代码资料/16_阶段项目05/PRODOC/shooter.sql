/*
Navicat MySQL Data Transfer

Source Server         : users_root
Source Server Version : 50051
Source Host           : localhost:3306
Source Database       : shooter

Target Server Type    : MYSQL
Target Server Version : 50051
File Encoding         : 65001

*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL auto_increment,
  `loginname` varchar(20) default NULL,
  `loginpwd` varchar(20) default NULL,
  `nickname` varchar(20) default NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'admintra', 'admin', '管理员');

