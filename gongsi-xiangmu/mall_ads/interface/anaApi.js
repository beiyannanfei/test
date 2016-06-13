/**
 * Created by chenjie on 2015/5/13.
 */


var httpUtils   = require('./http-utils.js')  //timeout在超时后抛出错误
var config      = require('../config.js')
var MD5         = require("crypto-js/md5");
var sleep       = require("sleep");
var request     = require("request");
var http        = require('http');
var _           = require('underscore');

exports.getPvUv = function(param, cb){
    var url = /*config.anaHost + */'http://ana.mtq.tvm.cn/behavior/yaotv/yaotv';
    httpUtils.httpPost(url, param, cb)
}

exports.getBoundPvUv = function(cb){
    var url = 'http://api.mtq.tvm.cn/templateapp?appid=runtimeappid';
    var param = {
        service:"generalApi",
        method:"queryCounter",
        data: JSON.stringify({instanceId:'5598bbc1e9fd880a2248efb2',type:'GLOBAL',counterName:'榜单总人数'})
    }

    httpUtils.httpPostOpenApi(url, param, cb)
}

exports.getUV =function(tvmid,createTime,cb){
    //sleep.sleep(10);
    console.log("get url");
    var url="http://ana.mtq.tvm.cn/behavior/yaotv/ad"+
        "?token=354e6b14b65b79ad" +
        "&master_id=" + MD5(tvmid).toString() +         //tvmid md5 MD5("tvmid").toString()
        "&channel_id=1782" +
        "&title_id="+(new Date(createTime).getTime())+   //createTime new Date(createTime).getTime()
        "&event_code=AD";
    console.log("zwb url "+url);
    //request timeout为建立连接时间
    var ok=false;
    var myRequest=request.get({url:url,json:true},function(err,result,body){
        ok=true;
        if(err){
            console.log("get ana yaoTv err"+err);
            cb("httpGetNoJson "+err);
        }
        if(body.status=="success"){
            var uv=parseInt(body.data[0].uv);
            console.log("uv info "+uv+" time:"+(new Date()));
            cb(null,uv);
        }else{
            cb("data.status"+body.status);
        }
    });
    setTimeout(function(){
        //超时手动关闭
        myRequest.req.abort();
    },3000);
};


exports.getUVbyChannel =function(tvmid,createTime,channel_id,cb){
    //sleep.sleep(10);
    console.log("get url");
    var url="http://ana.mtq.tvm.cn/behavior/yaotv/ad"+
        "?token=354e6b14b65b79ad" +
        "&master_id=" + MD5(tvmid).toString() +         //tvmid md5 MD5("tvmid").toString()
        "&channel_id="+channel_id+  //1782" +
        "&title_id="+(new Date(createTime).getTime())+   //createTime new Date(createTime).getTime()
        "&event_code=AD";
    console.log("zwb url "+url);
    //request timeout为建立连接时间
    var ok=false;
    var myRequest=request.get({url:url,json:true},function(err,result,body){
        ok=true;
        if(err){
            console.log("get ana yaoTv err"+err);
            cb("httpGetNoJson "+err);
        }
        if(body.status=="success"){
            var uv=parseInt(body.data[0].uv);
            console.log("uv info "+uv+" time:"+(new Date()));
            cb(null,uv);
        }else{
            cb("data.status"+body.status);
        }
    });
    setTimeout(function(){
        //超时手动关闭
        myRequest.req.abort();
    },3000);
};


exports.postLotteryPlan = function(url, param, cb) {
    report(url, param, cb);
};

var report = function(url, param, cb, tryTime) {
    if (!tryTime) {
        tryTime = 0;
    }
    httpUtils.httpPost(url, param, function(err, response) {
        if (!!err) {
            if (tryTime < 3) {
                tryTime++;
                console.log("[%j] fileName: %j report tryTime: %j, err: %j, response: %j", new Date().toLocaleString(), __filename, tryTime, err, response);
                return report(url, param, cb, tryTime);
            }
            else {
                return cb(err, response);
            }
        }
        console.log("postLotteryPlan success err: %j, response: %j",err, response);
        cb(err, response);
    });
};



