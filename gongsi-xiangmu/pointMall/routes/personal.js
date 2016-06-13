/**
 * Created by nice on 2014/8/29.
 */

var moment = require('moment');
var URL = require('url');

var tools = require('../tools');
var interface = require('../interface');
var search = require('./search');
var models = require('../models/index');
var Users = models.UsersPoint;
var IntegralLog = models.IntegralLog;
var Personal = models.Personal;
var dealQrcode = require('../wechat/dealQrcode');

var utils = require('./utils');

var _ = require('underscore');


var config = require('../config.js');
var wtopicUrl = config.wtopicUrl;
var wxwtopicUrl = 'http://wtopic.mtq.tvm.cn';
var userHost = config.userHost;

var reacquireUserRedisClient = tools.redisClient();
reacquireUserRedisClient.select(13, function () {
    console.log('个人中心刷新用户信息入库 切换到database 13');
});


exports.index = function (req, res) {
    var hostClient = req.headers.host || '';
    console.log('-------personal hostClient-------',hostClient);
    var wxToken = req.session.token;
    var openId = req.session.openId;
    var source = req.query.source || '';
    if (wxToken) {
        var _id = tools.joinId(wxToken, openId);
        console.time('Users.findById');
        Users.findById(_id, function (err, doc) {
            if (err) {
                console.log(err);
            }
            console.timeEnd('Users.findById');
            var nickName = '';
            var integral = '';
            var headImg = '';
            var wx_qrcode = '';
            if (doc) {
                nickName = doc.nickName;
                headImg = doc.headImg;
                integral = doc.integral;
            }
            console.time('interface.getQrcode');
            //二维码信息
            interface.getQrcode(wxToken, '个人中心', 0, function (qrcodeInfo) {
                console.timeEnd('interface.getQrcode');
                if (qrcodeInfo) {
                    wx_qrcode = qrcodeInfo.qrcode;
                    var sceneId = qrcodeInfo.scene_id;
                    var redisKey = wxToken + ':' + sceneId;
                    var dealType = 'scancode';
                    var myArgs = openId;
                    qrcodeInfo.dealType = dealType;
                    qrcodeInfo.myArgs = myArgs;
                    dealQrcode.updateQrcodeInfoBySceneId(redisKey, qrcodeInfo, function (info) {
                        console.log('============动态二维码入库================', info);
                    });
                }
                req.session.personal_openId = openId;
                console.time('Personal.findOne');
                Personal.findOne({wxToken: wxToken}, function (err, personal) {
                    console.timeEnd('Personal.findOne');
                    if (err) {
                        console.log(err)
                    }
                    var title = '个人中心';
                    var scanIntegral = '1000';
                    var unit = '积分';
                    if (personal) {
                        title = personal.title;
                        scanIntegral = personal.integral;
                        unit = personal.unit;
                    }
                    var options = {
                        layout: false,
                        title: title,
                        unit: unit,
                        scanIntegral: scanIntegral,
                        nickName: nickName,
                        headImg: headImg,
                        integral: integral,
                        openId: openId,
                        wxToken: wxToken,
                        wx_qrcode: wx_qrcode
                    };
                    if (wxToken == 'tmjysh' || wxToken == '8e8c547795a5fe3c' || wxToken == 'bab08632b649' || wxToken == 'a225fcf1f61d' || config.NODE_ENV == 'dev'){
                        options.wtopicUrl = wtopicUrl
                    } else {
                        options.wtopicUrl = wxwtopicUrl
                    }
                    if(wxToken=='b48c7259d874' || wxToken=='70c69789da7c' || wxToken=='tvmty'){
                        options.personalise = false;
                        if(wxToken=='b48c7259d874' || wxToken=='tvmty'){
                            options.shareTitle = '妈妈v呀：赚V币';
                        }else if(wxToken=='70c69789da7c'){
                            options.shareTitle = '安帝柔术：赚积分';
                        }
                        options.userHost = userHost;
                        options.shareDesc = '小伙伴儿们快来扫扫二维码加关注，一起得奖励！';
                    }else{
                        options.personalise = true;
                    }
//                    if(config.NODE_ENV != 'dev'){
//                        if(hostClient){
//                            if(hostClient.indexOf('a.mb.mtq')!=-1){
//                                options.wtopicUrl = 'http://a.wtopic.mtq.tvm.cn';
//                            }else{
//                                options.wtopicUrl = 'http://wtopic.mtq.tvm.cn';
//                            }
//                        }else{
//                            options.wtopicUrl = wtopicUrl
//                        }
//                    }else{
//                        options.wtopicUrl = wtopicUrl
//                    }
                    res.render('personal', options);
                });
            });
        });
    } else {
        res.send('验证不合法！');
    }
};

exports.deploy = function (req, res) {
    var wxToken = req.session.token;
    Personal.findOne({wxToken: wxToken}, function (err, doc) {
        if (err) {
            console.log(err)
        }
        var title = '';
        var integral = '';
        var attention = '';
        var unit = '';
        var recommendNumber = '';
        if (doc) {
            title = doc.title;
            integral = doc.integral;
            attention = doc.attention;
            unit = doc.unit;
            recommendNumber = doc.recommendNumber;
        }
        res.render('personal-config', {
            layout: false,
            title: title,
            integral: integral,
            attention: attention,
            recommendNumber:recommendNumber,
            unit: unit
        });
    });


};


