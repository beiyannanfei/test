/**
 * Created by wyq on 2015/8/6.
 */
var async = require("async");
var config = require("./config.js");
var log4js = require('log4js');
log4js.configure(config.log4jsconfig, {});
var logger = log4js.getLogger(__filename);
var _ = require("underscore");

var map = {aaa:10, bbb:20, ccc:30};
logger.info("map: %j", map);
var keyList = _.keys(map);
logger.info("keyList: %j", keyList);
var valueList = _.values(map);
logger.info("valueList: %j", valueList);

var index = 0;

_.each(keyList, function(val) {
    var value = valueList[index++];
    var mapValue = map[val];
    logger.info("val: %j, value: %j, mapValue: %j", val, value, mapValue);
});