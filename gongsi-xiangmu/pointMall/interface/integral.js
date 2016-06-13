var httpUtils = require('./http-utils.js')
var config = require('../config.js')
var _ = require('underscore')
var crypto = require("crypto");

var signkey = "10059d4ceefa51dd21d00898d891f58d"

function generateSign(openId, sigtime){
    var str = openId + ':' + signkey + ':' + sigtime;
    var md5 = crypto.createHash('md5');
    var sig = md5.update(str);
    sig = md5.digest('hex');
    return sig
}

function addIntegral(token, openId, integral, desc, cb){
    var url = config.userHost + '/point/integral/add'
    var param = {
        wxToken: token,
        openId: openId,
        integral: integral,
        description: desc,
        source: "interface",
        sigtime: Math.floor(new Date().getTime() / 1000) + ''
    }
    param.sig = generateSign(openId, param.sigtime)
    httpUtils.httpPost(url, param, function(err, response){
        console.log(arguments)
        cb?cb(err, response):''
    })
}

function minusIntegral(token, openId, integral, desc, cb){
    var url = config.userHost + '/point/integral/minus'
    var param = {
        wxToken: token,
        openId: openId,
        integral: integral,
        description: desc,
        source: "interface",
        sigtime: Math.floor(new Date().getTime() / 1000) + ''
    }
    param.sig = generateSign(openId, param.sigtime)
    httpUtils.httpPost(url, param, function(err, response){
        console.log(arguments)
        cb?cb(err, response):''
    })
}

exports.changeIntegral = function(token, openId, integral, desc, cb){
    if (integral == 0 || _.isNaN(integral)){
        return cb?cb('integral format error!'):''
    }
    if (integral > 0){
        addIntegral(token, openId, integral, desc, cb)
    } else {
        minusIntegral(token, openId, -integral, desc, cb)
    }
}

function addBatch(token, openIds, integral, desc, cb){
    console.log(openIds)
    var url = config.userHost + '/point/integral/addBatch'
    var param = {
        wxToken: token,
        openId: openIds.join(','),
        integral: integral,
        description: desc,
        source: "interface",
        sigtime: Math.floor(new Date().getTime() / 1000) + ''
    }
    param.sig = generateSign(param.openId, param.sigtime)
    httpUtils.httpPost(url, param, function(err, response){
        console.log(arguments)
        cb?cb(err, response):''
    })
}

exports.changeIntegralBatch = function(token, openIds, integral, desc, cb){
    if (integral == 0 || _.isNaN(integral)){
        return cb?cb('integral format error!'):''
    }
    var number = 20
    var len = Math.ceil(openIds.length / number)
    for(var i = 0; i < len; i++){
        addBatch(token, openIds.slice(i * number, (i + 1) * number), integral, desc, cb)
    }
}

exports.getIntegral = function(token, openId, cb){
    var url = config.userHost + '/point/integral/query?openId=' + openId + '&wxToken=' + token
    httpUtils.httpGet(url, function(err, response){
        if (err){
            cb(err, 0)
        } else if (response && response.status == 'success' && response.data){
            cb(null, response.data.integral)
        } else {
            cb(null, 0)
        }
    })
}