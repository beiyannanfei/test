/**
 * Created by chenjie on 2015/5/13.
 */

var xml2js = require('xml2js');
var dbUtils = require('../mongoSkin/mongoUtils.js')
var cardCollection = new dbUtils('cards')
var cardRecordCollection = new dbUtils('cardRecord')
var ut = require('./utils')
var _ = require('underscore')
var moment = require('moment')
var wxInfo = require('./../interface/wxInfo')
var config = require('../config')
var SHA1 = require("crypto-js/sha1");
var tools = require('../tools');
var redisClient = tools.redisClient();
var CARD_DEFAULT_TOKEN = config.tvmMallToken   //ttyt: '9493a3a7a5f3'
var mUser = require('./user.js');
var cardSku = require('./cardSku.js');
var cardQrcode = require('./cardQrcode.js');

var wxCardApi = require('../interface/wxcardApi.js');

exports.gotoCards = function(req, res){
    console.log(req.token)
    res.render('card-list', {token: req.token});
}

exports.gotoAddCards = function(req, res){
    var id = req.param('id');
    var options = {}
    if (id){
        options.card_id = id
    }
    res.render('add-card', options);
}

function checkCardParam(req, cb){
    var card = req.body.card
    console.log(card)
    if (!card){
        return cb('card not exists')
    }
    if (card.card_type != "GENERAL_COUPON"){
        return cb('card_type not exists')
    }
    var general_coupon =  card.general_coupon
    if (!general_coupon){
        return cb('general_coupon  not exists')
    }

    var default_detail = general_coupon.default_detail
    if (!default_detail){
        return cb('default_detail  not exists')
    }

    var base_info = general_coupon.base_info
    if (!base_info){
        return cb('base_info  not exists')
    }
    if (!base_info.logo_url){
        return cb('base_info logo_url  not exists')
    }
    if (base_info.code_type != 'CODE_TYPE_TEXT'){
        return cb('base_info code_type  not exists')
    }
    if (!base_info.brand_name || base_info.brand_name.length > 12){
        return cb('base_info brand_name  not exists')
    }
    if (!base_info.title || base_info.title.length > 9){
        return cb('base_info brand_name  not exists')
    }
    if (!base_info.sub_title || base_info.sub_title.length > 18){
        return cb('base_info sub_title  not exists')
    }
    if (!base_info.color){
        return cb('base_info color  not exists')
    }
    if (!base_info.notice || base_info.notice.length > 12){
        return cb('base_info notice  not exists')
    }
    if (!base_info.description || base_info.description.length > 1000){
        return cb('base_info description  not exists')
    }
    if (!base_info.service_phone){
        return cb('base_info service_phone  not exists')
    }
    if (base_info.can_give_friend){
        base_info.can_give_friend = true
    } else {
        base_info.can_give_friend = false
    }

    var date_info = base_info.date_info
    if (date_info.type != 1 && date_info.type != 2){
        return cb('base_info date_info type  not exists')
    }
    base_info.date_info.type = ut.checkPositiveInt(date_info.type)
    if (date_info.type == 1){
        if (!date_info.begin_timestamp){
            return cb('base_info date_info begin_timestamp  not exists')
        } else {
            date_info.begin_timestamp = Math.floor(new Date(date_info.begin_timestamp).getTime() / 1000) + ''
            console.log(date_info.begin_timestamp)
        }
        if (!date_info.end_timestamp){
            return cb('base_info date_info end_timestamp  not exists')
        } else {
            date_info.end_timestamp = Math.floor(new Date(date_info.end_timestamp).getTime() / 1000) + ''
            console.log(date_info.end_timestamp)
        }
        if (date_info.begin_timestamp > date_info.end_timestamp){
            return cb('base_info date_info  not exists')
        }
    } else if (date_info.type == 1){
        if (date_info.fixed_term < 0){
            return cb('base_info date_info fixed_term  not exists')
        }
        if (date_info.fixed_begin_term < 0){
            return cb('base_info date_info fixed_term  not exists')
        }
    }
    var sku = base_info.sku
    if (!sku){
        return cb('base_info sku  not exists')
    }
    if ((sku.quantity = ut.checkPositiveInt(sku.quantity)) == null){
        return cb('base_info sku quantity  not exists')
    }

    if ((base_info.get_limit = ut.checkPositiveInt(base_info.get_limit)) == null){
        return cb('base_info get_limit  not exists')
    }

    if (base_info.custom_url){
        if (ut.isUrl(base_info.custom_url)){
            if (!base_info.custom_url_name){
                base_info.custom_url_name = '立即使用'
            }
            if (base_info.custom_url_name.length > 5){
                return cb('custom_url_name length over limit 5')
            }
        } else {
            return cb('custom_url error')
        }
    } else{
        delete base_info.custom_url_name
    }
    if ((req.body.price = ut.checkPositiveInt(req.body.price)) == null){
        return cb('price  not exists')
    }
    if (req.body.endTimeTips){
        req.body.endTimeTips = 1
    } else {
        req.body.endTimeTips = 0
    }

    req.body.card = card
    cb(null, req.body);
}

