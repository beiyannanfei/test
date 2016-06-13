/**
 * Created by chenjie on 2015/6/25.
 */

var ut = require('./utils')
var _ = require('underscore')
var payUtils = require('./pay-utils')
var dbUtils = require('../mongoSkin/mongoUtils.js')
var wxredCollection = new dbUtils('wxred')
var ordersCollection  = new dbUtils('order');
var wxredlotteryCollection = new dbUtils('wxredlottery')
var typeConfig = require('./typeConfig.js');
var mWxredLottery = require('./wxredLottery.js')

var wxredApi = require('../interface/wxredApi.js');
var wxInfo = require('../interface/wxInfo.js');
var payConfig = require('../etc/payConfig.js');
var auth_mchid = '1000048201'
var auth_appid = 'wxbe43ea14debca355'

var mPrize = require('./prize.js');
var mPreRedRedis = require('../redPager/preRedRedis.js');

var tools       = require('../tools');
var queueClient = tools.queueRedis();
var config = require('../config');

exports.listWxRed = function(req, res){
    var condition = {state: {$ne: 'deleted'}, used: {$ne: 1}}
    ut.groupCondition(condition, req)
    wxredCollection.find(condition, {name: 1, send_name: 1, hb_type: 1, total_amount: 1, total_num: 1, act_name: 1, dateTime: 1}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            res.send([])
        } else{
            res.send(docs)
        }
    })
}

exports.midWxRedLoader = function(param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next) {
        var id = req.param(param);
        if (!id) {
            return res.send(404);
        }
        wxredCollection.findById(id, function (err, doc) {
            if (err) {
                return res.send(500, 'mongodb error');
            } else if (!doc) {
                return res.send(404, 'goods is not exist');
            }
            req.wxred = doc;
            next()
        })
    }
}

exports.wxRedInfo = function(req, res){
    var o = req.wxred
    res.send(o)
}

function checkWxRedParam(req, cb){
    if (!req.body.name){
        return cb('name参数不存在')
    }
    if (!req.body.send_name){
        return cb('send_name参数不存在')
    }
    if (req.body.send_name.length > 8){
        return cb('send_name不能超过8个字');
    }
    if (!req.body.hb_type){
        return cb('hb_type参数不存在')
    }
    if (req.body.hb_type != 'GROUP' && req.body.hb_type != 'NORMAL'){
        return cb('hb_type参数不正确')
    }
    req.body.total_amount = ut.checkPositiveFloat(req.body.total_amount)
    if (req.body.total_amount < 1){
        return cb('total_amount can not < 1')
    }
    if (req.body.total_amount > 4999){
        return cb('total_amount can not > 4999')
    }
    if (!req.body.total_amount || req.body.total_amount < 1){
        return cb('total_amount参数不正确')
    } else {
        req.body.total_amount = req.body.total_amount * 100
    }
    if (req.body.hb_type == 'NORMAL'){
        req.body.total_num = 1
    } else {
        req.body.total_num = ut.checkPositiveInt(req.body.total_num)
        if (!req.body.total_num){
            return cb('total_num参数不正确')
        }
    }
    if (req.body.hb_type == 'GROUP' && req.body.total_num <= 1){
        return cb('裂变红包总人数必须大于1')
    }
    if (req.body.hb_type == 'GROUP' && req.body.total_num > 20){
        return cb('裂变红包总人数必须小于20')
    }
    if (req.body.total_amount / req.body.total_num < 1){
        return cb('total_amount 必须大于 total_num')
    }
    if (!req.body.wishing){
        return cb('wishing参数不存在')
    }
    if (req.body.wishing.length > 32){
        return cb('wishing不能超过32个字');
    }
    if (!req.body.act_name){
        return cb('act_name参数不存在')
    }
    if (req.body.act_name.length > 8){
        return cb('act_name不能超过8个字');
    }
    if (!req.body.remark){
        return cb('remark参数不存在')
    }
    if (req.body.remark.length > 64){
        return cb('remark不能超过64个字');
    }
    cb(null, req.body);
}

