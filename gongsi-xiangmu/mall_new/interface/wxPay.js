/**
 * Created by chenjie on 2014/12/2.
 */

var httpUtils = require('./http-utils');

function wxHttpCallback(err, response, cb){
    console.log(response)
    if (err){
        cb('http err: ' + err)
    } else if (response){
        if (response.return_code == 'FAIL') {
            cb('return_code fail: ' + response.return_msg)
        } else if (response.result_code == 'FAIL'){
            cb('err_code:' + response.err_code + ', err_msg:' + response.err_code_des)
        } else {
            cb(null, response)
        }
    } else {
        cb('no response')
    }
}

exports.generateOrder = function(param, cb){
    var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
    httpUtils.postXmlHttp(url, param, function(err, response){
        wxHttpCallback(err, response, cb);
    });
}

exports.orderQuery = function(param, cb){
    var url = "https://api.mch.weixin.qq.com/pay/orderquery"
    httpUtils.postXmlHttp(url, param, function(err, response) {
        wxHttpCallback(err, response, cb);
    });
}

exports.orderClose = function(param, cb){
    var url = "https://api.mch.weixin.qq.com/pay/closeorder"
    httpUtils.postXmlHttp(url, param, function(err, response) {
        wxHttpCallback(err, response, cb);
    });
}

exports.refund = function(param, wx_ssl_options, cb){
    var url = "https://api.mch.weixin.qq.com/secapi/pay/refund"
    httpUtils.postXmlHttps(url, wx_ssl_options, param, function(err, response) {
        wxHttpCallback(err, response, cb);
    });
}

exports.sendRedPack = function(param, wx_ssl_options, cb){
    var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack'
    httpUtils.postXmlHttps(url, wx_ssl_options, param, function(err, response) {
        wxHttpCallback(err, response, cb);
    });
}

exports.postOrderTemplate = function(accestoken, param, cb){
    var url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + accestoken;
    httpUtils.postHttpNoEncoded(url, param, cb);
}