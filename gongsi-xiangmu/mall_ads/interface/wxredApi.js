
var httpUtils = require('./http-utils.js')

exports.createWxRed = function(param, wx_ssl_options, cb){
    console.time('createWxRed')
    var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/hbpreorder'
    console.log(param)
    httpUtils.postXmlHttps(url, wx_ssl_options, param, function(err, response){
        if (err) {
            cb(err);
        } else if (response) {
            console.timeEnd('createWxRed')
            console.log(response);
            if (response.return_code == 'FAIL') {
                cb('return_code fail: ' + response.return_msg + ',param:' + JSON.stringify(param))
            } else if (response.result_code == 'FAIL'){
                cb('err_code:' + response.err_code + ', err_msg:' + response.err_code_des + ',param:' + JSON.stringify(param))
            } else {
                cb(null, response)
            }
        } else {
            cb('unknow error')
        }
    })
}

exports.createWxRedLottery = function(ACCESSTOKEN, param, cb){
    console.time('createWxRedLottery')
    var url = 'https://api.weixin.qq.com/yaotv/user/addlotteryinfo?access_token=' + ACCESSTOKEN
    console.log(param)
    httpUtils.httpPostJSON(url, param, function(err, response){
        console.log(arguments)
        console.timeEnd('createWxRedLottery')
        if (err){
            cb(err)
        } else if (response && response.lottery_id){
            cb(err, response)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    });
}

exports.setWxRed = function(ACCESSTOKEN, param, cb){
    console.time('setWxRed')
    console.log(param)
    var url = 'https://api.weixin.qq.com/yaotv/user/setprizebucket4hb?access_token=' + ACCESSTOKEN
    httpUtils.httpPostJSON(url, param, function(err, response){
        console.timeEnd('setWxRed')
        console.log(arguments)
        if (err){
            cb(err)
        } else if (response){
            if (response.errcode == 0){
                cb(null, response)
            } else {
                cb('errmsg:' + response.errmsg);
            }
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    });
}

exports.getWxRedInfo = function(param, wx_ssl_options, cb){
    console.time('getWxRedInfo')
    var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/gethbinfo'
    console.log(param)
    httpUtils.postXmlHttps(url, wx_ssl_options, param, function(err, response){
        if (err) {
            cb(err);
        } else if (response) {
            console.timeEnd('getWxRedInfo')
            console.log(response);
            if (response.return_code == 'FAIL') {
                cb('return_code fail: ' + response.return_msg)
            } else if (response.result_code == 'FAIL'){
                cb('err_code:' + response.err_code + ', err_msg:' + response.err_code_des)
            } else {
                cb(null, response)
            }
        } else {
            cb('unknow error')
        }
    })
}

exports.sendRedPack = function(param, wx_ssl_options, cb){
    var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack'
    httpUtils.postXmlHttps(url, wx_ssl_options, param, function(err, response) {
        if (err) {
            cb(err);
        } else if (response) {
            console.log(response);
            if (response.return_code == 'FAIL') {
                cb('return_code fail: ' + response.return_msg)
            } else if (response.result_code == 'FAIL'){
                cb('err_code:' + response.err_code + ', err_msg:' + response.err_code_des)
            } else {
                cb(null, response)
            }
        } else {
            cb('unknow error')
        }
    });
}
