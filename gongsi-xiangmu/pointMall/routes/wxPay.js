/**
 * Created by chenjie on 2014/12/2.
 */

var fs = require('fs');
var path = require('path');
var async = require('async')
var config = require('../config');
var _ = require('underscore')
var MD5 = require("crypto-js/md5");
var SHA1 = require("crypto-js/sha1");
var request = require('superagent');
var wxInfo = require('./wxInfo');
var mOpUser = require('./opUser')
var mLottery = require('./lottery');
var moment = require('moment')
var mGoods = require('../models/goods');
var models      = require('../models/index');
var Store     = models.Store;
var Goods     = models.Goods;
var WxOrder     = models.WxOrder;
var Lottery     = models.Lottery;
var RedPagerRecord = models.RedPagerRecord;
var IntegralLog = models.IntegralLog;
var Users    = models.Users;
var mIntegral = require('../interface/integral.js');

var xml2js = require('xml2js');
var ut = require('./utils')
var mUser = require('./user')

var tkConfig = require('../tokenConfig');
var config = require('../config');

var notify_url =  config.domain + config.path + '/wxpay/result';
var cjtdpayKey = 'dcd7c26bd69e8b16ebd64bdf201da09d';
var cjtdBaseConfig = {
    appid: 'wxfb80ea25b8a85a64',
    mch_id: '1218442201',
    trade_type: "JSAPI"
}

var wdspayKey = 'dcd7c26bd69e8b16ebd64bdf201da09d';
var wdsdBaseConfig = {
    appid: 'wx0eefb7bdf35016a5',
    mch_id: '10028204',
    trade_type: "JSAPI"
}

exports.payToken = ['f58a6e8834f3', 'ceca73efe351', '8b7ef31db230', '13992b27e90a', '70c69789da7c', 'fc640ef602a9','61510b00acd4']

var payConfig = {
    "DEFAULT_MALL": {
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da09d',
        baseConfig: {
            appid: 'wx332b3675959184ee',
            mch_id: '1227555302',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc') + '/pay-cert.pem')
        }
    },
    '8b7ef31db230': {
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da09d',
        baseConfig: {
            appid: 'wxe77a1f126d505d33',
            mch_id: '1239118602',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', '8b7ef31db230') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', '8b7ef31db230') + '/pay-cert.pem')
        }
    },
    'ceca73efe351': {
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da09d',
        baseConfig: {
            appid: 'wx15670746b7a7cd98',
            mch_id: '1241838602',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', 'ceca73efe351') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', 'ceca73efe351') + '/pay-cert.pem')
        }
    },
    'f58a6e8834f3': {
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da09d',
        baseConfig: {
            appid: 'wx39780a946f4dfbcc',
            mch_id: '1245200002',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', 'f58a6e8834f3') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', 'f58a6e8834f3') + '/pay-cert.pem')
        }
    },
    '13992b27e90a': {
        payKey: 'dcd7c26bd69e8b16ebd64bdf201da09d',
        baseConfig: {
            appid: 'wx5be9593d2a32bfde',
            mch_id: '10152686',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', '13992b27e90a') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', '13992b27e90a') + '/pay-cert.pem')
        }
    },
    '70c69789da7c': {
        payKey: 'bisianyuejingjingandiroushu99999',
        baseConfig: {
            appid: 'wx1692c11d80af07e4',
            mch_id: '1250679901',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', '70c69789da7c') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', '70c69789da7c') + '/pay-cert.pem')
        }
    },
    'fc640ef602a9': {
        payKey: 'qwertyuioplkjhgfdsazxcvbnmqwerty',
        baseConfig: {
            appid: 'wx6d145e440ac573b1',
            mch_id: '1244943702',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', 'fc640ef602a9') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', 'fc640ef602a9') + '/pay-cert.pem')
        }
    },
    '61510b00acd4': {
        payKey: 'a1b2c3d4e5f6g7h8j9k10l11m12n13o1',
        baseConfig: {
            appid: 'wxce07d49b1db2d775',
            mch_id: '1239813902',
            trade_type: "JSAPI"
        },
        wx_ssl_options: {
            key: fs.readFileSync(path.join(__dirname, '..', 'etc', '61510b00acd4') + '/pay-key.pem'),
            cert: fs.readFileSync(path.join(__dirname, '..', 'etc', '61510b00acd4') + '/pay-cert.pem')
        }
    }
}