exports.addWxRedPrize = function(req, res){
    //return res.send(400, '暂时不支持创建红包')
    /*var pic = req.body.pic
    if (!pic){
        return res.send(500, 'pic not exists')
    }*/

    checkWxRedParam(req, function(err, doc){
        if (err){
            return res.send(500, err)
        }
        var name = doc.name
        delete doc.name
        delete doc.pic

        var prize = {
            name: name,
            pic: 'http://q.cdn.mtq.tvm.cn/adsmall/hb.jpg',
            type: typeConfig.prizeType.wxred,
            wxredParam: doc
        }
        ut.groupDoc(prize, req)
        mPrize.savePrize(prize, function(err, o){
            if (err){
                res.send(500, err);
            } else {
                res.send(200);
            }
        })
    })
}

/*
wxPrize = {
    yyyappId: yyyappId
    name: name
    wxredParam: {
         "send_name" : "天脉聚源",
         "hb_type" : "NORMAL",   //普通红包
         "total_amount" : 100,   //单位分
         "total_num" : 1,
         "wishing" : "恭喜发财",
         "act_name" : "微信10周年",
         "remark" : "微信10周年纪念日"
    }
}
 */
exports.createwxredAndLottery = function(wxPrize, cb){
    wxPrize.wxredParam.total_amount = parseInt(wxPrize.wxredParam.total_amount, 10)
    if (wxPrize.wxredParam.total_amount < 100){
        return cb('err total_amount can not lt 100');
    }

    if (wxPrize.wxredParam.total_amount == 100 * 100){
        mPreRedRedis.pop100(function(err, id){
            if (err){
                exports.createwxredAndLotteryInner(wxPrize, cb)
            } else {
                cb(null, id)
            }
        })
    } else if (wxPrize.wxredParam.total_amount <= 120){
        mPreRedRedis.pop(function(err, id){
            if (err){
                exports.createwxredAndLotteryInner(wxPrize, cb)
            } else {
                cb(null, id)
            }
        })
    } else {
        var tryTime = 0
        var callbackInner = function(err, id){
            if (err){
                console.log('tryTime:' + tryTime)
                if (tryTime > 2){
                    cb(err, id)
                } else {
                    tryTime++
                    console.log('red create fail time:' + tryTime)
                    exports.createwxredAndLotteryInner(wxPrize, callbackInner)
                }
            } else {
                cb(err, id)
            }
        }
        exports.createwxredAndLotteryInner(wxPrize, callbackInner)
    }
}

