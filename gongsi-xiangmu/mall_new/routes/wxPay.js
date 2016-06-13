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
var wxInfo = require('./../interface/wxInfo');
var mWxPay = require('./../interface/wxPay.js');
var mOpUser = require('./opUser')
var mLottery = require('./lottery');
var mUser = require('./user.js');
var moment = require('moment')
var typeConfig = require('./typeConfig.js');
var dbUtils = require('../mongoSkin/mongoUtils.js');
var goodsCollection = new dbUtils('goods');
var wxorderCollection = new dbUtils('wxorders');
var lotterieCollection = new dbUtils('lotteries');
var redpagerrecordCollection = new dbUtils('redpagerrecords');

var xml2js = require('xml2js');
var ut = require('./utils')
var mIntegral = require('../interface/integral.js');

var tkConfig = require('../tokenConfig');
var config = require('../config');
var payConfig = require('../etc/payConfig.js');
var payUtils = require('./pay-utils.js');
var mgoods = require("./goods.js");
var dailyRecord = require("./dailyRecord.js");

var notify_url =  config.domain + config.path + '/wxpay/result';

exports.goPay = function(req, res){
    var count = parseInt(req.body.count, 10);

    var redPagerRecordIds = req.body.redPagerRecordIds
    if (!redPagerRecordIds && !_.isArray(redPagerRecordIds)){
        redPagerRecordIds = []
    }

    var ext = req.session.payExt?req.session.payExt:{}

    var day = ''
    var goodsPrice = ''
    req.session.vipSku = req.session.vipSku?req.session.vipSku:null
    if (req.session.vipSku){
        day = req.session.vipSku.day
        goodsPrice = req.session.vipSku.price
    }

    var addressId = req.body.addressId
    var mobile = req.body.mobile
    var name = req.body.name
    var email = req.body.email
    var orderInfo = req.body.orderInfo

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

    if (goods.ext.state != typeConfig.goods.state.up){
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

    if (goods.type == typeConfig.goods.type.goods && !addressId){
        return res.send(400, '没有填写地址')
    }

    if ((goods.type == typeConfig.goods.type.chargeCard || goods.type == typeConfig.goods.type.shoppingCard) && !mobile){
        return res.send(400, '没有填写手机号')
    }

    if (goods.type == typeConfig.goods.type.salon && (!orderInfo || !orderInfo.name || !orderInfo.mobile || !orderInfo.title || !orderInfo.company)){
        return res.send(400, '没有填写沙龙信息')
    }

    var preOrder = function(out_trade_no, price){
        var param = {
            out_trade_no: out_trade_no,
            nonce_str : payUtils.getNonceStr(),
            spbill_create_ip: req.localIp,
            body : goods.name,
            total_fee: Math.ceil(price * 100),
            notify_url: notify_url,
            openid: req.session.tvmMallOpenId
        }
        param = _.extend(param, payConfig.getBaseConfig(goods.token))
        param.sign = payUtils.getPaySign(param, payConfig.getPayKey(goods.token))

        mWxPay.generateOrder(param, function(err, response){
            if (err){
                res.send(500, err)
            } else if (response){
                var payParam = {
                    appId: response.appid,
                    timeStamp: "" + Math.ceil(new Date().getTime() / 1000),
                    nonceStr: response.nonce_str,
                    signType: "MD5",
                    package: 'prepay_id=' + response.prepay_id
                }
                payParam.paySign = payUtils.getPaySign(payParam, payConfig.getPayKey(goods.token));
                var data = {
                    payParam: payParam,
                    out_trade_no: param.out_trade_no
                }
                console.log(payParam)
                res.send(data);
                mLottery.updateGoodsCount(goods._id, count);
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
            tvmId: goods.tvmId,
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

        if (name){
            order.name = name
        }
        if (email){
            order.email = email
        }
        if (day){
            order.day = day
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
            order.out_trade_no = payUtils.getOutTradeNo()
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
                    var price = (goodsPrice?goodsPrice:goods.price) * count- redPagerPrice - pointPrice
                    price = Math.floor(price * 1000) / 1000
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
                        mLottery.updateGoodsCount(o.goodsId, o.count);
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
    redpagerrecordCollection.find({_id: {$in: redPagerRecordIds}}, {redPagerId: 1}, function(err, docs){
        if (err){
            cb(0);
        } else {
            var goodsId = _.pluck(docs, 'redPagerId');
            goodsCollection.find({_id: {$in: goodsId}}, {price: 1}, function(err, data){
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

    var updateWxOrder = function(wxorder){
        var out_trade_no = req.body.out_trade_no
        if (req.body.result_code == "SUCCESS" || req.body.return_code == 'SUCCESS'){
            req.body.trade_state = 'SUCCESS';
        }
        wxorderCollection.update({out_trade_no: out_trade_no}, {$set: {payResult: req.body}}, function(err, o){
            if (err){
                final('server error')
            } else if (!o){
                final('out_trade_no not exists!');
            } else {
                final()
                if (req.body.trade_state == 'SUCCESS'){
                    mLottery.saveLotteryFromWxOrder(wxorder)
                    exports.updateWxorderState(wxorder, 'complete')
                    exports.updateRedPagerRecordState(wxorder.redPagerRecordIds, 1);
                    exports.updateUserPoint(wxorder, wxorder.score);
                    exports.sendTemplateMessage(wxorder);
                }
            }
        })
    }

    var checkOldState = function(){
        if (req.body.out_trade_no){
            wxorderCollection.findOne({out_trade_no: req.body.out_trade_no}, function(err, o){
                if (err){
                    final('check old server error')
                } else if (!o){
                    final('check old out_trade_no not exists!');
                } else {
                    if (!o.payResult){
                        checkPayResult(o.token, o)
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

    var checkPayResult = function(token, wxorder){
        if (req.body.return_code == 'FAIL' || req.body.result_code == 'FAIL'){
            updateWxOrder(wxorder)
        } else {
            if (req.body.appid != payConfig.getBaseConfig(token).appid || req.body.mch_id != payConfig.getBaseConfig(token).mch_id){
                return final('参数错误')
            }

            var params = _.extend({}, req.body)
            delete params.sign
            if (payUtils.getPaySign(params, payConfig.getPayKey(token)) != req.body.sign){
                return final('sign error')
            }
            updateWxOrder(wxorder)
        }
    }
}

function wxOrderQuery(out_trade_no, token, cb){
    var param = {
        out_trade_no: out_trade_no,
        nonce_str : payUtils.getNonceStr()
    }
    param = _.extend(param, payConfig.getBaseConfig(token));
    delete param.trade_type
    param.sign = payUtils.getPaySign(param, payConfig.getPayKey(token))
    mWxPay.orderQuery(param, function(err, response) {
        if (err) {
            cb(err);
        } else if (response) {
            cb(null, response)
        } else {
            cb('unknow')
        }
    });
}

exports.startRefund = function(orderIds, cb){
    var findOrders = function(){
        lotterieCollection.find({_id: {$in: orderIds}}, {out_trade_no: 1}, function(err, orders){
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
        wxorderCollection.find(condition, function(err, docs){
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
            exports.doWxRefund(o.mallToken, o.out_trade_no, o.payResult.total_fee, function(err, response){
                console.log('doWxRefund:' + err)
                if (err){
                    final(err);
                } else {
                    reFundScore()
                    wxorderCollection.update({out_trade_no: o.out_trade_no}, {$set: {reFundResult: response}}, function(err, o){
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
    wxorderCollection.updateById(wxOrder._id, {$set: {state: state}}, function(err){
        if (err){
            console.log('updateOrderState err:' + err)
        }
        lotterieCollection.findOne({token: wxOrder.token, prizeId: wxOrder.goodsId, out_trade_no: wxOrder.out_trade_no}, {_id: 1}, function(err, o){
            lotterieCollection.updateById(o._id, {$set: {state: state}}, function(err){
                if (err){
                    console.log('update lottery State err:' + err)
                }
                if (state == 'refund'){
                    mLottery.refundGoods(wxOrder)
                    dailyRecord.setTotalSalesVolume(wxOrder.goodsId, -(wxOrder.count ? wxOrder.count : 1), function (err, results) {});

                    if (o.prizeType == typeConfig.goods.type.shoppingCard) {
                        var shopCard = o.shoppingCard;
                        if (shopCard) {
                            mgoods.pushStockShopCard(wxOrder.goodsId, shopCard, function (err, results) {
                            });
                        }
                    }
                    else {
                        mLottery.updateGoodsCount(wxOrder.goodsId, -(wxOrder.count ? wxOrder.count : 1));
                    }
                }
            });
        })
    })
}

exports.doWxRefund = function(token, out_trade_no, total_fee, cb){
    var param = {
        nonce_str: payUtils.getNonceStr(),
        op_user_id: payConfig.getBaseConfig(token).mch_id,
        refund_fee: total_fee,
        total_fee: total_fee,
        out_refund_no: out_trade_no,
        out_trade_no: out_trade_no
    }
    param = _.extend(param, payConfig.getBaseConfig(token));
    delete param.trade_type
    param.sign = payUtils.getPaySign(param, payConfig.getPayKey(token))
    mWxPay.refund(param, payConfig.getWxSsl(token), function(err, response) {
        if (err) {
            cb(err);
        } else if (response) {
            cb(null, response)
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
    wxorderCollection.findOne({out_trade_no: out_trade_no}, function(err, o){
        if (err){
            res.send(500, err)
        } else if (!o){
            res.send(404, 'wxorder not exist')
        } else {
            if (o.state == 'new' && (!o.payResult || o.payResult.trade_state != 'SUCCESS')){
                mLottery.updateGoodsCount(o.goodsId, -(o.count?o.count:1))
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
        wxorderCollection.findOne({out_trade_no: out_trade_no}, function(err, o){
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
    doc.price = doc.price || 0;
    doc.score = doc.score || 0;
    doc.state = doc.state || 'new';
    doc.count = doc.count || 0;
    doc.dateTime = new Date();
    wxorderCollection.save(doc, function(err, o){
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
        appId: payConfig.getBaseConfig(req.token).appid,
        scope: 'jsapi_address',
        signType : "sha1",
        addrSign : "",
        timeStamp: "" + Math.ceil(new Date().getTime() / 1000),
        nonceStr: payUtils.getNonceStr()
    }

    var signParam = {
        accesstoken: accessToken,
        appid: payConfig.getBaseConfig(req.token).appid,
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
    mIntegral.changeIntegral(wxOrder.token, wxOrder.openId, -score, '购买')
}

exports.updateRedPagerRecordState = function(redPagerRecordIds, state){
    if (!redPagerRecordIds || redPagerRecordIds.length <= 0){
        return;
    }
    var condition = {
        _id: {$in: redPagerRecordIds}
    }
    redpagerrecordCollection.update(condition, {$set: {state: state}}, {multi: true}, function(err){
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
    var baseConfig = payConfig.getBaseConfig()
    money = Math.ceil(money * 100)
    var param = {
        nonce_str: payUtils.getNonceStr(),
        mch_billno: baseConfig.mch_id + payUtils.getMchBillno(),
        mch_id: baseConfig.mch_id,
        wxappid: baseConfig.appid,
        nick_name: send_name,
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
    param.sign = payUtils.getPaySign(param, payConfig.getPayKey())
    mWxPay.sendRedPack(param, payConfig.getWxSsl(), function(err, response) {
        if (err) {
            cb(err);
        } else if (response) {
            cb(null, response)
        } else {
            cb('unknow error')
        }
    });
}

exports.sendTemplateMessage = function(wxOrder){
    if (wxOrder.mallToken != config.tvmMallToken){
        return
    }
    goodsCollection.findById(wxOrder.goodsId, function(err, o){
        if (o) {
            wxInfo.getwxAccessToken(wxOrder.mallToken, function(err, response){
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
            template_id: '13pSDePohWHDVTu887YbfEJqgPviYuHNeJaCRru0uCM',
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
                console.log('postwxTemplate:' + JSON.stringify(response))
            });
        }, 8000)

    }
}

exports.closeOrder = function(wxOrder, cb){
    var param = {
        out_trade_no: wxOrder.out_trade_no,
        nonce_str : payUtils.getNonceStr()
    }
    param = _.extend(param, payConfig.getBaseConfig(wxOrder.token));
    delete param.trade_type
    param.sign = payUtils.getPaySign(param, payConfig.getPayKey(wxOrder.token))
    mWxPay.orderClose(param, function(err, response) {
        if (err) {
            cb(err);
        } else if (response) {
            cb(null, response)
            mLottery.updateGoodsCount(wxOrder.goodsId, -wxOrder.count);
            exports.updateWxorderState(wxOrder, 'close')
        } else {
            cb('unknow');
        }
    });
}

exports.updateWxorderState = function(wxOrder, state){
    wxorderCollection.update({out_trade_no: wxOrder.out_trade_no}, {$set: {state: state}}, function(err, o){

    });
}