function getPayKey(token){
    if (payConfig[token]){
        return payConfig[token].payKey
    } else {
        return payConfig.DEFAULT_MALL.payKey
    }
}

function getBaseConfig(token){
    if (payConfig[token]){
        return payConfig[token].baseConfig
    } else {
        return payConfig.DEFAULT_MALL.baseConfig
    }
}

function getWxSsl(token){
    if (payConfig[token]){
        return payConfig[token].wx_ssl_options
    } else {
        return payConfig.DEFAULT_MALL.wx_ssl_options
    }
}

function getNonceStr(){
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = $chars.length;
    var noceStr = "";
    for (var i = 0; i < 32; i++) {
        noceStr += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
}

function getANumber(){
    var $chars = '0123456789';
    var random = moment(new Date()).format('YYYYMMDDHHmmssSSS');
    for (var i = 0; i < 2; i++) {
        random += $chars.charAt(Math.floor(Math.random() * $chars.length));
    }
    return random;
}

function getMchBillno(){
    var $chars = '0123456789';
    var random = moment(new Date()).format('YYYYMMDDHHmmssSSS');
    for (var i = 0; i < 1; i++) {
        random += $chars.charAt(Math.floor(Math.random() * $chars.length));
    }
    return random;
}

function getSign(param, token){
    var paramArr = _.keys(param);
    paramArr.sort();
    var stringArr  = []
    _.each(paramArr, function(key){
        stringArr.push(key + '=' + param[key]);
    })
    stringArr.push("key=" + getPayKey(token))
    var string =  stringArr.join('&');
    return MD5(string).toString().toUpperCase();
}

exports.goPay = function(req, res){
    var count = parseInt(req.body.count, 10);
    if (!count || count < 1){
        return res.send({status: -2})
    }

    var redPagerRecordIds = req.body.redPagerRecordIds
    if (!redPagerRecordIds && !_.isArray(redPagerRecordIds)){
        redPagerRecordIds = []
    }

    var ext = req.session.payExt?req.session.payExt:{}

    var addressId = req.body.addressId
    var mobile = req.body.mobile
    var name = req.body.name
    var email = req.body.email
    var orderInfo = req.body.orderInfo
    var day = ''
    var goodsPrice = ''
    req.session.vipSku = req.session.vipSku?req.session.vipSku:null
    if (req.session.vipSku){
        day = req.session.vipSku.day
        goodsPrice = req.session.vipSku.price
    }
    console.log('count:' + count)
    console.log('goodsPrice:' + goodsPrice)

    var pointLimit = req.body.pointLimit
    if (pointLimit && ((pointLimit = ut.checkPositiveInt(pointLimit)) == null || pointLimit < 0)){
        return res.send(400, 'pointLimit error, ' + pointLimit)
    }

    var pointPrice = 0
    if (pointLimit > 0){
        pointPrice = Math.floor(pointLimit / 1000 * 100) / 100
    }

    var goods = req.goods
    if (goods.ext.playType != 2 && goods.ext.playType != 6){
        return res.send({status: -2})
    }

    if (goods.deleted){
        return res.send(404, '商品已经删除！')
    }

    if (!req.session.tvmMallOpenId){
        return res.send(400, 'tvmMallOpenId is not exists!');
    }

    if (goods.ext.state != mGoods.state.up){
        goods.count = 0
    }

    if (goods.ext.startTime && goods.ext.endTime){
        var now = new Date().getTime()
        if (now < goods.ext.startTime.getTime() || now > goods.ext.endTime.getTime()){
            return res.send({status: -2})
        }
    }

    if (goods.count <= 0 || count > goods.count){
        return res.send({status: -2})
    }

    if (goods.type == mGoods.type.goods){
        if (!addressId){
            return res.send(400, '没有填写地址')
        }
    } else if(goods.type == mGoods.type.salon){
        if (!orderInfo || !orderInfo.name || !orderInfo.mobile || !orderInfo.title || !orderInfo.company){
            return res.send(400, '没有填写沙龙信息')
        }
    } else if (!mobile && !(goods.type == 1 && (goods.token == 'ceca73efe351')) && !((goods.token == 'f83eb271689a' || goods.token == 'tvmty') && (goods.type == 103 || goods.type == 104 || goods.type == 105))){
        return res.send(400, '没有填写手机号')
    }

    var preOrder = function(out_trade_no, price){
        var param = {
            out_trade_no: out_trade_no,
            nonce_str : getNonceStr(),
            spbill_create_ip: req.localIp,
            body : goods.name,
            total_fee: Math.ceil(price * 100),
            notify_url: notify_url,
            openid: req.session.tvmMallOpenId
        }
        param = _.extend(param, getBaseConfig(req.token))
        param.sign = getSign(param, req.token)

        var url = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
        wxInfo.postWxHttp(url, param, function(err, response){
            if (err){
                res.send(500, err)
            } else if (response){
                console.log(response);
                if (response.return_code == 'FAIL'){
                    res.send(500, response.return_msg);
                } else {
                    var payParam = {
                        appId: response.appid,
                        timeStamp: "" + Math.ceil(new Date().getTime() / 1000),
                        nonceStr: response.nonce_str,
                        signType: "MD5",
                        package: 'prepay_id=' + response.prepay_id
                    }
                    payParam.paySign = getSign(payParam, req.token);
                    var data = {
                        payParam: payParam,
                        out_trade_no: param.out_trade_no
                    }
                    console.log(payParam)
                    res.send(data);
                    mLottery.updateGoodsCount(goods._id, null, count);
                }
            } else {
                res.send(500, 'no response')
            }
        });
    }

    var ensureSave = function(redPagerPrice, cb){
        var mallToken = config.tvmMallToken
        if (_.contains(exports.payToken, req.token)){
            mallToken = req.token
        }
        var order = {
            token: req.token,
            openId: req.session.openId,
            mallOpenId: req.session.tvmMallOpenId,
            mallToken: mallToken,
            goodsId: goods._id.toString(),
            price: goods.price,
            redPagerRecordIds: redPagerRecordIds,
            score: pointLimit,
            ext: ext,
            count: count
        }
        var mallCard = req.mallCard
        if (req.mallCard){
            order.mallCard = {id: mallCard._id.toString(), discount: mallCard.discount, name: mallCard.name}
        }

        if (day){
            order.day = day
        }

        if (name){
            order.name = name
        }
        if (email){
            order.email = email
        }
        if (addressId){
            order.addressId = addressId
        }
        if (mobile){
            order.mobile = mobile
        }
        if (orderInfo){
            order.orderInfo = orderInfo
        }

        if (mobile){
            var UPDATE_USER_SPEC = {
                $set: {mobile: mobile}
            }
            if (name){
                UPDATE_USER_SPEC.$set.name = name;
            }
            if (email){
                UPDATE_USER_SPEC.$set.email = email;
            }
            mUser.updateUser(req.token + '_' + req.openId, UPDATE_USER_SPEC, function(err, o){})
        }

        var doSave = function(time){
            order.out_trade_no = getANumber()
            saveOrder(order, function(err, o) {
                if (err){
                    if (time >= 3){
                        cb(err);
                    } else {
                        setTimeout(function(){
                            doSave(++time);
                        }, 10)
                    }
                } else {
                    cb(null, o)
                }
            })
        }
        doSave(1);
    }

    var saveWxOrder = function(){
        exports.calculateRedPagerPrice(redPagerRecordIds, function(redPagerPrice){
            ensureSave(redPagerPrice, function(err, o){
                if (err){
                    return res.send(500, '请求繁忙，请稍后再试');
                } else {
                    var discount = 1
                    if (req.mallCard){
                        discount = req.mallCard.discount
                    }
                    var price = (goodsPrice?goodsPrice:goods.price * discount) + (goodsPrice?goodsPrice:goods.price) * (count - 1) - redPagerPrice - pointPrice
                    price = Math.floor(price * 1000) / 1000
                    console.log('price:' + price)
                    if (price > 0){
                        preOrder(o.out_trade_no, price);
                    } else {
                        var data = {
                            status: 0
                        }
                        res.send(data);
                        mLottery.saveLotteryFromWxOrder(o);
                        exports.updateWxorderState(o, 'complete')
                        exports.updateRedPagerRecordState(redPagerRecordIds, 1);
                        exports.updateUserPoint(o, pointLimit);
                        mLottery.updateGoodsCount(o.goodsId, null, o.count);
                    }
                }
            })
        })
    }

    saveWxOrder()
}


exports.calculateRedPagerPrice = function(redPagerRecordIds, cb){
    if (!redPagerRecordIds || redPagerRecordIds.length <= 0){
        return cb(0);
    }
    RedPagerRecord.find({_id: {$in: redPagerRecordIds}}, {redPagerId: 1}, function(err, docs){
        if (err){
            cb(0);
        } else {
            var goodsId = _.pluck(docs, 'redPagerId');
            Goods.find({_id: {$in: goodsId}}, {price: 1}, function(err, data){
                if (err){
                    cb(0)
                } else {
                    var price = 0;
                    var goodsMap = {}
                    _.each(data, function(o){
                        goodsMap[o._id.toString()] = o
                    })
                    _.each(goodsId, function(id){
                        price += goodsMap[id].price;
                    })
                    cb(price);
                }
            })
        }
    })
}

exports.payResult = function(req, res){
    console.log('payResult')
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        buf += chunk;
    });
    req.on('end', function() {
        xml2js.parseString(buf, {explicitArray: false, trim: true, explicitRoot: false}, function(err, json) {
            if (err) {
                return final('parse response error');
            } else {
                console.log(json)
                req.body = json;
            }
            if(req.body){
                checkOldState()
            }else{
                return final('no response');
            }
        });
    });

    var final = function(err){
        console.log('notice result: ' + err)
        if (err){
            res.send(ut.jsonToXml({return_code: "FAIL", return_msg: err}));
        } else {
            res.send(ut.jsonToXml({return_code: "SUCCESS"}));
        }
    }

    var updateWxOrder = function(){
        var out_trade_no = req.body.out_trade_no
        if (req.body.result_code == "SUCCESS" && req.body.return_code == 'SUCCESS'){
            req.body.trade_state = 'SUCCESS';
        }
        WxOrder.findOneAndUpdate({out_trade_no: out_trade_no}, {$set: {payResult: req.body}}, function(err, o){
            if (err){
                final('server error')
            } else if (!o){
                final('out_trade_no not exists!');
            } else {
                final()
                if (req.body.trade_state == 'SUCCESS'){
                    mLottery.saveLotteryFromWxOrder(o)
                    exports.updateWxorderState(o, 'complete')
                    exports.updateRedPagerRecordState(o.redPagerRecordIds, 1);
                    exports.updateUserPoint(o, o.score);
                    exports.sendTemplateMessage(o);
                }
            }
        })
    }

    var checkOldState = function(){
        if (req.body.out_trade_no){
            WxOrder.findOne({out_trade_no: req.body.out_trade_no}, function(err, o){
                if (err){
                    final('check old server error')
                } else if (!o){
                    final('check old out_trade_no not exists!');
                } else {
                    if (!o.payResult){
                        checkPayResult()
                    } else {
                        console.log('has noticed')
                        final()
                    }
                }
            })
        } else {
            final('out_trade_no param not exist!');
        }
    }

    var checkPayResult = function(){
        if (req.body.return_code == 'FAIL' || req.body.result_code == 'FAIL'){
            updateWxOrder()
        } else {
            /*if (req.body.appid != baseConfig.appid || req.body.mch_id != baseConfig.mch_id){
                return final('参数错误')
            }*/

            var params = _.extend({}, req.body)
            delete params.sign
            /*if (getSign(params, req.token) != req.body.sign){
                return final('sign error')
            }*/
            updateWxOrder()
        }
    }
}

