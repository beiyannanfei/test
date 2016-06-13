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
    httpUtils.httpPost(url, param, function(err){
        console.log(arguments)
        cb?cb(err):''
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
    httpUtils.httpPost(url, param, function(err){
        console.log(arguments)
        cb?cb(err):''
    })
}

exports.changeIntegral = function(token, openId, integral, desc, cb){
    if (_.isNaN(integral)){
        return cb?cb('integral format error!'):''
    }
    if (!integral) {
        return cb?cb(null):''
    }


    var tryTime = 1
    var callback = function(err, response){
        if (err){
            if (++tryTime > 3){
                cb?cb(err):''
            } else {
                doAction()
            }
        } else {
            if (response && response.status == "success") {
                cb?cb(null, response):''
            }
            else {
                cb?cb(response.status || "faild"):''
            }
        }
    }

    var doAction = function(){
        if (integral > 0){
            addIntegral(token, openId, integral, desc, callback)
        } else {
            minusIntegral(token, openId, -integral, desc, callback)
        }
    }
    doAction()
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

exports.getUserGroupInfo = function (token, cb) {    //用户分组信息查询
    var url = config.userHost + "/point/group/query?wxToken=" + token;
    httpUtils.httpGet(url, function (err, response) {
        if (err) {
            cb(err, []);
        }
        else if (response && response.status == 'success' && response.data) {
            cb(null, response.data);
        }
        else {
            cb(null, []);
        }
    })
};

exports.getUserInGroup = function (openId, wxToken, activity, title, cb) {       //查询用户是否在组内
    var url = config.userHost + "/point/userGroup/query?openId=" + openId + "&wxToken=" + wxToken + "&activity="
        + activity + "&title=" + title;
    console.log("*****getUserInGroup****** url = %j", url);
    httpUtils.httpGet(url, function (err, response) {
        if (err) {
            return cb(err);
        }
        if (response && response.status == 'success') {
            cb(null);
        }
        else {
            cb("faild");
        }
    })
};

exports.getUserCenterConf = function(token, cb) {   //查询个人中心信息配置
    var url = config.userHost + "/point/personal/query?wxToken=" + token;
    console.log("*****getUserCenterConf****** url = %j", url);
    httpUtils.httpGet(url, function (err, response) {
        if (err) {
            return cb(err);
        }
        if (response && response.status == 'success') {
            cb(null, response);
        }
        else {
            cb("faild");
        }
    })
};

exports.reportBehaviors = function (url, param, cb) {
    reportBea(url, param, cb);
};

var reportBea = function(url, param, cb, tryTime) {
    if (!tryTime) {
        tryTime = 0;
    }
    httpUtils.httpPost(url, param, function(err, response) {
        if (!!err) {
            if (tryTime < 3) {
                tryTime++;
                console.log("[%j] fileName: %j report tryTime: %j, err: %j, response: %j", new Date().toLocaleString(), __filename, tryTime, err, response);
                return reportBea(url, param, cb, tryTime);
            }
            else {
                return cb(err, response);
            }
        }
        console.log("reportBehaviors success err: %j, response: %j",err, response);
        cb(err, response);
    });
};