exports.createwxredAndLotteryInner = function(wxPrize, cb){
    var wxredParam = _.extend({
        "send_name" : "天脉聚源",
        "hb_type" : "NORMAL",
        "total_num" : 1,
        "wishing" : "恭喜发财",
        "act_name" : "恭喜发财",
        "remark" : "恭喜发财"
    }, wxPrize.wxredParam)

    console.time('createwxredAndLottery')

    //return cb(null, "1");
    if (wxredParam.total_amount > 499900){
        wxredParam.total_amount = 499900
    }
    if (wxredParam.total_amount < 100){
        return cb('err total_amount can not lt 100');
    }

    //wxPrize.wxredParam.total_amount = 100

    wxredParam.amt_type = 'ALL_RAND'
    wxredParam.auth_mchid = auth_mchid
    wxredParam.auth_appid = auth_appid
    wxredParam.risk_cntl = "IGN_FREQ_LMT" //'NORMAL'
    wxredParam.mch_id = payConfig.baseConfig.mch_id
    wxredParam.wxappid = payConfig.baseConfig.appid
    wxredParam.nonce_str = payUtils.getNonceStr()
    wxredParam.mch_billno = wxredParam.mch_id + payUtils.getMchBillno()
    delete wxredParam.sign
    wxredParam.sign = payUtils.getSign(wxredParam)

    wxredApi.createWxRed(wxredParam, payConfig.wx_ssl_options, function(err, response){
        if (err){
            wxInfo.pushErrorMsg(err)
            cb(err);
        } else {
            if (response && response.detail_id && response.sp_ticket){
                var lotteryDoc = {
                    total: 1,
                    title: wxPrize.name,
                    desc: wxredParam.act_name,
                    hb_billno: wxredParam.mch_billno,
                    total_amount: wxredParam.total_amount,
                    onoff: 1,
                    begin_time: Math.floor((new Date().getTime() - 150 * 60 * 1000) / 1000),
                    expire_time: Math.floor(new Date().getTime() / 1000) + 365 * 24 * 60 * 60,
                    appid: payConfig.baseConfig.appid,
                    key: payConfig.redkey,
                    type: 1
                }
                mWxredLottery.createWxRedLotteryInner(wxPrize.yyyappId, lotteryDoc, [response.sp_ticket], function(err, redLotteryId){
                    if (err){
                        wxInfo.pushErrorMsg(err)
                        cb(err);
                    } else {
                        console.timeEnd('createwxredAndLottery')
                        cb(null, redLotteryId);
                    }
                })
            } else {
                cb('err');
            }
        }
    })
}

exports.checkExchangeLock = function(req, res, next){
    var openId = req.param('openid')
    queueClient.get('red-pager-' + openId, function(err, value){
        if (err || !value){
            next()
            queueClient.setex('red-pager-' + openId, 60, true);
        } else {
            req.lock = 1
            return next()
        }
    })
}

exports.lock = function(param){
    return function(req, res, next) {
        var lockID = req.param(param)
        if (!lockID){
            return res.send(400);
        }
        var key = 'lock-' + lockID
        req.lockID = key
        queueClient.incr(key, function (err, value) {
            queueClient.EXPIRE(key, 10)
            if (err || !value) {
                req.lock = 1
            } else {
                value = parseInt(value, 10);
                if (value > 1) {
                    req.lock = 1
                }
            }
            return next()
        })
    }
}

exports.delLock = function(lockId){
    queueClient.del(lockId)
}

exports.authSendHongbao = function(req ,res){
    var id = req.param('id')
    var openId = req.openId
    var wxRedLotteryId = req.param('wxRedLotteryId')
    var redirect_url = 'http://' + req.host + '/open/wxred/send?id=' + id + '&wxRedLotteryId=' + wxRedLotteryId + '&yyyopenId=' + openId
    var url = "http://mb.mtq.tvm.cn/oauth?wx_token=35o4zts2mwgdenkvpqrf0u&token=7fda67277f&redirecturl=" + encodeURIComponent(redirect_url);
    console.log(url)
    res.redirect(url)
}