function wxOrderQuery(out_trade_no, token, cb){
    var param = {
        out_trade_no: out_trade_no,
        nonce_str : getNonceStr()
    }
    param = _.extend(param, getBaseConfig(token));
    delete param.trade_type
    param.sign = getSign(param, token)
    var url = "https://api.mch.weixin.qq.com/pay/orderquery"
    wxInfo.postWxHttp(url, param, function(err, response) {
        if (err) {
            cb(err);
        } else if (response) {
            console.log(response);
            if (response.return_code == 'FAIL') {
                cb(response.return_msg)
            } else {
                cb(null, response)
            }
        }
    });
}

exports.startRefund = function(orderIds, cb){
    var findOrders = function(){
        Lottery.find({_id: {$in: orderIds}}, {out_trade_no: 1}, function(err, orders){
            if (err){
                cb(err)
            } else {
                findWxOrders(orders)
            }
        })
    }

    var findWxOrders = function(orders){
        var out_trade_nos = _.pluck(orders, 'out_trade_no')
        var condition = {out_trade_no: {$in: out_trade_nos}}
        WxOrder.find(condition, function(err, docs){
            if (err){
                cb(err)
            } else {
                doRefund(docs)
            }
        })
    }

    var doRefund = function(wxOrders){
        async.eachSeries(wxOrders, function(o, callback){
            exports.doRefundState(o, callback);
        }, function(err){
            cb(err);
        })
    }
    findOrders()
}

