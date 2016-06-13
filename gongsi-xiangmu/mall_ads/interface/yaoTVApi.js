/**
 * Created by chenjie on 2015/5/13.
 */


var httpUtils = require('./http-utils.js')
var config = require('../config.js')
var MD5 = require("crypto-js/md5");

exports.getYaoAccessToken = function(yyyappid, cb){
    var str = 'sig=tvmining123456&yyyappid=' + yyyappid
    var sig = MD5(str).toString().toUpperCase()
    var url = config.yaoHost + '/api/yaotv/auth?yyyappid=' + yyyappid + '&action=getAccessToken&sig=' + sig;
    httpUtils.httpGet(url, function(err, response){
        if (err){
            cb(err)
        } else if (response && response.access_token){
            cb(null, response.access_token)
        } else {
            cb('unknow getYaoAccessToken:' + JSON.stringify(response) + ', url:' + url)
        }
    })
}

exports.getYaoCardApiTicket = function(yyyappid, cb){
    var str = 'sig=tvmining&yyyappid=' + yyyappid
    var sig = MD5(str).toString().toUpperCase()
    var url = config.yaoHost + '/api/yaotv/auth?yyyappid=' + yyyappid + '&action=getApiTicket&sig=' + sig;
    httpUtils.httpGet(url, function(err, response){
        if (err){
            cb(err)
        } else if (response && response.ticket){
            cb(null, response.ticket)
        } else {
            cb('unknow getYaoCardApiTicket:' + JSON.stringify(response) + ', url:' + url)
        }
    })
}

exports.getYaoCardJsTicket = function(yyyappid, cb){
    var str = 'sig=tvmining&yyyappid=' + yyyappid
    var sig = MD5(str).toString().toUpperCase()
    var url = config.yaoHost + '/api/yaotv/auth?yyyappid=' + yyyappid + '&action=getJSApiTicket&sig=' + sig;
    httpUtils.httpGet(url, function(err, response){
        if (err){
            cb(err)
        } else if (response && response.ticket){
            cb(null, response.ticket)
        } else {
            cb('unknow getYaoCardJsTicket:' + JSON.stringify(response) + ', url:' + url)
        }
    })
}

exports.loadDayStatistics = function(day, cb){
    var url = /*config.yaoHost + */'http://yao.mtq.tvm.cn/interactiveAD/interfaceLog?date=' + day + '&channel_id=1782';
    httpUtils.httpGet(url, function(err, response){
        if (err){
            cb(err)
        } else {
            cb(null, response)
        }
    })
}