exports.sendRedPager = function(req, res){
    var final = function(state, err){
        queueClient.del('red-pager-' + openId);
        console.log('sendRedPager state:' + state + ',err:' + err)
        return res.redirect('http://a.h5.mtq.tvm.cn/yao/btv7/prompt.html?state=' + state)
    }

    var openId = req.param('openid')
    if (!openId){
        return final(1, 'no wx openId')
    }

    if (req.lock){
        return final(1, 'system error')
    }

    var yyyopenId = req.param('yyyopenId')
    if(!req.order || !req.wxredLottery){
        return final(1, 'order or wxredLottery')
    }

    if(req.order.wxstate == 1){
        return final(2, 'wxstate is 1')
    }

    if (req.order.user.openId != yyyopenId){
        return final(1, 'openId and yyyopenId not match')
    }

    var money = 1;
    if (req.order.money && req.order.money){
        money = req.order.money.money
        var wxRedLotteryId = req.order.money.wxRedLotteryId
    } else if (req.order.prize && req.order.prize){
        money = req.order.prize.money
        var wxRedLotteryId = req.order.prize.wxRedLotteryId
    }
    if (!money){
        money = 1
    }
    if (wxRedLotteryId != req.wxredLottery._id.toString()){
        return final(1, 'wxRedLotteryId not match')
    }

    if (req.wxredLottery.state == 1){
        return final(2, 'wxredLottery state is 1')
    }

    money = parseInt(parseFloat(money) * 100, 10)

    var toSend = function(){
        var param = {
            nonce_str: payUtils.getNonceStr(),
            mch_id: payConfig.baseConfig.mch_id,
            mch_billno: payConfig.baseConfig.mch_id + payUtils.getMchBillno(),
            wxappid: payConfig.baseConfig.appid,
            nick_name: '天脉聚源',
            send_name: '天脉聚源',
            re_openid: openId,
            total_amount: money,
            min_value: money,
            max_value: money,
            total_num: 1,
            client_ip: ut.getLocalIp(),
            act_name: 'BTV生活摇一摇',
            wishing: '恭喜发财',
            remark: '恭喜发财'
            /*share_content: '',
             'share_url': '',
             'share_imgurl': ''*/
        }
        param.sign = payUtils.getSign(param)
        wxredApi.sendRedPack(param, payConfig.wx_ssl_options, function(err){
            if (err){
                return final(1, err)
            } else {
                final(0)
                ordersCollection.updateById(req.order._id, {"$set":{"wxstate":1, way: 1}, $addToSet: {mch_billno: param.mch_billno}}, function(err){})
                wxredlotteryCollection.updateById(req.wxredLottery._id, {"$set":{"state": 1}}, function(err){})
            }
        })
    }

    if (req.wxredLottery.hb_billno){
        var param = {
            mch_billno: req.wxredLottery.hb_billno,
            nonce_str: payUtils.getNonceStr(),
            mch_id: payConfig.baseConfig.mch_id,
            appid: payConfig.baseConfig.appid,
            bill_type: "MCHT"
        }
        param.sign = payUtils.getSign(param)
        wxredApi.getWxRedInfo(param, payConfig.wx_ssl_options, function(err, response){
            if (err){
                return final(1, 'err')
            }
            if (response && response.status == 'RECEIVED'){
                return final(2, 'has received')
            }
            toSend()
        })
    } else {
        toSend()
    }
}

var yyyappId = 'wx33dc1a5264b4e846'
if (config.NODE_ENV == 'dev'){
    yyyappId = 'wxddd09c59c4c73c99'
} else if (config.NODE_ENV == 'qa') {
    yyyappId = 'wx44490bbc768ce355'
}

/*else if (config.NODE_ENV == 'qq_new') {
    yyyappId = 'wx6fc288e6ddd63347'
}*/

exports.createRed = function(req, res){
    var body = req.body
    body.total_amount = ut.checkPositiveInt(body.total_amount)
    if (body.total_amount == null){
        return res.send(400, 'total_amount error')
    }
     var wxPrize = {
         yyyappId: yyyappId,
         name: '天脉聚源',
         wxredParam: {
             "send_name" : body.send_name || "天脉聚源",
             "hb_type" : "NORMAL",
             "total_amount" : body.total_amount,
             "total_num" : 1,
             "wishing" : "恭喜发财",
             "act_name" : "恭喜发财",
             "remark" : "恭喜发财"
        }
     }
    exports.createwxredAndLottery(wxPrize, function(err, id){
        if (err){
            res.send(500, err)
        } else {
            if (!id){
                res.send(500, 'no wxredLotteryId')
            } else {
                res.send(200, {wxredLotteryId: id})
            }
        }
    })
}

