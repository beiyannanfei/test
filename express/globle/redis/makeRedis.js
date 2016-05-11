/**
 * Created by wyq on 2016/5/6.
 * 生成redis链接
 */

var config = require("../../config.js");
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);
var redis = require("redis");

exports.redisClient = function () {
	var rc = redis.createClient(config.redis.port, config.redis.host);
	rc.on("error", function (err) {
		logger.error("redis Error: %j", err)
	});
	return rc;
};