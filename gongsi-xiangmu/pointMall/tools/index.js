/**
 * Created by nice on 2014/8/19.
 */

var _ = require('underscore');
var redis = require('redis');
var config = require('../config.js');

exports.wmhSessionRedisClient = function(){
    var client = redis.createClient(config.wmhSessionRedis.port, config.wmhSessionRedis.host);
    client.on('error', function (err) {
        console.log('Error ' + err);
    });
    return client;
};

exports.redisClient = function(){
    var client = redis.createClient(config.redis.port, config.redis.host);
    client.on('error', function (err) {
        console.log('Error ' + err);
    });
    return client;
};

exports.pvAndUvRedisClient = function(){
    var client = redis.createClient(config.pvRedis.port, config.pvRedis.host);
    client.on('error', function (err) {
        console.log('Error ' + err);
    });
    return client;
};

exports.queueRedisClient = function(){
    var client = redis.createClient(config.queueRedis.port, config.queueRedis.host);
    client.on('error', function (err) {
        console.log('Error ' + err);
    });
    return client;
};

exports.redisUserGroupClient = function(){
    var client = redis.createClient(config.userGroupRedis.port, config.userGroupRedis.host);
    client.on('error', function (err) {
        console.log('Error ' + err);
    });
    return client;
};

exports.resToClient = function(res,params,buffer){
    res.send(buffer)

    /*res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
    if (params && params.query && params.query.callback) {
        var str =  params.query.callback + '(' + JSON.stringify(buffer) + ')';//jsonp
        res.end(str);
    } else {
        res.end(JSON.stringify(buffer));//普通的json
    }*/
};

exports.joinId = function(token,openId){
    return token + '_' + openId;
};


exports.getClientIP = function(req){
    var ipAddress;
    var headers = req.headers;
    var forwardedIpsStr = headers['x-real-ip'] || headers['x-forwarded-for'];
    forwardedIpsStr ? ipAddress = forwardedIpsStr : ipAddress = null;
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};
