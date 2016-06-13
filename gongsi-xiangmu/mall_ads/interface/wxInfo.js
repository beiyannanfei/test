/**
 * Created by chenjie on 2014/8/22.
 */
var fs = require('fs');
var request = require('superagent');
var config = require('../config');
var _ = require('underscore');
var httpUtils = require('./http-utils.js')

var tkConfig = require('../tokenConfig');
var env = require('../env-config');

var lastPusTime = null
exports.pushErrorMsg = function(msg){
    if (env == 'localhost'){
        return;
    }
    msg = 'env:' + env + '\n' + msg
    if (lastPusTime && new Date().getTime() - lastPusTime < 60 * 1000){
        return
    }
    lastPusTime = new Date().getTime();
    var url = 'http://mb.dev.tvm.cn/rest/wxpush?token=7fda67277f'
    var params = {
        content: msg,
        weixin_token: 'tvmty',
        openids: 'oux1puBfVrHCUDnvqSIjwxh2NQ0Q,oux1puDSzhac5a6ybb6Lb5_kpf5o,oux1puPfwJlreyxMjr5UgI422Vnc',
        weixin_type: 'text'
    };
    httpUtils.httpPost(url, params, function(err, response){

    })
}

exports.getwxAccessToken = function(token, cb){
    var url = tkConfig.getAuthDomain(token) + '/rest/wxaccesstoken?token=' + config.token + '&weixin_token=' + token;
    httpUtils.httpGet(url, cb);
}

exports.getWxJsParam = function (token, cb) {
    var url = tkConfig.getAuthDomain(token) + "/rest/wxjsticket?token=" + config.token + '&wx_token=' + token;
    httpUtils.httpGet(url, cb);
}

/*
exports.getwxAccessToken('35o4zts2mwgdenkvpqrf0u', function(){
    console.log(arguments)
})*/