exports.doRefundState = function(o, callback){
    var refundFee = function(){
        if (o.payResult && o.payResult.trade_state == 'SUCCESS'){
            exports.doWxRefund(o.token, o.out_trade_no, o.payResult.total_fee, function(err, response){
                console.log('doWxRefund:' + err)
                if (err){
                    final(err);
                } else {
                    reFundScore()
                    WxOrder.findOneAndUpdate({out_trade_no: o.out_trade_no}, {$set: {reFundResult: response}}, function(err, o){
                        if (err){
                            console.log('update refund result fail!')
                        }
                    })
                }
            })
        } else {
            reFundScore()
        }
    }

    var reFundScore = function(){
        if (o.score > 0){
            exports.updateUserPoint(o, -o.score)
        }
        reFundRed()
    }

    var reFundRed = function(){
        if (o.redPagerRecordIds.length > 0){
            exports.updateRedPagerRecordState(o.redPagerRecordIds, 0)
        }
        final(null)
    }

    var final = function(err){
        if (err){
            console.log('err:' + err)
            callback(err)
        } else {
            console.log('no err')
            exports.updateOrderState(o, 'refund')
            mLottery.updateGoodsCount(o.goodsId, null, -(o.count?o.count:1))
            callback()
        }
    }
    if (o.state != 'refund'){
        refundFee()
    } else {
        callback()
    }
}

