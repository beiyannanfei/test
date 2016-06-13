/**
 * Created by chenjie on 2015/5/13.
 */


var httpUtils = require('./http-utils.js')
var childProcess = require('child_process');

exports.uploadLogo = function(ACCESS_TOKEN, filePath, cb){
    var url = "https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token=" + ACCESS_TOKEN
    var cmdArr = ['curl', "-F", "buffer=@" + filePath, url]
    childProcess.exec(cmdArr.join(' '), function(err, response){
        if (err){
            cb(err)
        } else if (response){
            try {
                response = JSON.parse(response);
            } catch (e) {}
            if (response.url){
                cb(err, response.url)
            } else {
                cb('err:' + response.errcode + ',' + response.errmsg)
            }
        } else {
            cb('err:')
        }
    });
}

exports.getColors = function(ACCESS_TOKEN, cb){
    var url = "https://api.weixin.qq.com/card/getcolors?access_token=" + ACCESS_TOKEN
    httpUtils.httpGet(url, function(err, response){
        if (err){
            cb(err)
        } else if (response && response.colors){
            cb(err, response.colors)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    });
}

exports.create = function(param, ACCESS_TOKEN, cb){
    var url = "https://api.weixin.qq.com/card/create?access_token=" + ACCESS_TOKEN
    console.log(JSON.stringify(param))
    httpUtils.httpPostJSONTuf8(url, param, function(err, response){
        console.log(arguments)
        if (err){
            cb(err)
        } else if (response && response.card_id){
            cb(err, response.card_id)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    });
}

exports.update = function(param, ACCESS_TOKEN, cb){
    var url = "https://api.weixin.qq.com/card/update?access_token=" + ACCESS_TOKEN
    console.log(JSON.stringify(param))
    httpUtils.httpPostJSONTuf8(url, param, function(err, response){
        console.log(arguments)
        if (err){
            cb(err)
        } else if (response && response.errcode == 0){
            cb(err, response)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    });
}


/*
{
 "action_name": "QR_CARD",
 "action_info": {
    "card": {
            "card_id": "pFS7Fjg8kV1IdDz01r4SQwMkuCKc",
            "code": "198374613512",
            "openid": "oFS7Fjl0WsZ9AMZqrI80nbIq8xrA",
            "expire_seconds": "1800"��
            "is_unique_code": false ,
            "outer_id" : 1
            }
    }
}
*/
exports.qrcodeCreate = function(param, ACCESS_TOKEN, cb){
    var url = "https://api.weixin.qq.com/card/qrcode/create?access_token=" + ACCESS_TOKEN
    httpUtils.httpPostJSONTuf8(url, param, function(err, response){
        if (err){
            cb(err)
        } else if (response && response.ticket){
            cb(err, response.ticket)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    });
}

exports.setWhiteList = function(param, ACCESS_TOKEN, cb){
    var url = "https://api.weixin.qq.com/card/testwhitelist/set?access_token=" + ACCESS_TOKEN
    httpUtils.httpPostJSONTuf8(url, param, function(err, response){
        console.log(response)
        if (err){
            cb(err)
        } else if (response.errcode == 0){
            cb(null, response)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    });
}

exports.getQrcode = function(ticket, cb){
    var url = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket
    httpUtils.httpGet(url, function(err, response){
        console.log(response)
        if (err){
            cb(err)
        } else if (response.errcode == 0){
            cb(null, response)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    })
}

exports.consumeCode = function(code, ACCESS_TOKEN, cb){
    var url = "https://api.weixin.qq.com/card/code/consume?access_token=" + ACCESS_TOKEN
    httpUtils.httpPostJSONTuf8(url, {code: code}, function(err, response){
        console.log(response)
        if (err){
            cb(err)
        } else if (response.errcode == 0){
            cb(null, response)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    });
}

exports.getAPiTicket = function(ACCESS_TOKEN, cb){
    var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + ACCESS_TOKEN + '&type=wx_card'
    httpUtils.httpGet(url, function(err, response){
        console.log(response)
        if (err){
            cb(err)
        } else if (response.ticket){
            cb(null, response)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    })
}

exports.delete = function(ACCESS_TOKEN, card_id, cb){
    var url = "https://api.weixin.qq.com/card/delete?access_token=" + ACCESS_TOKEN
    httpUtils.httpPostJSONTuf8(url, {card_id: card_id}, function(err, response){
        console.log(response)
        if (err){
            cb(err)
        } else if (response.errcode == 0){
            cb(null, response)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    });
}

exports.modifystock = function(ACCESS_TOKEN, params, cb){
    console.log(params)
    var url = "https://api.weixin.qq.com/card/modifystock?access_token=" + ACCESS_TOKEN
    httpUtils.httpPostJSONTuf8(url, params, function(err, response){
        console.log(response)
        if (err){
            cb(err)
        } else if (response.errcode == 0){
            cb(null, response)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    });
}

exports.codeDecrypt = function(ACCESS_TOKEN, params, cb){
    console.log(params)
    var url = "https://api.weixin.qq.com/card/code/decrypt?access_token=" + ACCESS_TOKEN
    httpUtils.httpPostJSONTuf8(url, params, function(err, response){
        console.log(response)
        if (err){
            cb(err)
        } else if (response.errcode == 0){
            cb(null, response)
        } else {
            cb('err:' + response.errcode + ',' + response.errmsg)
        }
    });

}