exports.add = function (req, res) {
    var wxToken = req.session.token;
    var body = req.body;
    if (wxToken) {
        if (body && body != 'undefined') {
            var title = body.title || '个人中心';
            var integral = body.integral || 1000;
            var attention = body.attention || 1000;
            var unit = body.unit || '积分';
            var recommendNumber = body.recommendNumber || 1;
            Personal.findOne({wxToken: wxToken}, function (err, doc) {
                if (err) {
                    console.log(err)
                }
                if (doc) {
                    Personal.findOneAndUpdate({wxToken: wxToken}, {$set: {title: title, integral: integral, attention: attention, unit: unit,recommendNumber:recommendNumber}}, function (err, per) {
                        if (err) {
                            console.log(err)
                        }
                        if (per) {
                            console.log('---------------Personal update------------',{wxToken: wxToken},{$set: {title: title, integral: integral, attention: attention, unit: unit,recommendNumber:recommendNumber}});
                            var dayTime = moment(new Date).format('YYYY-MM-DD HH:mm:ss');
                            doc.updateTime.addToSet(dayTime);
                            doc.save(function (err, updateDate) {
                                if (err) {
                                    console.log(err);
                                }
                            });
                            res.send({status: 'success', data: per});
                        } else {
                            res.send({status: 'failed', msg: 'Personal.findOneAndUpdate is error'});
                        }
                    });
                } else {
                    var personal = new Personal({
                        wxToken: wxToken,
                        title: title,
                        integral: integral,
                        attention: attention,
                        unit: unit,
                        updateTime:moment(new Date).format('YYYY-MM-DD HH:mm:ss'),
                        recommendNumber:recommendNumber
                    });
                    personal.save(function (err, per) {
                        if (err) {
                            console.log(err)
                        }
                        if (per) {
                            res.send({status: 'success', data: per});
                        } else {
                            res.send({status: 'failed', msg: 'personal.save is error'});
                        }
                    });
                }
            });
        } else {
            res.send({status: 'failed', msg: 'Parameters is null'});
        }
    } else {
        res.send('wx_token is null');
    }
};

exports.unit = function (req, res) {
    var wxToken = req.query.wxToken;
    if(wxToken){
        Personal.findOne({wxToken: wxToken}, function (err, doc) {
            if (err) {
                console.log(err)
            }
            if (doc) {
                res.send({status: 'success',unit:doc.unit});
            }else{
                res.send({status: 'success', unit: '积分'});
            }
        });
    }else{
        res.send({status: 'failed', msg: 'wxToken is null'});
    }
};

/**
 * 重新获取用户信息并入库
 * @param req
 * @param res
 */
exports.reacquireUser = function (req, res) {
    var openId = req.session.personal_openId;
    var wxToken = req.session.token;
    if (openId && wxToken) {
        var key = "reacquireUser:" + wxToken + ":" + openId;
        reacquireUserRedisClient.exists(key, function (err, replies) {
            if (err) {
                console.log(err);
            }
            if (replies) {
                reacquireUserRedisClient.hgetall(key, function (error, reply) {
                    if (error) {
                        console.log(error);
                    }
                    if (reply) {
                        res.send({status: 'success', data: {nickName: reply.nickName, headImg: reply.headImg}});
                    } else {
                        res.send({status: 'failed', data: [], msg: 'redis获取信息为空'});
                    }
                });
            } else {
                reacquireUserInsert(openId, wxToken, key, function (data) {
                    if (data) {
                        res.send({status: 'success', data: data});
                    } else {
                        res.send({status: 'failed', data: [], msg: '获取用户信息失败'});
                    }
                });
            }
        });
    } else {
        res.send({status: 'failed', data: [], msg: '参数 不合法！'});
    }
};


exports.queryUser = function (req, res) {
    var wxToken = req.query.wxToken || '';
    var openId = req.query.openId || '';
    if (wxToken === '' || wxToken === 'undefined' || openId === '' || openId === 'undefined') {
        res.send({status: 'failed', data: [], msg: 'wxToken or openid is null'});
    } else {
        interface.getUserInfo(openId, wxToken, function (data) {
            if (data && data.data.data) {
                res.send({status: 'success', data: data.data.data});
            } else {
                res.send({status: 'failed', data: []});
            }
        });
    }
};


var reacquireUserInsert = function (openId, wxToken, redisKey, callback) {
    interface.wxRefreshUser(openId, wxToken, function (data) {
        if (data && data.result === true) {
            var message = data.message;
            var nickName = message.username;
            var headImg = message.weixin_avatar_url;
            var _id = tools.joinId(wxToken, openId);
            Users.findByIdAndUpdate(_id, {$set: {nickName: nickName, headImg: headImg}}, function (err, doc) {
                if (err) {
                    console.log(err);
                }
                if (doc) {
                    var obj = {
                        nickName: nickName, headImg: headImg
                    }
                    reacquireUserRedisClient.hmset(redisKey, obj, function (error, reply) {
                        if (error) {
                            console.log(error);
                        }
                        if (reply) {
                            reacquireUserRedisClient.expire(redisKey, 60 * 5);
                        }
                    });
                } else {
                    console.log('================个人中心刷新获取用户 mongodb更新用户信息失败================', wxToken, openId);
                }
            });
            callback({nickName: nickName, headImg: headImg});
        } else {
            console.log('================个人中心刷新获取用户信息失败================', wxToken, openId);
            callback(null);
        }
    });
};