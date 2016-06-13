/**
 * Created by chenjie on 2014/12/18.
 */

var config = require('../config');
var tkConfig = require('../tokenConfig');
var wxInfo = require('./../interface/wxInfo.js');
var SHA1 = require("crypto-js/sha1");
var _ = require("underscore");
var tools = require('../tools');
var typeConfig = require('./typeConfig.js');

var redisClient = tools.redisClient();

function setJsTicket(token, doc, expire){
    var key = 'token' + '-' + token
    redisClient.setex(key, expire, JSON.stringify(doc), function(err, value){

    });
}

exports.getJsShareParam = function(req, res, next){
    var token = req.token
    var url = req.param('url');
    var timestamp = '' + Math.ceil(new Date().getTime() / 1000);
    var noncestr = Math.random().toString().substring(2, 8);
    if (!url){
        return res.send(500, 'url param error')
    }

    var loadJsTicketByRedis = function(){
        var key = 'token' + '-' + token
        redisClient.get(key, function(err, value){
            console.log('redis client');
            console.log(JSON.stringify(value))
            if (err){
                console.log(err);
                res.send(500)
            } else if (!value){
                loadJsTicketByNet();
            } else {
                try{
                    var doc = JSON.parse(value);
                    if (!doc.appId || !doc.jsticket){
                        loadJsTicketByNet();
                    } else {
                        generateJsParam(doc.appId, doc.jsticket)
                    }
                } catch (e){
                    loadJsTicketByNet();
                }
            }
        })
    }


    var loadJsTicketByNet = function(){
        wxInfo.getWxJsParam(token, function(err, response){
            console.log(response)
            if (err){
                console.log(err)
                return res.send(500)
            } else if (response && response.data && response.data.appid && response.data.jsticket){
                generateJsParam(response.data.appid, response.data.jsticket);
                setJsTicket(token, {appId: response.data.appid, jsticket: response.data.jsticket}, response.data.jsticket_time)
            } else {
                return res.send(500)
            }
        })
    }

    var generateJsParam = function(appId, jsticket){
        var signParam = {
            jsapi_ticket: jsticket,
            noncestr: noncestr,
            timestamp: timestamp,
            url: url
        }
        var paramArr = _.keys(signParam);
        paramArr.sort();
        var stringArr  = []
        _.each(paramArr, function(key){
            stringArr.push(key + '=' + signParam[key]);
        })
        var string = stringArr.join('&');
        var param = {
            signature: SHA1(string).toString(),
            appId: appId,
            timestamp: timestamp,
            noncestr: noncestr
        }
        req.wxJsParam = param
        next()
    }

    loadJsTicketByRedis();
}

exports.getStoreShareParam = function(req, res){
    var store = req.store
    var token = req.session.token;
    if (!token){
        return res.send({});
    }
    var link = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(tkConfig.getDomain(token) + '/pointMall/enter/store/' + store._id + '?wx_token=' + token);
    var param = {
        link: link,
        imgUrl: store.share?store.share.img_url:'',
        title: store.share?store.share.title:"",
        desc: store.share?store.share.desc:""
    }
    param = _.extend(param, req.wxJsParam);
    res.send(param)
}

exports.getGoodsShareParam = function (req, res) {
    var goods = req.goods;
    var token = req.token;
    if (!token) {
        return res.send({});
    }
    var link = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(tkConfig.getDomain(token) + '/pointMall/auth/goods/' + goods._id + '?wx_token=' + token);
    var param = {
        link: link,
        imgUrl: goods.ext.share ? goods.ext.share.img_url : "",
        title: goods.ext.share ? goods.ext.share.title : "",
        desc: goods.ext.share ? goods.ext.share.desc : ''
    };
    param = _.extend(param, req.wxJsParam);
    res.send(param)
};

exports.getVideoShareParam = function(req, res){
    var goods = req.goods;
    var token = req.token;
    if (goods.type != typeConfig.goods.type.demandPackage && goods.type != typeConfig.goods.type.demand){
        return res.send(500, 'goods type error');
    }

    var generateShareParam = function(doc){
        var shareParam = {
            link: tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(config.domain + '/pointMall/auth/goods/' + goods._id + '?wx_token=' + token)
        }
        shareParam = _.extend(shareParam, doc);
        var param = _.extend(shareParam, req.wxJsParam);
        res.send(param);
    }

    if (goods.type == typeConfig.goods.type.demandPackage && goods.ext.package.length > 0){
        generateShareParam({title: goods.name, desc: goods.ext.shareDesc, imgUrl: goods.pic})
    } else {
        generateShareParam({title: goods.name, desc: goods.ext.videoRes.desc, imgUrl: goods.pic})
    }
}