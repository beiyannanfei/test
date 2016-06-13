/**
 * Created by ZWB on 13-12-4.
 */

var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var request = require('superagent');
var _ = require('underscore');

var interface = require('../interface');

var tools = require('../tools');

var redisClient  = tools.redisClient();
redisClient.select(10, function() {
    console.log('个人中心 动态二维码 切换到 database 10');
});

exports.getQrcode = function(wxToken,title,type,callback){
    interface.getQrcode(wxToken,title,type,function(data){
        if(data){
            callback(data.qrcode_url);
        }else{
            callback(null);
        }
    });
};

var getQrcodeInfoBySceneId = exports.getQrcodeInfoBySceneId = function(sceneId,callback){
    redisClient.hgetall(sceneId,function(error,reply){
        if(error){
            callback(null);
            return;
        }else{
            callback(reply);
        }
    });
};

var updateQrcodeInfoBySceneId = exports.updateQrcodeInfoBySceneId = function(sceneId,obj,callback){
    redisClient.hmset(sceneId,obj,function(error,reply){
        if(!error){
            if(!obj.updateFlag){
                redisClient.expire(sceneId,1800);
            }
            if(callback && typeof callback === 'function'){
                callback({status: 'ok',sceneId: sceneId});
            }
        }else{
            callback(null);
        }

    });
};