exports.updateOrderState = function(wxOrder, state){
    WxOrder.update({_id: wxOrder._id}, {$set: {state: state}}, function(err){
        if (err){
            console.log('updateOrderState err:' + err)
        }
        Lottery.findOne({token: wxOrder.token, prizeId: wxOrder.goodsId, out_trade_no: wxOrder.out_trade_no}, {_id: 1}, function(err, o){
            Lottery.findByIdAndUpdate(o._id, {$set: {state: state}}, function(err){
                if (err){
                    console.log('update lottery State err:' + err)
                }
                if (state == 'refund'){
                    mLottery.refundGoods(wxOrder)
                }
            });
        })
    })
}

exports.doWxRefund = function(token, out_trade_no, total_fee, cb){
    var param = {
        nonce_str: getNonceStr(),
        op_user_id: getBaseConfig(token).mch_id,
        refund_fee: total_fee,
        total_fee: total_fee,
        out_refund_no: out_trade_no,
        out_trade_no: out_trade_no
    }
    param = _.extend(param, getBaseConfig(token));
    delete param.trade_type
    param.sign = getSign(param, token)
    var url = "https://api.mch.weixin.qq.com/secapi/pay/refund"
    wxInfo.postWxHttps(url, getWxSsl(token), param, function(err, response) {
        if (err) {
            cb(err);
        } else if (response) {
            console.log(response);
            if (response.return_code == 'FAIL') {
                cb('return_code fail: ' + response.return_msg)
            } else if (response.result_code == 'FAIL'){
                cb('err_code:' + response.err_code + ', err_msg:' + response.err_code_des)
            } else {
                cb(null, response)
            }
        } else {
            cb('unknow error')
        }
    });
}