function generateToken(wxToken){
    var token = ''
    if (wxToken){
        token = wxToken
    } else {
        token = CARD_DEFAULT_TOKEN
    }
    return token
}

function getWxAccessToken(wxToken, cb){
    var token = generateToken(wxToken)
    wxInfo.getwxAccessToken(token, function(err, response){
        if (err){
            cb(err)
        } else if (response && response.accestoken){
            cb(null, response.accestoken)
        } else {
            cb('err: unknow')
        }
    })
}

exports.addCard = function(req, res){
    checkCardParam(req, function(err, doc){
        if (err){
            return res.send(500, err)
        }
        getWxAccessToken(req.token, function(err, accessToken){
            if (err){
                return res.send(500, err)
            } else {
                wxCardApi.create({card: doc.card}, accessToken, function(err, card_id){
                    if (err){
                        return res.send(500, err)
                    } else if (card_id){
                        doc.card_id = card_id
                        doc.state = 'new'
                        ut.groupDocWithToken(doc, generateToken(req.token), req.tvmId)
                        cardCollection.save(doc, function(err, o){
                            if (err){
                                return res.send(500, err)
                            } else{
                                cardSku.save(card_id, doc.card.general_coupon.base_info.sku.quantity, function(err){})
                                return res.send(200)
                            }
                        })
                    } else {
                        return res.send(500, err)
                    }
                })
            }
        })
    })
}

exports.updateCard = function(req, res){
    var id = req.param('id')
    checkCardParam(req, function(err, doc){
        if (err){
            return res.send(500, err)
        }
        getWxAccessToken(req.token, function(err, accessToken){
            if (err){
                return res.send(500, err)
            } else {
                var general_coupon = _.extend({}, doc.card.general_coupon)
                var param = {
                    card_id: req.card.card_id,
                    general_coupon: general_coupon
                }
                wxCardApi.update(param, accessToken, function(err){
                    if (err){
                        return res.send(500, err)
                    } else {
                        doc.state = 'new'
                        cardCollection.updateById(id, {$set: doc}, function(err, o){
                            if (err){
                                return res.send(500, err)
                            } else{
                                return res.send(200)
                            }
                        })
                        cardSku.update(req.card.card_id, doc.card.general_coupon.base_info.sku.quantity, accessToken, function(err){})
                    }
                })
            }
        })
    })
}

exports.uploadLogo = function(req, res){
    getWxAccessToken(req.token, function(err, accessToken){
        if (err){
            res.send(500)
        } else {
            if (!req.files.logo){
                return res.send(500);
            }
            wxCardApi.uploadLogo(accessToken, req.files.logo.path, function(err, url){
                if (err){
                    res.send({error: 1, msg: err})
                } else {
                    res.send({error: 0, url: url, state: 'SUCCESS'})
                }
            })
        }
    })
}

exports.getColors = function(req, res){
    getWxAccessToken(req.token, function(err, accessToken){
        if (err){
            res.send(500)
        } else {
            wxCardApi.getColors(accessToken, function(err, colors){
                if (err){
                    res.send(500, err)
                } else {
                    res.send(colors)
                }
            })
        }
    })
}

