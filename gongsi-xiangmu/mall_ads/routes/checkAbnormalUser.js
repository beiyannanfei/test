/**
 * Created by luosm on 2015/7/28.
 */
var tools                  = require('../tools');
var sysRedisClient         = tools.sysLotteryRedis();
var sysLotteryRedisBlack   = tools.sysLotteryRedis();
var _                      = require("underscore");
var config                 = require('../config.js');
//var request              = require('request');
var httpUtils              = require('../interface/http-utils.js');
var url                    = "http://localhost:3000/checkusers";

/*
 * 非互动时段
 * 调用抽奖信息 (获取个人中奖结果  获取抽奖奖池信息) 进48小时黑名单
 * */
exports.setUsersBlackList=function(lotteryInfo,openId){

    var lotteryObj=null;
    //如果是字符串 表示需要根据lotteryid查询抽奖信息
    if(_.isString(lotteryInfo)){
        sysRedisClient.HGET("sysLotteryDataKeys_noWin",lotteryInfo,function(err,doc){
            if(err){
                console.log("setUsersBlackList err "+err);
            }
            if(doc){
                lotteryObj=JSON.parse(doc);
                setAbnormalBehaviorUser(lotteryObj,openId);
            }
            //开奖时刻sysLotteryDataKeys_noWin中没有记录
            else{
                //AbnormalBehaviorUser(openId);
            }
        })

    }else if(_.isObject(lotteryInfo)){
        lotteryObj=lotteryInfo;
        setAbnormalBehaviorUser(lotteryObj,openId);
    }
}

exports.checkABUsers=function(req){
    var user=req.user;
    var real_ip = req.get("X-Real-IP") || req.get("X-Forwarded-For") || req.ip;
    console.log("real_ip:"+real_ip);
    return ;
    httpUtils.httpPostJSON(url,{"user":user},function(err,body){
        console.log(err);
        console.log(body);
    })
}

function setAbnormalBehaviorUser(lotteryObj,openId){
    var now    = (new Date()).getTime();
    var end    = lotteryObj.end;
    var start  = lotteryObj.start;
    var isAbnormalBehavior =false; //默认非异常用户
    //开奖结束超过120s 则为异常用户 每次异常刷新ttl
    var end2=+end+1000*60*2;
    if(now >= end2){
        isAbnormalBehavior=true;
    }
    if(isAbnormalBehavior){
        console.log("time "+now+"end2 "+end2);
        AbnormalBehaviorUser(openId);
    }
}

function AbnormalBehaviorUser(openId){
    var ttl =config.blackTTL.AbnormalBehaviorUser;
    sysLotteryRedisBlack.SETEX("AbnormalBehaviorUser"+openId,ttl,openId,
        function (err, doc){
            if(err){
                console.log("set abnormal behavior user err "+err);
            }
            if(doc){
                console.log("to abnormal behavior openid "+openId+" "+(new Date()));
            }
        }
    );
}