exports.cancelPay = function(req, res){
    var out_trade_no = req.param('out_trade_no');
    if (!out_trade_no){
        return res.send(400, 'out_trade_no参数错误')
    }
    WxOrder.findOne({out_trade_no: out_trade_no}, function(err, o){
        if (err){
            res.send(500, err)
        } else if (!o){
            res.send(404, 'wxorder not exist')
        } else {
            if (o.state == 'new' && (!o.payResult || o.payResult.trade_state != 'SUCCESS')){
                mLottery.updateGoodsCount(o.goodsId, null, -(o.count?o.count:1))
                exports.updateWxorderState(o, 'close')
            }
            res.send(200)
        }
    })
}

exports.orderState = function(req, res){
    var out_trade_no = req.param('out_trade_no');
    if (!out_trade_no){
        return res.send(400, 'out_trade_no参数错误')
    }
    var findLocalWxOrder = function(){
        WxOrder.findOne({out_trade_no: out_trade_no}, function(err, o){
            if (err){
                res.send(500, err)
            } else if (!o){
                res.send(404, 'wxorder not exist')
            } else {
                if (!o.payResult){
                    queryWxOrder()
                } else {
                    if (o.payResult.trade_state != 'SUCCESS'){
                        res.send({code: -1})
                    } else {
                        res.send({code: 0})
                    }
                }
            }
        })
    }

    var queryWxOrder = function(){
        wxOrderQuery(out_trade_no, req.token, function(err, response){
            if (err){
                res.send(500, err);
            } else {
                if (response.trade_state != 'SUCCESS'){
                    res.send({code: -1})
                } else {
                    res.send({code: 0})
                }
            }
        })
    }
    findLocalWxOrder()
}

function saveOrder(doc, cb){
    new WxOrder(doc).save(function(err, o){
        cb(err, o);
    })
}

exports.addressParam = function(req, res){
    var url = req.param('url');
    var accessToken = req.param('accessToken');
    console.log(url)
    if (!url){
        return res.send(400, 'url参数不存在')
    }
    console.log(accessToken)
    if (!accessToken){
        return res.send(400, 'accessToken参数不存在')
    }
    var param = {
        appId: baseConfig.appid,
        scope: 'jsapi_address',
        signType : "sha1",
        addrSign : "",
        timeStamp: "" + Math.ceil(new Date().getTime() / 1000),
        nonceStr: getNonceStr()
    }

    var signParam = {
        accesstoken: accessToken,
        appid: baseConfig.appid,
        noncestr: param.nonceStr,
        timestamp: param.timeStamp,
        url: url
    }
    var paramArr = _.keys(signParam);
    paramArr.sort();
    var stringArr  = []
    _.each(paramArr, function(key){
        stringArr.push(key + '=' + signParam[key]);
    })
    var string = stringArr.join('&');
    console.log(string)
    param.addrSign = SHA1(string).toString()

    console.log(param)
    return res.send(param);
}

exports.updateUserPoint = function(wxOrder, score){
    if (score == 0){
        return;
    }
    mIntegral.changeIntegral(wxOrder.token, wxOrder.openId, -score, (score > 0?'购物':'退款'))
}

exports.updateRedPagerRecordState = function(redPagerRecordIds, state){
    if (!redPagerRecordIds || redPagerRecordIds.length <= 0){
        return;
    }
    var condition = {
        _id: {$in: redPagerRecordIds}
    }
    RedPagerRecord.update(condition, {$set: {state: state}}, {multi: true}, function(err){
        if (err){
            console.log(err)
        } else {
            console.log('updateRedPagerRecordState success')
        }
    })
}

exports.warning = function(req, res){
    console.log('wxpay warning')
    console.log(req.body);
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        buf += chunk;
    });
    req.on('end', function() {
        xml2js.parseString(buf, {explicitArray: false, trim: true, explicitRoot: false}, function(err, json) {
            if (err) {
                console.log(err)
            } else {
                console.log(json)
                req.body = json;
            }
        });
    });
    res.send(200)
}