exports.listCard = function(req, res){
    var condition = {state: {$ne: 'deleted'}}
    ut.groupConditionWithToken(condition, generateToken(req.token), req.tvmId)
    console.log(condition)
    cardCollection.find(condition, function(err, docs){
        if (err){
            res.send([])
        } else{
            _.each(docs, function(o){
                o.card.general_coupon.base_info.date_info.begin_timestamp = moment(new Date(parseInt(o.card.general_coupon.base_info.date_info.begin_timestamp, 10) * 1000)).format('YYYY/MM/DD')
                o.card.general_coupon.base_info.date_info.end_timestamp = moment(new Date(parseInt(o.card.general_coupon.base_info.date_info.end_timestamp, 10) * 1000)).format('YYYY/MM/DD')
                o.link = config.domain + '/pointMall/card/' + o.card_id
            })
            res.send(docs)
        }
    })
}

function setWhiteList(data, token, cb){
    getWxAccessToken(generateToken(token), function(err, accessToken){
        wxCardApi.setWhiteList(data, accessToken, function(err, o){
            if (err){
                cb(err)
            } else {
                cb(null, o)
            }
        })
    })
}

exports.setWhiteList = function(req, res){
    var no = req.param('no')
    var data = {
         "username": [no]
    }
    setWhiteList(data, null, function(err, response){
        if (err){
            res.send(500, err)
        } else {
            res.send(200)
        }
    })
}

function qrcodeCreate(data, accessToken, cb){
    wxCardApi.qrcodeCreate(data, accessToken, function(err, ticket){
        if (err){
            console.log(err)
            cb(500, err)
        } else {
            var qrcode = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket
            cb(null, qrcode)
        }
    })
}

exports.consumeCode = function(req, res){
    var code = req.param('code')
    if (!code){
        return res.send(400, 'code param is required')
    }
    getWxAccessToken(req.token, function(err, accessToken){
        wxCardApi.consumeCode(code, accessToken, function(err){
            if (err){
                console.log(err)
                return res.send(500, err)
            } else {
                return res.send(200)
            }
        })
    })
}

exports.receiveCard = function(req, res){
    var o = req.card
    o.card.general_coupon.base_info.date_info.begin_timestamp = moment(new Date(parseInt(o.card.general_coupon.base_info.date_info.begin_timestamp, 10) * 1000)).format('YYYY/MM/DD')
    o.card.general_coupon.base_info.date_info.end_timestamp = moment(new Date(parseInt(o.card.general_coupon.base_info.date_info.end_timestamp, 10) * 1000)).format('YYYY/MM/DD')
    res.render('receive-card', {card: o})
}

exports.groupToken = function(req, res, next){
    req.token = generateToken(req.card?req.card.token:'')
    next();
}

exports.generateJsShareParam = function(req, res){
    var api_ticket = req.api_ticket
    var card_id = req.param('card_id')
    var param = {
        api_ticket: api_ticket,
        card_id: card_id,
        timestamp: req.wxJsParam.timestamp
    }
    var paramArr = _.values(param);
    paramArr.sort();
    var string  = ''
    for (var i = 0; i < paramArr.length; i++){
        string += paramArr[i];
    }
    console.log(string)
    param.signature = SHA1(string).toString()
    console.log(param)
    delete param.api_ticket
    delete param.card_id
    console.log(param)
    res.send({jsParam: req.wxJsParam, cardExt: param})
}

exports.generateChooseCardJsParam = function(req, res){
    var api_ticket = req.api_ticket
    var card_id = req.param('card_id')
    var param = {
        api_ticket: api_ticket,
        app_id: req.wxJsParam.appId,
        times_tamp: req.wxJsParam.timestamp,
        nonce_str: Math.random().toString().substring(2, 8)
    }
    if (card_id){
        param.card_id = card_id
    }
    console.log(param)
    var paramArr = _.values(param);
    paramArr.sort();
    var string  = ''
    for (var i = 0; i < paramArr.length; i++){
        string += paramArr[i];
    }
    console.log(string)
    var chooseCardParam = {
        timestamp: param.times_tamp,
        nonceStr: param.nonce_str,
        signType: 'SHA1',
        cardSign: SHA1(string).toString()
    }
    if (card_id){
        chooseCardParam.cardId = card_id
    }
    console.log(chooseCardParam)
    res.send({jsParam: req.wxJsParam, chooseCard: chooseCardParam})
}

