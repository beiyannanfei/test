var MD5 = require("crypto-js/md5");
var moment = require('moment')
var _ = require('underscore')

exports.getPaySign = function(param, signKey){
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

exports.getOutTradeNo = function(){
    var random = moment(new Date()).format('YYYYMMDDHHmmss');
    random += Math.random().toString().substring(2, 16)
    return random;
}

exports.getMchBillno = function(){
    var random = moment(new Date()).format('YYYYMMDDHHmmss');
    random += Math.random().toString().substring(2, 6)
    return random;
}