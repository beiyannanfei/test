/**
 * Created by wyq on 2015/11/26.
 */

var queueUtil = require('../queue/redisQueue.js');
var moment = require('moment');

exports.pushError = function(error){
	queueUtil.pushError({error: error, dateTime: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')});
};

exports.getError = function(req, res){
	var count = req.param('count');
	queueUtil.getError(count, function(err, docs){
		res.send(200, docs);
	})
};
