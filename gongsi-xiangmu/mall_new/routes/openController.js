/**
 * Created by chenjie on 2014/8/22.
 */

var ut = require('./utils')
var _ = require('underscore')
var wxInfo = require('./../interface/wxInfo')
var MD5 = require("crypto-js/md5");
var dbUtils = require('../mongoSkin/mongoUtils.js')

var sigKey = '3rdsigkey123456';

function getSign(param){
    var paramArr = _.keys(param);
    paramArr.sort();
    var stringArr  = []
    _.each(paramArr, function(key){
        stringArr.push(key + '=' + param[key]);
    })
    stringArr.push("sig=" + sigKey)
    var string =  stringArr.join('&');
    return MD5(string).toString().toUpperCase();
}

exports.check3rdSig = function(req, res, next){
    var body = req.body
    var sig = body.sig
    if (!sig){
        return res.send(400, '没有签名sig')
    }
    console.log(body.sig)
    delete body.sig
    var localSig = getSign(body)
    console.log(localSig)
    if (localSig != sig){
        return res.send(400, '签名不正确')
    }
    next()
}

exports.checkOpenId = function(req, res, next){
    var openId = req.param('openId')
    if (!openId){
        return res.send(400, 'openId不存在')
    }
    req.openId = openId;
    next()
}

exports.checkToken = function(req, res, next){
    var token = req.param('token')
    if (!token){
        return res.send(400, 'token不存在')
    }
    req.token = token;
    next()
}

exports.checkTokenAndOpenId = function(req, res, next){
    var openId = req.param('openId')
    if (!openId){
        return res.send(400, 'openId不存在')
    }
    req.openId = openId;

    var token = req.param('token')
    if (!token){
        return res.send(400, 'token不存在')
    }
    req.token = token;
    next()
}

exports.loadUser = function(req, res, next){
    wxInfo.reacquireUsers(req.token, req.openId, function(user){
        if (user){
            req.user = user
        }
        if (user && user.status == 'subscribe'){
            return next();
        } else{
            return res.send({status: -5, message: '用户没有关注'})
        }
    })
}

exports.checkLotteryRecordParam = function(req, res, next){
    var activityIds = req.param('activityIds')
    if (!activityIds){
        return res.send(400, 'activityIds不存在')
    }
    activityIds = activityIds.split(',')
    if (activityIds.length == 0){
        return res.send(400, 'activityIds不存在')
    }
    var ids = []
    _.each(activityIds, function(id){
        if (id && id.length > 0){
            ids.push(id)
        }
    })
    if (ids.length == 0){
        return res.send(400, 'activityIds格式不正确')
    }
    req.activityIds = ids;
    next()
}

exports.loadUserData = function(req, res, next){
    var token = req.param('token')
    var openId = req.param('openId')
    if (!token){
        return res.send(400, '缺少参数')
    }
    if (!openId){
        return res.send(400, '缺少参数')
    }
    req.token = token
    req.openId = openId
    wxInfo.getUserInfo(token, openId, function(err, response){
        if (err){
            return res.send(400, '系统错误')
        } else if (!response || !response.data || response.data.length != 1){
            return res.send(400, '系统错误')
        } else {
            var user = response.data[0]
            req.user = {
                openId: openId,
                wxToken: token,
                username: user.username,
                nickname: user.nickname,
                signature: user.signature,
                weixin_avatar_url: user.weixin_avatar_url,
                country: user.country,
                province: user.province,
                city: user.city,
                source: user.source,
                sex: user.sex
            }
            next()
        }
    })
}