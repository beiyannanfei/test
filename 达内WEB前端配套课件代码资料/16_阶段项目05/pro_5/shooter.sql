/*
Navicat MySQL Data Transfer

Source Server         : localhost:3306
Source Server Version : 50621
Source Host           : localhost:3306
Source Database       : shooter

Target Server Type    : MYSQL
Target Server Version : 50621
File Encoding         : 65001

Date: 2015-05-11 17:02:02
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `score`
-- ----------------------------
DROP TABLE IF EXISTS `score`;
CREATE TABLE `score` (
  `sid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of score
-- ----------------------------
INSERT INTO `score` VALUES ('42', '23', '38');
INSERT INTO `score` VALUES ('43', '24', '14');
INSERT INTO `score` VALUES ('44', '23', '34');
INSERT INTO `score` VALUES ('45', '23', '3');
INSERT INTO `score` VALUES ('46', '24', '51');
INSERT INTO `score` VALUES ('47', '24', '27');
INSERT INTO `score` VALUES ('48', '24', '52');
INSERT INTO `score` VALUES ('49', '24', '11');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loginname` varchar(20) DEFAULT NULL,
  `loginpwd` varchar(20) DEFAULT NULL,
  `nickname` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('22', 'liwenhua', 'liwenhua', 'lwh');
INSERT INTO `users` VALUES ('23', 'liwenhua1', '123456', 'lwh1');
INSERT INTO `users` VALUES ('24', 'liwenhua2', '123456', 'lwh2');