function setCardApiTicket(token, ticket, expires_in){
    var key = 'token' + '-' + token + 'card-api-ticket'
    redisClient.setex(key, expires_in, ticket, function(err, value){

    });
}

exports.getCardApiTicket = function(req, res, next){
    var token = req.token

    var loadJsTicketByRedis = function(){
        var key = 'token' + '-' + token + 'card-api-ticket'
        redisClient.get(key, function(err, value){
            if (err){
                console.log(err);
                res.send(500)
            } else if (!value){
                loadTicketByNet();
            } else {
                console.log('redis client:' + value)
                req.api_ticket = value
                next()
            }
        })
    }


    var loadTicketByNet = function(){
        getWxAccessToken(token, function(err, ACCESS_TOKEN) {
            if (err) {
                return res.send(500, err)
            } else {
                wxCardApi.getAPiTicket(ACCESS_TOKEN, function(err, response){
                    if (err){
                        return res.send(500)
                    } else {
                        req.api_ticket = response.ticket
                        var s = parseInt(response.expires_in, 10)
                        if (s > 0){
                            setCardApiTicket(token, response.ticket, parseInt(response.expires_in, 10))
                        }
                        next()
                    }
                })
            }
        });
    }

    loadJsTicketByRedis();
}

exports.midCardLoader = function(param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next) {
        var id = req.param(param);
        if (!id) {
            return res.send(404);
        }
        cardCollection.findById(id, function (err, doc) {
            if (err) {
                return res.send(500, 'mongodb error');
            } else if (!doc) {
                return res.send(404, 'goods is not exist');
            }
            req.card = doc;
            next()
        })
    }
}

exports.midCardLoaderByCardId = function(param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next) {
        var id = req.param(param);
        if (!id) {
            return res.send(404);
        }
        cardCollection.findOne({card_id: id}, function (err, doc) {
            if (err) {
                return res.send(500, 'mongodb error');
            } else if (!doc) {
                return res.send(404, 'card is not exist');
            }
            console.log(doc)
            req.card = doc;
            next()
        })
    }
}

exports.cardInfo = function(req, res){
    var o = req.card
    cardSku.get(o.card_id, function(err, cardSku){
        if (err){
            console.log(err)
            res.send([])
        } else {
            o.card.general_coupon.base_info.sku.quantity = cardSku.count
            o.card.general_coupon.base_info.date_info.begin_timestamp = moment(new Date(parseInt(o.card.general_coupon.base_info.date_info.begin_timestamp, 10) * 1000)).format('YYYY/MM/DD')
            o.card.general_coupon.base_info.date_info.end_timestamp = moment(new Date(parseInt(o.card.general_coupon.base_info.date_info.end_timestamp, 10) * 1000)).format('YYYY/MM/DD')
            o.card.endTimeTips = o.endTimeTips
            o.card.price = o.price
            res.send(o.card)
        }
    })
}

exports.dealWxCardEvent = function(req, res){
    console.log('dealWxCardEvent')
    var wxToken = req.query.wx_token || '';
    if(wxToken){
        var buf = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
            buf += chunk;
        });
        req.on('end', function() {
            xml2js.parseString(buf, {explicitArray: false, trim: true, explicitRoot: false}, function(err, json) {
                if (err) {
                    return res.send(500, 'no response');
                } else {
                    console.log(json)
                    req.body = json;
                }
                if(req.body){
                    dealCardEvent(req.body, function(err){
                        if (err){
                            return res.send(500, err);
                        } else {
                            return res.send(200);
                        }
                    })
                }else{
                    return res.send(500, 'no response');
                }
            });
        });
    }else{
        return res.send(400, 'no wxToken');
    }
}

function dealCardEvent(body, cb){
    cardCollection.findOne({card_id: body.CardId}, function (err, doc) {
        if (err) {
            return cb(err)
        } else if (!doc) {
            return cb('not found')
        }
        if (body.Event == 'card_pass_check'){
            cardCheckEvent(body.CardId, 'pass', cb)
        } else if (body.Event == 'card_not_pass_check'){
            cardCheckEvent(body.CardId, 'not_pass', cb)
        } else if (body.Event == 'user_del_card'){
            deleteCardEvent(body, cb)
        } else if (body.Event == 'user_get_card'){
            getCardEvent(body, cb)
        } else if (body.Event == 'user_consume_card'){
            consumeCardEvent(body, cb)
        } else {
            cb()
        }
    })
}

