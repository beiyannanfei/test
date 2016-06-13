var MD5 = require("crypto-js/md5");
var moment = require('moment')
var _ = require('underscore')
var payConfig = require('../etc/payConfig.js');

exports.getSign = function(param){
    var paramArr = _.keys(param);
    paramArr.sort();
    var stringArr  = []
    _.each(paramArr, function(key){
        stringArr.push(key + '=' + param[key]);
    })
    stringArr.push("key=" + payConfig.payKey)
    var string =  stringArr.join('&');
    return MD5(string).toString().toUpperCase();
}

exports.getRedSign = function(param, signKey){
    var paramArr = _.keys(param);
    paramArr.sort();
    var stringArr  = []
    _.each(paramArr, function(key){
        stringArr.push(key + '=' + param[key]);
    })
    stringArr.push("key=" + signKey)
    var string =  stringArr.join('&');
    return MD5(string).toString().toUpperCase();
}

exports.getSignByParam = function(param, signKey){
    var paramArr = _.keys(param);
    paramArr.sort();
    var stringArr  = []
    _.each(paramArr, function(key){
        stringArr.push(key + '=' + param[key]);
    })
    stringArr.push("key=" + signKey)
    var string =  stringArr.join('&');
    return MD5(string).toString().toUpperCase();
}

exports.getNonceStr = function(){
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = $chars.length;
    var noceStr = "";
    for (var i = 0; i < 32; i++) {
        noceStr += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
}

exports.getNonceStrObjectId = function(){
    var $chars = 'ABCDEFabcdef0123456789';
    var maxPos = $chars.length;
    var id = moment(new Date()).format('YYYYMMDDHHmm');
    for (var i = 0; i < 12; i++) {
        id += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return id;
}

exports.getMchBillno = function(){
    var random = moment(new Date()).format('YYYYMMDDHHmm');
    random += Math.random().toString().substring(2, 8)
    return random;
}