/**
 * Created by chenjie on 2015/6/25.
 */

var _ = require('underscore')
var ut = require('./utils.js')
var payUtils = require('./pay-utils')
var payConfig = require('../etc/payConfig.js')
var dbUtils = require('../mongoSkin/mongoUtils.js')
var wxredlotteryCollection = new dbUtils('wxredlottery')
var wxredApi = require('../interface/wxredApi.js');
var yaoTVApi = require('../interface/yaoTVApi.js');

exports.listWxRedLottery = function(req, res){
    var condition = {state: {$ne: 'deleted'}}
    ut.groupCondition(condition, req)
    wxredlotteryCollection.find(condition, {title: 1, begin_time: 1, expire_time: 1, total: 1, dateTime: 1}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            res.send([])
        } else{
            res.send(docs)
        }
    })
}

exports.midWxRedLotteryLoaderByLotteryId = function(req, res, next){
    var lottery_id = req.param('lottery_id');
    if (!lottery_id) {
        return res.send(404);
    }
    wxredlotteryCollection.findOne({lottery_id: lottery_id}, function (err, doc) {
        if (err) {
            return res.send(500, 'mongodb error');
        } else if (!doc) {
            return res.send(404, 'goods is not exist');
        }
        req.wxredLottery = doc;
        next()
    })
}

exports.midWxRedLotteryLoader = function(param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next) {
        var id = req.param(param);
        if (!id) {
            return res.send(404);
        }
        wxredlotteryCollection.findById(id, function (err, doc) {
            if (err) {
                return res.send(500, 'mongodb error');
            } else if (!doc) {
                return res.send(404, 'id is not exist');
            }
            req.wxredLottery = doc;
            next()
        })
    }
}

exports.checkWxRedLotteryLoader = function(param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next) {
        var id = req.param(param);
        wxredlotteryCollection.findById(id, function (err, doc) {
            req.wxredLottery = doc;
            next()
        })
    }
}

exports.wxRedLotteryInfo = function(req, res){
    var o = req.wxredLottery
    res.send(o)
}

function checkWxRedLotteryParam(req, cb){
    if (!req.body.title){
        return cb('title参数不存在')
    }
    if (req.body.title.length > 32){
        return cb('title不能超过32个字');
    }
    if (!req.body.desc){
        return cb('desc参数不存在')
    }
    if (req.body.desc.length > 256){
        return cb('desc不能超过32个字');
    }
    req.body.onoff = ut.checkPositiveInt(req.body.onoff)
    if (req.body.onoff != 0 && req.body.onoff != 1){
        return cb('onoff参数必须是0或者1')
    }
    req.body.begin_time = ut.checkPositiveInt(req.body.begin_time)
    if (!req.body.begin_time){
        return cb('begin_time参数不存在')
    } else {
        req.body.begin_time = Math.floor(req.body.begin_time / 1000)
    }
    req.body.expire_time = ut.checkPositiveInt(req.body.expire_time)
    if (!req.body.expire_time){
        return cb('expire_time参数不存在')
    } else {
        req.body.expire_time = Math.floor(req.body.expire_time / 1000)
    }
    if (req.body.expire_time < req.body.begin_time){
        return cb('expire_time不能小于begin_time')
    }
    req.body.total = ut.checkPositiveInt(req.body.total)
    if (!req.body.total){
        return cb('total参数不正确')
    }
    if (!req.body.redIds || !_.isArray(req.body.redIds)){
        return cb('redIds参数不正确')
    }
    cb(null, req.body);
}

exports.createWxRedLotteryInner = function(yyyappId, doc, sp_tickets, cb){
    yaoTVApi.getYaoAccessToken(yyyappId, function(err, accessToken){
        if (err){
            console.log(err)
            cb(err);
        } else {
            wxredApi.createWxRedLottery(accessToken, doc, function(err, response){
                if (err){
                    cb(err);
                } else {
                    if (response && response.errcode == 0 && response.lottery_id){
                        doc.dateTime = new Date()
                        doc.lottery_id = response.lottery_id
                        doc.begin_time = doc.begin_time * 1000
                        doc.expire_time = doc.expire_time * 1000
                        var id = payUtils.getNonceStrObjectId()
                        doc._id = new dbUtils.ObjectID(id)
                        wxredlotteryCollection.save(doc, function(err, o){
                            if (err){
                                cb(err);
                            } else {
                                setredInfo(accessToken, response.lottery_id, sp_tickets, function(err){
                                    if (err){
                                        cb(err);
                                    } else {
                                        cb(null, doc._id.toString());
                                    }
                                });
                            }
                        })
                    } else {
                        cb(err);
                    }
                }
            })
        }
    })
}

/*exports.addWxRedLottery = function(req, res){
    checkWxRedLotteryParam(req, function(err, doc){
        if (err){
            return res.send(500, err)
        }
        var redIds = doc.redIds
        doc.appid = payConfig.baseConfig.appid
        doc.key = payConfig.redkey
        doc.type = 1
        exports.createWxRedLotteryInner(req, doc, redIds, function(err, o){


        })
    })
}*/

function setredInfo(accessToken, lottery_id, sp_tickets, cb){
    var prize_info_list = []
    _.each(sp_tickets, function(o){
        prize_info_list.push({ticket: o})
    })
    var param = {
        lottery_id: lottery_id,
        mchid: payConfig.baseConfig.mch_id,
        appid: payConfig.baseConfig.appid,
        prize_info_list: prize_info_list
    }
    wxredApi.setWxRed(accessToken, param, function(err, response){
        if (err){
            cb(err)
        } else if (response){
            if (response.errcode == 0){
                cb()
            } else {
                cb('errmsg:' + response.errmsg)
            }
        } else {
            cb('unknow')
        }
    })
}

exports.jsParam = function(req, res){
    var param = {}
    var userid = req.openId
    if (!userid){
        return res.send(400, 'userid not exist')
    }
    if (req.wxredLottery.state == 1){
        return res.send(403, 'has gained')
    }

    param.userid = userid
    var wxredLottery = req.wxredLottery
    param.lottery_id = wxredLottery.lottery_id
    var captcha = req.body.captcha
    if (captcha){
        param.captcha = captcha
    }
    param.noncestr = payUtils.getNonceStr();
    param.sign = payUtils.getRedSign(param, wxredLottery.key)
    res.send(param);
}