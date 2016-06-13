/**
 * Created by chenjie on 2014/8/22.
 */


var ut = require('./utils')
var _ = require('underscore')
var crypto = require('crypto');
var MD5 = require("crypto-js/md5");
var checkABUser= require("./checkAbnormalUser.js");
var payUtil = require("./pay-utils.js");

exports.checkOpenId = function(req, res, next){
    var openId = req.param('openId')
    if (!openId){
        return res.send(400, 'openId不存在')
    }
    req.openId = openId;
    next()
}

exports.checkUser = function(req, res, next){
    console.log('req.body '+(typeof(req.body)))
    //console.log(req.body)
    var sig = req.body.sig
    if(!sig){
        console.log("param sig is required")
        return res.send(400, 'param sig is required')
    }
    var user = req.body.user
    if (!user || !user.name || !user.icon || !user.openId){
        console.log("param user is not exists")
        return res.send(400, 'param user is not exists')
    }
    var realIp = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
    user.realIp = realIp
    req.user = user;
    checkABUser.checkABUsers(req);
    var str = 'openid=' + user.openId + '&rkey=tvm1ning%21%40%23.%24%25%5E';
    var newSig = MD5(MD5(str).toString()).toString();

    console.log('newSig:' + newSig)
    console.log('sig:' + sig)
    if (newSig != sig){
        console.log("sig param error "+user.name+" user.openId "+user.openId);
        return res.send(400, 'sig param error')
    }
    next()
}

exports.getCheckUser = function(req, res, next){
    var sig = req.param("sig");
    var openId = req.param("openId");
    if(!sig){
        return res.send(400, 'param sig is required')
    }
    if(!openId){
        return res.send(400, 'param openId is required')
    }
    var str = 'openid=' + openId + '&rkey=tvm1ning%21%40%23.%24%25%5E';
    console.log(str);
    var newSig = MD5(MD5(str).toString()).toString();

    console.log('newSig:' + newSig)
    console.log('sig:' + sig)
    if (newSig != sig){
        return res.send(400, 'sig param error')
    }
    req.openId = openId
    var realIp = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
    req.realIp = realIp
    next()
}

exports.get3rdCheckUser = function(req, res, next){
    var sig = req.param("sig");
    var openId = req.param("openId");
    if(!sig){
        return res.send(400, 'param sig is required')
    }
    if(!openId){
        return res.send(400, 'param openId is required')
    }
    var str = 'openid=' + openId + '&rkey=tvmining';
    console.log(str);
    var newSig = MD5(MD5(str).toString()).toString();

    console.log('newSig:' + newSig)
    console.log('sig:' + sig)
    if (newSig != sig){
        return res.send(400, 'sig param error')
    }
    req.openId = openId
    next()
}

exports.check3rdParam = function(req, res, next){
    var key = 'tvmw1x2r3e4d56789'
    var sign = req.body.sign
    console.log("check3rdParam req.body: "+ JSON.stringify(req.body));
    delete req.body.sign
    if (sign != payUtil.getSignByParam(req.body, key)){
        return res.send(400, '签名错误')
    }
    next()
}

/*var body = {
    openId: "oegC6uMoJgBnSGZEIPa9U1RdkhEM",
    wxRedLotteryId: '55a888662a3a8e84092d82d6',
    sign: '70F6EA79F719717E0FB46EF2465B9A85'
}
console.log(payUtil.getSignByParam(body, 'tvmw1x2r3e4d56789'))*/

/*
* get方式查询抽奖信息
* 获取某次抽奖的奖池金额总数  /syslottery/money
* */
exports.getCheckLotteryInfo=function(req,res,next){
    var lotteryId=req.param("lotteryid");
    next();
}

/*
 * post方式查询抽奖信息
 * */
exports.postCheckLotteryInfo=function(req,res,next){
    next();
}

/*
var str = 'openid=openId' + '&rkey=tvm1ning%21%40%23.%24%25%5E';
var newSig = MD5(MD5(str).toString()).toString();

console.log('newSig:' + newSig)*/

exports.checkTvmId = function(req, res, next){
    var tvmId = req.param('tvmId');
    if (!tvmId){
        return res.send(400, 'param tvmId is required!')
    }
    req.tvmId = tvmId
    next()
}

exports.checkyyyappId = function(req, res, next){
    var yyyappId = req.param('yyyappId')
    if (!yyyappId){
        return res.send(400, 'param yyyappId is required!');
    }
    req.yyyappId = yyyappId
    next()
}