function cardCheckEvent(cardId, state, cb){
    cardCollection.update({card_id: cardId}, {$set: {state: state}}, cb)
}

function deleteCardEvent(body, cb){
    var cardId = body.CardId
    var code = body.UserCardCode
    var openId = body.FromUserName
    var condition = {cardId: cardId, code: code, openId: openId}
    cardRecordCollection.update(condition, {$set: {state: 'deleted', deleteTime: new Date()}}, cb)
}

function getCardEvent(body, cb){
    var cardId = body.CardId
    var code = body.UserCardCode
    var openId = body.FromUserName
    if (body.IsGiveByFriend == 1){
        var condition = {cardId: cardId, code: code, openId: body.FriendUserName}
        var UPDATE_SPEC = {$set: {openId: openId, dateTime: new Date(), IsGiveByFriend: 1, fromOpenId: body.FriendUserName}}
        cardRecordCollection.update(condition, UPDATE_SPEC, {upsert: true}, cb)
    } else {
        cardRecordCollection.save({cardId: cardId, code: code, openId: openId, dateTime: new Date()}, cb)
        cardSku.incCount(cardId, -1, function(){})
    }
}

function consumeCardEvent(body, cb){
    var cardId = body.CardId
    var code = body.UserCardCode
    var openId = body.FromUserName
    var condition = {cardId: cardId, code: code, openId: openId}
    cardRecordCollection.update(condition, {$set: {state: 'consume', consumeTime: new Date()}}, cb)
}

exports.goReceiver = function(req, res){
    var card = req.card;
    res.render('card-receiver', {card: card})
}

exports.receiver = function(req, res){
    var id = req.param('id')
    var condition = {cardId: id}
    cardRecordCollection.find(condition, {}, {$sort: {dateTime: -1}}, function(err, docs){
        console.log(arguments)
        if (err){
            res.send([])
        } else {
            mUser.getUsers(_.pluck(docs, 'openId'), function(err, users){
                if (err){
                    return res.send([])
                }
                var userMap = ut.arrToMap(users);
                _.each(docs, function(o){
                    if (userMap[o.openId]){
                        o.userName = userMap[o.openId].nickName
                        o.headImg = userMap[o.openId].headImg
                    }
                    o.dateTime = moment(o.dateTime).format('YYYY-MM-DD HH-mm:ss')
                    if (o.consumeTime){
                        o.consumeTime = moment(o.consumeTime).format('YYYY-MM-DD HH-mm:ss')
                    }
                    if (o.deleteTime){
                        o.deleteTime = moment(o.deleteTime).format('YYYY-MM-DD HH-mm:ss')
                    }
                })
                return res.send(docs)
            })
        }
    })
}

exports.deleteCard = function(req, res){
    var card = req.card
    getWxAccessToken(req.token, function(err, ACCESS_TOKEN) {
        if (err) {
            return res.send(500, err)
        } else {
            wxCardApi.delete(ACCESS_TOKEN, card.card_id, function (err, response) {
                if (err){
                    res.send(500, err)
                } else {
                    res.send(200)
                    cardCollection.updateById(card._id, {$set: {state: 'deleted'}}, function(err){

                    })
                }
            });
        }
    })
}

exports.cardQrcode = function(req, res){
    getWxAccessToken(req.token, function(err, ACCESS_TOKEN) {
        if (err) {
            return res.send(500, err)
        } else {
            cardQrcode.getQrcode(req, res, ACCESS_TOKEN)
        }
    })
}

exports.decodeCode = function(token, encrypt_code, cb){
    getWxAccessToken(token, function(err, ACCESS_TOKEN) {
        if (err) {
            return cb(err)
        }
        wxCardApi.codeDecrypt(ACCESS_TOKEN, encrypt_code, function (err, response) {
            if (err){
                cb(err)
            } else if (response && response.code){
                cb(null, response.code)
            } else {
                cb('decodeCode unknow error')
            }
        });
    });
}

exports.useCode = function(code, accessToken, cb){
    wxCardApi.consumeCode(code, accessToken, function(err){
        if (err){
            console.log(err)
            cb(err)
        } else {
            cb()
        }
    })
}