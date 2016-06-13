/**
 * Created by wyq on 2015/11/26.
 */

var tools = require('../tools');
var _ = require("underscore");
var queueClient = tools.queueRedis();

exports.pushError = function(doc){
	console.log(doc);
	queueClient.lpush('mallNew_webErrorData', JSON.stringify(doc));
};

exports.getError = function(count, cb){
	queueClient.lrange('mallNew_webErrorData', 0, count?(count-1):100, function(err, o){
		cb(err, o);
		queueClient.ltrim('mallNew_webErrorData', 0, 2000);
	});
};