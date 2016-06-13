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
 * �ǻ���ʱ��
 * ���ó齱��Ϣ (��ȡ�����н����  ��ȡ�齱������Ϣ) ��48Сʱ������
 * */
exports.setUsersBlackList=function(lotteryInfo,openId){

    var lotteryObj=null;
    //������ַ��� ��ʾ��Ҫ����lotteryid��ѯ�齱��Ϣ
    if(_.isString(lotteryInfo)){
        sysRedisClient.HGET("sysLotteryDataKeys_noWin",lotteryInfo,function(err,doc){
            if(err){
                console.log("setUsersBlackList err "+err);
            }
            if(doc){
                lotteryObj=JSON.parse(doc);
                setAbnormalBehaviorUser(lotteryObj,openId);
            }
            //����ʱ��sysLotteryDataKeys_noWin��û�м�¼
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
    var isAbnormalBehavior =false; //Ĭ�Ϸ��쳣�û�
    //������������120s ��Ϊ�쳣�û� ÿ���쳣ˢ��ttl
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

