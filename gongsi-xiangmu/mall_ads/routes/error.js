/**
 * Created by chenjie on 2015/7/15.
 */

var queueUtil = require('../queue/redisQueue.js')
var moment = require('moment')

exports.acceptError = function(req, res){
    var error = req.body.error
    if (error){
        queueUtil.pushError({user: req.body.user, error: error, dateTime: moment(new Date()).format('YYYY/MM/DD HH:mm:ss')})
    }
    res.send(200);
}

exports.getError = function(req, res){
    queueUtil.getError(function(err, docs){
        res.send(200, docs);
    })
}
