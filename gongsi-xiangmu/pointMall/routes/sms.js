/**
 * Created by zwb on 2014/12/23.
 */

var URL = require('url');
var moment = require('moment');
var crypto = require('crypto');

var tools = require('../tools');
var SMS = require('../interface/sms');

var models = require('../models/index');
var smsMsg = models.SMS;

var smsConfig = require('../SMS.json');
var expireTime = smsConfig.EFFECTIVE_TIME;

var redisClient = tools.redisClient();
redisClient.select(14, function () {
    console.log('短信验证 SMS 切换到 database 14');
});


exports.index = function (req, res) {

};

/**
 * 发送 短信验证码
 * @param req
 * @param res
 */
exports.sendSMS = function (req, res) {
    return res.send({status: 'success', msg: 'ok', vCode: generateMixed(6)});
    var body = req.body;
    if (body && body != 'undefined') {
        if (body.mobileNumber && body.mobileNumber != 'undefined') {
            var mobileNumber = body.mobileNumber;
            var openId = body.openId || '';
            var re = /^[0-9]+.?[0-9]*$/;
            if (re.test(mobileNumber)) {
                var number = generateMixed(6);
                sendSMSCode(mobileNumber, number, openId, function (data) {
                    data.vCode = number
                    res.send(data);
                });
            } else {
                res.send({status: 'failed', msg: 'mobileNumber is error'});
            }
        } else {
            res.send({status: 'failed', msg: 'mobileNumber is null'});
        }
    } else {
        res.send({status: 'failed', msg: 'parameters is error！'});
    }
};

/**
 * 检验、短信验证码
 * @param req
 * @param res
 */
exports.verificationCode = function (req, res) {
    var mobileNumber = req.query.mobileNumber || '';
    var code = req.query.code || '';
    if (mobileNumber && code) {
        var redisKey = 'SMS:' + mobileNumber + ':' + code;
        redisClient.exists(redisKey, function (error, reply) {
            if (error) {
                console.log(error);
                res.send({status: 'failed', msg: 'redis Database Exceptions'});
            } else {
                if (reply) {
                    res.send({status: 'success'});
                } else {
                    res.send({status: 'failed', msg: 'invalid code'});
                }
            }
        });
    } else {
        res.send({status: 'failed', msg: 'mobileNumber or code is null'});
    }
};

exports.smsAuthSign = function (req, res, next) {
    var params = {};
    params.rkey = '03a4597bb077a4a077254d0e1b9c6103';// tvm-mall@)!$ md5 加密字符串;
    params.mobileNumber = req.param('mobileNumber');
    params.sigtime = req.param('sigtime');
    if (!params.mobileNumber) {
        return res.send({status: 'failed', msg: '参数 mobileNumber 错误'});
    }
    if (!params.sigtime) {
        return res.send({status: 'failed', msg: '参数sigtime错误'});
    } else {
        if (Math.abs(new Date().getTime() - params.sigtime) > 5 * 60 * 1000) {
            return res.send({status: 'failed', msg: '认证过期失败'});
        }
    }
    var sig = req.param('sig');
    var str = params.mobileNumber + ':' + params.rkey + ':' + params.sigtime;
    var md5 = crypto.createHash('md5');
    var sign = md5.update(str);
    sign = md5.digest('hex');
    if (sign == sig) {
        next();
    } else {
        return res.send({status: 'failed', msg: '认证签名失败'});
    }
};


/**
 *  短信发送验证码
 * @param mobileNumber      手机号码
 * @param vCode             验证码
 * @param openId            微信ID   可以为空 ‘’
 * @param callback
 */
var sendSMSCode = exports.sendSMSCode = function (mobileNumber, vCode, openId, callback) {
    var timestamp = new moment().valueOf().toString();
    var to = mobileNumber;
    var templateId = '12128';
    var minute = expireTime || 2;
    var datas = [vCode, minute.toString()];
    var isSendKey = 'SMS:SEND:' + mobileNumber;  //判断几分钟内是否发送过短信  redis key
    redisClient.exists(isSendKey, function (error, replyKey) {
        if (error) {
            console.log(error);
            callback({status: 'failed', msg: 'redis Database Exceptions'});
        } else {
            if (replyKey) {
                redisClient.ttl(isSendKey, function (error, time) {
                    if (error) {
                        console.log(error);
                    }
                    var times = 3;
                    if (time) {
                        times = time;
                    }
                    callback({status: 'failed', msg: minute + '分钟内不能重复发送短信,请于' + times + '秒后重试!'});
                });
            } else {
                SMS.sms(to, templateId, datas, function (data) {
                    try {
                        var data = JSON.parse(data);
                        if (data && data.statusCode == '000000') {
                            var redisKey = 'SMS:' + mobileNumber + ':' + vCode;
                            redisClient.set(redisKey, vCode, function (error, reply) {
                                if (error) {
                                    console.log(error);
                                    callback({status: 'failed', msg: 'redis Database Exceptions'});
                                } else {
                                    //发送信息入库
                                    addsmsMsg({
                                        mobileNumber: mobileNumber,
                                        templateId: templateId,
                                        openId: openId,
                                        content: JSON.stringify(datas)
                                    });
                                    expireTime = parseInt(expireTime);
                                    redisClient.expire(redisKey, (expireTime + 1) * 60);
                                    redisClient.set(isSendKey, timestamp, function (error, replys) {
                                        if (error) {
                                            console.log(error);
                                        }
                                        redisClient.expire(isSendKey, expireTime * 60);
                                    });
                                    callback({status: 'success', timestamp: timestamp});
                                }
                            });
                        } else {
                            if (data) {
                                var statusCode = data.statusCode;
                                var errMsg = getErrMsg(statusCode);
                                callback({status: 'failed', msg: errMsg, code: statusCode, originalData: data});
                            } else {
                                callback({status: 'failed', msg: 'SMS send is error'});
                            }
                        }
                    } catch (e) {
                        console.log(e);
                        callback({status: 'failed', msg: 'send SMS data  转换JOSN失败'});
                    }
                });
            }
        }
    });
};

var addsmsMsg = function (obj) {
    var sms = new smsMsg(obj);
    sms.save(function (err, doc) {
        if (err) {
            console.log(err);
        }
    });
};

function getErrMsg(errCode) {
    switch (errCode) {
        case '112300':
            return "接收短信的手机号码为空";
        case '112301':
            return "短信正文为空";
        case '112302':
            return "群发短信已暂停";
        case '112303':
            return "应用未开通短信功能";
        case '112304':
            return "短信内容的编码转换有误";
        case '112305':
            return "应用未上线，短信接收号码外呼受限";
        case '112306':
            return "接收模板短信的手机号码为空";
        case '112307':
            return "模板短信模板ID为空";
        case '112308':
            return "模板短信模板data参数为空";
        case '112309':
            return "模板短信内容的编码转换有误";
        case '112310':
            return "应用未上线，模板短信接收号码外呼受限";
        case '112311':
            return "短信模板不存在";
        default:
            return '未知错误';
    }
}

function generateMixed(n) {
//    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var res = "";
    var len = chars.length;
    for (var i = 0; i < n; i++) {
        var id = Math.ceil(Math.random() * (len - 1));
        id = parseInt(id);
        res += chars[id];
    }
    return res;
}