exports.sendRedBy3rd = function(req, res){
    var final = function(state, err){
        exports.delLock(req.lockID)
        res.send(200, {state: state, err: err})
    }

    var openId = req.param('openId')
    if (!openId){
        return final(1, 'no wx openId')
    }

    if (req.lock){
        return final(1, 'system error')
    }

    if (!req.wxredLottery){
        return final(1, 'wxredLotteryId error, not found!')
    }

    if (req.wxredLottery.state == 1){
        return final(2, 'wxredLottery state is 1')
    }

    var money = 100
    if (req.wxredLottery.total_amount){
        money = req.wxredLottery.total_amount
    }

    var toSend = function(){
        var param = {
            nonce_str: payUtils.getNonceStr(),
            mch_id: payConfig.baseConfig.mch_id,
            mch_billno: payConfig.baseConfig.mch_id + payUtils.getMchBillno(),
            wxappid: payConfig.baseConfig.appid,
            nick_name: '天脉聚源',
            send_name: '天脉聚源',
            re_openid: openId,
            total_amount: money,
            min_value: money,
            max_value: money,
            total_num: 1,
            client_ip: ut.getLocalIp(),
            act_name: 'BTV生活摇一摇',
            wishing: '恭喜发财',
            remark: '恭喜发财'
            /*share_content: '',
             'share_url': '',
             'share_imgurl': ''*/
        }
        param.sign = payUtils.getSign(param)
        wxredApi.sendRedPack(param, payConfig.wx_ssl_options, function(err){
            if (err){
                return final(1, err)
            } else {
                final(0)
                wxredlotteryCollection.updateById(req.wxredLottery._id, {"$set":{"state": 1, way: 'mp'}, $addToSet: {mch_billno: param.mch_billno}}, function(err){})
            }
        })
    }

    if (req.wxredLottery.hb_billno){
        var param = {
            mch_billno: req.wxredLottery.hb_billno,
            nonce_str: payUtils.getNonceStr(),
            mch_id: payConfig.baseConfig.mch_id,
            appid: payConfig.baseConfig.appid,
            bill_type: "MCHT"
        }
        param.sign = payUtils.getSign(param)
        wxredApi.getWxRedInfo(param, payConfig.wx_ssl_options, function(err, response){
            if (err){
                return final(1, 'err')
            }
            if (response && response.status == 'RECEIVED'){
                wxredlotteryCollection.updateById(req.wxredLottery._id, {"$set":{"state": 1, way: 'yao'}}, function(err){})
                return final(2, 'user has received')
            }
            toSend()
        })
    } else {
        toSend()
    }
}

exports.getWxRedState = function(req, res){
    var final = function(state, way){
        res.send(200, {state: state, total_mount: req.wxredLottery.total_mount, way: way || req.wxredLottery.way})
    }

    if (req.wxredLottery.state == 1){
        return final(1)
    }

    if (!req.wxredLottery.hb_billno){
        return final(1)
    }

    var param = {
        mch_billno: req.wxredLottery.hb_billno,
        nonce_str: payUtils.getNonceStr(),
        mch_id: payConfig.baseConfig.mch_id,
        appid: payConfig.baseConfig.appid,
        bill_type: "MCHT"
    }
    param.sign = payUtils.getSign(param)
    wxredApi.getWxRedInfo(param, payConfig.wx_ssl_options, function(err, response){
        if(err){
            return res.send(500, err)
        }
        if (response && response.status == 'RECEIVED'){
            wxredlotteryCollection.updateById(req.wxredLottery._id, {"$set":{"state": 1, way: 'yao'}}, function(err){})
            return final(1, 'yao')
        } else {
            return final(0)
        }
    })
}


/*var param = {
    mch_billno: '1227555302201507222324629482',
    nonce_str: payUtils.getNonceStr(),
    mch_id: payConfig.baseConfig.mch_id,
    appid: payConfig.baseConfig.appid,
    bill_type: "MCHT"
}
param.sign = payUtils.getSign(param)
wxredApi.getWxRedInfo(param, payConfig.wx_ssl_options, function(err, response){
    if (response && response.status == 'RECEIVED'){

    }
})*/
