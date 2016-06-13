/**
 * Created by chenjie on 2014/8/22.
 */

var models = require('../models')
var ut = require('./utils')
var _ = require('underscore')
var MD5 = require("crypto-js/md5");
var Users = models.Users;

var wxInfo = require('./wxInfo');

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
        return res.send({status: -6, message: '没有签名sig'})
    }
    console.log(body.sig)
    delete body.sig
    var localSig = getSign(body)
    console.log(localSig)
    if (localSig != sig){
        return res.send({status: -6, message: '签名不正确'})
    }
    next()
}

exports.check3rdLotteryParam = function(req, res, next){
    var openId = req.param('openId')
    if (!openId){
        return res.send({status: -6, message: 'openId不存在'})
    }
    req.openId = openId;
    var token = req.param('token')
    if (!token){
        return res.send({status: -6, message: 'token不存在'})
    }
    req.token = token;
    wxInfo.reacquireUsers(req.token, openId, function(user){
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
    var token = req.param('token')
    if (!token){
        return res.send(400, 'token不存在')
    }
    req.token = token;

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

exports.check3rdPayParam = function(req, res, next){
    var token = req.param('token')
    if (!token){
        return res.send(400, 'token不存在')
    }
    var openId = req.param('openId')
    if (!openId){
        return res.send(400, 'openId不存在')
    }
    req.token = token;
    req.session.token = token;
    req.openId = openId;
    req.session.openId = openId;
    next()
}

exports.check3rdGoodsParam = function(req, res, next){
    var token = req.param('token')
    if (!token){
        return res.send(400, 'token不存在')
    }
    var id = req.param('id')
    if (!id){
        return res.send(400, 'id不存在')
    }
    req.token = token;
    next()
}