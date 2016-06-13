/**
 * Created by chenjie on 2014/12/18.
 */

var config = require('../config');
var tkConfig = require('../tokenConfig');
var wxInfo = require('./../interface/wxInfo.js');
var SHA1 = require("crypto-js/sha1");
var _ = require("underscore");
var tools = require('../tools');
var yaoTVApi = require('./../interface/yaoTVApi.js');

var redisClient = tools.redisClient();

function setJsTicket(token, doc, expire){
    var key = 'token' + '-' + token
    redisClient.setex(key, expire, JSON.stringify(doc), function(err, value){

    });
}

exports.getJsShareParam = function(req, res, next){
    var url = req.param('url');
    var timestamp = '' + Math.ceil(new Date().getTime() / 1000);
    var noncestr = Math.random().toString().substring(2, 8);
    if (!url){
        return res.send(500, 'url param error')
    }

    yaoTVApi.getYaoCardJsTicket(req.yyyappId, function(err, jsticket){
        if (err){
            return res.send(500, 'url param error')
        } else {
            generateJsParam(req.yyyappId, jsticket)
        }
    })

    var generateJsParam = function(appId, jsticket){
        var signParam = {
            jsapi_ticket: jsticket,
            noncestr: noncestr,
            timestamp: timestamp,
            url: url
        }
        var paramArr = _.keys(signParam);
        paramArr.sort();
        var stringArr  = []
        _.each(paramArr, function(key){
            stringArr.push(key + '=' + signParam[key]);
        })
        var string = stringArr.join('&');
        var param = {
            signature: SHA1(string).toString(),
            appId: appId,
            timestamp: timestamp,
            noncestr: noncestr
        }
        req.wxJsParam = param
        next()
    }
}