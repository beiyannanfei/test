/**
 * Created by chenjie on 2014/8/22.
 */

var models = require('../models')
var ut = require('./utils')
var _ = require('underscore')
var wxInfo = require('./wxInfo')
var MD5 = require("crypto-js/md5");

var sigKey = '3rdsigkey123456';

var redisCache = require('./redis_cache.js')

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

exports.loadUser = function(req, res, next){
    var key = 'user-' + req.token + '-'+ req.openId
    redisCache.get(key, function(err, value){
        if (err || !value){
            wxInfo.reacquireUsers(req.token, req.openId, function(user){
                if (user){
                    req.user = user
                    redisCache.set(key, 60, user);
                }
                return next();
            })
        } else {
            req.user = value
            return next();
        }
    })
}

exports.checkUserFollowed = function(req, res, next){
    if (req.user && req.user.status == 'subscribe'){
        return next();
    } else{
        return res.send({status: -5, message: '用户没有关注'})
    }
}

exports.checkLotteryRecordParam = function(req, res, next){
    var activityIds = req.param('activityIds')
    if (!activityIds){
        return res.send(400, 'activityIds参数不存在')
    }
    activityIds = activityIds.split(',')
    if (activityIds.length == 0){
        return res.send(400, 'activityIds参数错误')
    }
    var ids = []
    _.each(activityIds, function(id){
        if (id && id.length > 0){
            ids.push(id)
        }
    })
    if (ids.length == 0){
        return res.send(400, 'activityIds参数错误')
    }
    req.activityIds = ids;
    next()
}