exports.sendRedPack = function(act_name, nick_name, send_name, wishing, remark, openId, money, cb){
    money = Math.ceil(money * 100)
    var param = {
        nonce_str: getNonceStr(),
        mch_billno: getBaseConfig('no').mch_id + getMchBillno(),
        mch_id: getBaseConfig('no').mch_id,
        wxappid: getBaseConfig('no').appid,
        nick_name: nick_name,
        send_name: send_name,
        re_openid: openId,
        total_amount: money,
        min_value: money,
        max_value: money,
        total_num: 1,
        client_ip: ut.getLocalIp(),
        act_name: act_name.substring(0, 8),
        wishing: wishing,
        remark: remark
        /*share_content: '',
        'share_url': '',
        'share_imgurl': ''*/
    }
    param.sign = getSign(param)

    var url = 'https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack'
    wxInfo.postWxHttps(url, getWxSsl('no'), param, function(err, response) {
        if (err) {
            cb(err);
        } else if (response) {
            console.log(response);
            if (response.return_code == 'FAIL') {
                cb('return_code fail: ' + response.return_msg)
            } else if (response.result_code == 'FAIL'){
                cb('err_code:' + response.err_code + ', err_msg:' + response.err_code_des)
            } else {
                cb(null, response)
            }
        } else {
            cb('unknow error')
        }
    });
}

exports.sendTemplateMessage = function(wxOrder){
    Goods.findById(wxOrder.goodsId, function(err, o){
        if (o) {
            wxInfo.getwxAccessToken(function(err, response){
                console.log(response)
                if (response && response.accestoken){
                    mOpUser.findOpUser({token: wxOrder.token}, function(err, opUser){
                        if (err){
                            send(o.name, response.accestoken, '')
                        } else {
                            if (opUser){
                                send(o.name, response.accestoken, opUser.wxName)
                            } else{
                                send(o.name, response.accestoken, '')
                            }
                        }
                    })
                }
            })
        }
    })

    var send = function(name, accestoken, wxName){
        var token = wxOrder.token
        var url = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=' + accestoken;
        var data = {
            touser: wxOrder.mallOpenId,
            template_id: '5Kkzkv9uDzmlIzeKzyeAj-EAn06ZTernwZ8c26bxJDI',
            url: tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(config.domain + '/pointMall/auth/me/order/list?wx_token=' + token),
            topcolor: "#FF0000",
            data: {
                first: {
                    value: "您好，欢迎使用" + (wxName?wxName:"天脉商城") + "购物。",
                    color: "#173177"
                },
                product: {
                    value: name,
                    color: "#173177"
                },
                price: {
                    value: Math.floor(wxOrder.price * wxOrder.count * 1000) / 1000 + '元',
                    color: "#173177"
                },
                time: {
                    value: moment(new Date()).format('YYYY/MM/DD HH:mm'),
                    color: "#173177"
                },
                remark: {
                    value: "祝您生活愉快！",
                    color: "#173177"
                }
            }
        }

        setTimeout(function(){
            wxInfo.postwxTemplate(url, data, function(err, response) {

            });
        }, 8000)

    }
}

exports.closeOrder = function(wxOrder, cb){
    var param = {
        out_trade_no: wxOrder.out_trade_no,
        nonce_str : getNonceStr()
    }
    param = _.extend(param, getBaseConfig(wxOrder.token));
    delete param.trade_type
    param.sign = getSign(param, wxOrder.token)
    var url = 'https://api.mch.weixin.qq.com/pay/closeorder'
    wxInfo.postWxHttp(url, param, function(err, response) {
        if (err) {
            cb(err);
        } else if (response) {
            console.log(response);
            if (response.return_code == 'FAIL') {
                cb(response.return_msg)
            } else if (response.result_code == 'FAIL'){
                cb('err: ' + response.err_code_des)
            } else {
                cb(null, response)
                mLottery.updateGoodsCount(wxOrder.goodsId, null, -wxOrder.count);
                exports.updateWxorderState(wxOrder, 'close')
            }
        }
    });
}

exports.updateWxorderState = function(wxOrder, state){
    WxOrder.findOneAndUpdate({out_trade_no: wxOrder.out_trade_no}, {$set: {state: state}}, function(err, o){

    });
}