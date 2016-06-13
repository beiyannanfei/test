
var httpUtils = require('./http-utils.js')

exports.createWxRed = function(param, wx_ssl_options, cb){
    var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/hbpreorder'
    console.log(param)
    httpUtils.postXmlHttps(url, wx_ssl_options, param, function(err, response){
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
    })
}

exports.createWxRedLottery = function(ACCESSTOKEN, param, cb){
    var url = 'https://api.weixin.qq.com/yaotv/user/addlotteryinfo?access_token=' + ACCESSTOKEN
    console.log(param)
    httpUtils.httpPostJSON(url, param, function(err, response){
        console.log(arguments)
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
    console.log(param)
    var url = 'https://api.weixin.qq.com/yaotv/user/setprizebucket4hb?access_token=' + ACCESSTOKEN
    httpUtils.httpPostJSON(url, param, function(err, response){
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