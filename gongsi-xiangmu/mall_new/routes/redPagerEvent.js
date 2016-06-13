/**
 * Created by Administrator on 2014/7/31.
 */
var typeConfig = require('./typeConfig.js');
var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var ut = require('./utils');
var config = require('../config');
var tkConfig = require('../tokenConfig.js');
var interface = require('../interface');
var mLotteryEvent = require('./lotteryEvent');
var mOpUser = require('./opUser')
var wxInfo = require('./../interface/wxInfo');
var wxPay = require('./wxPay');
var mIntegral = require('../interface/integral.js');

var tools       = require('../tools');
var redisClient = tools.redisClient();
//redisClient.select(6, function() {
//    console.log('抢红包切换到database 6');
//});

var dbUtils = require('../mongoSkin/mongoUtils.js');
var redpagereventsCollection = new dbUtils('redpagerevents');
var redpagerrecordsCollection = new dbUtils('redpagerrecords');
var goodsCollection = new dbUtils('goods')
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);
var userCollection = new dbUtils('users');

function checkRedPagerRecord(key, field, limit, done) {
    console.log("key: %j, field: %j, limit: %j", key, field, limit);
    redisClient.HINCRBY(key, field, 1, function (err, value) {
        if (err) {
            return done(err);
        }
        var value = parseInt(value, 10);
        if (_.isNaN(value) || value < 1) {
            return done('expect int > 0');
        }
        if (value > limit) {
            redisClient.HINCRBY(key, field, -1);
            return done('exceed limit');
        }
        done(null, value - 1);
    });
}

exports.midRedPagerLoader = function(req, res, next){
    var id = req.param('id');
    if (!id) {
        return res.send(404);
    }
    redpagereventsCollection.findById(id, function (err, doc) {
        if (err) {
            return res.send(500, 'mongodb error');
        } else if (!doc) {
            return res.send(404, 'RedPager is not exist');
        }
        if (doc.token != req.token){
            return res.send(404, 'RedPager is not exist');
        }
        req.redPagerEvent = doc;
        next()
    })
}

exports.gotoRedpagerList = function(req, res){
    if (!req.token){
        return res.send(500, '商家没有权限')
    }
    var token = req.token
    redpagereventsCollection.find({token: token, deleted: {$ne: true}}, {}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            return res.send(500, 'mongodb error');
        }
        _.each(docs, function(o){
            o.dateTime = moment(o.dateTime).format('YYYY-MM-DD HH:mm:ss')
            o.url = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(tkConfig.getDomain(token) + '/pointMall/enter/redPager/' + o._id + '?wx_token=' + token);
        })
        res.render('redPager-event-list', {redPagerEvent: docs})
    })
}

exports.gotoAddRedPager = function(req, res){
    mLotteryEvent.getTagCategory(req.token, function(tags){
        res.render('add-redPager-event', {tag: JSON.stringify(tags)})
    });
}

exports.gotoUpdateRedPager = function(req, res){
    mLotteryEvent.getTagCategory(req.token, function(tags){
        res.render('add-redPager-event', {redPagerEventId: req.redPagerEvent._id.toString(), tag: JSON.stringify(tags)})
    });
}

function checkRedPagerEventParam(req, cb){
    var token = req.token;
    var name = req.param('name');
    if (!name){
        return cb('name参数不存在')
    }

    var storeName = req.param('storeName');
    if (!storeName){
        storeName = ''
        //return cb('storeName参数不存在')
    }

    var storeLink = req.param('storeLink');
    if (!storeLink){
        storeLink = ''
    }

    var bg = req.param('bg');
    if (!bg){
        return cb('bg参数不存在')
    }

    var logo = req.param('logo');
    if (!logo){
        return cb('logo参数不存在')
    }

    var limit = req.param('limit');
    if (limit && (limit = ut.checkPositiveInt(limit)) == null){
        return cb('limit错误')
    }

    var endTime = req.param('endTime');
    if (!endTime){
        return cb('没有结束时间')
    }

    endTime = new Date(endTime);

    var category = req.body.category;

    var prizes = req.body.prizes;
    if (!prizes){
        return cb('prizes参数为空')
    }
    if (prizes.length <= 0){
        return cb('没有奖品')
    }

    for (var i = 0; i < prizes.length; i++){
        var o = prizes[i]
        if (!o.id){
            return cb('奖品参数错误')
        }
        if ((o.count = ut.checkPositiveInt(o.count)) == null){
            return cb('奖品数量错误')
        }
        if ((o.p = ut.checkPositiveFloat(o.p)) == null){
            return cb('奖品概率错误')
        }
    }

    var doc = {
        token: token,
        name: name,
        prizes: prizes,
        storeName: storeName,
        storeLink: storeLink,
        bg: bg,
        logo: logo,
        category: category,
        endTime: endTime
    }
    if (limit){
        doc.limit = limit
    } else {
        doc.limit = 9999999
    }

    cb(null, doc)
}

exports.addRedPager = function(req, res){
    checkRedPagerEventParam(req, function(err, doc){
        if (err){
            return res.send(400, err)
        } else {
            console.log(doc)

            doc.dateTime = new Date()
            redpagereventsCollection.save(doc, function(err){
                if (err){
                   return res.send(400, err)
                } else {
                    return res.send(200)
                }
            })
        }
    })
}

exports.updateRedPager = function(req, res){
    checkRedPagerEventParam(req, function(err, doc){
        if (err){
            return res.send(400, err)
        } else {
            redpagereventsCollection.updateById(req.redPagerEvent._id, {$set: doc}, function(err){
                if (err){
                    return res.send(400, err)
                } else {
                    return res.send(200)
                }
            })
        }
    })
}

exports.getRedPagerEventInfo = function(req, res){
    var redPagerEvent = req.redPagerEvent;
    var findGoods = function(){
        var goodsIds = _.pluck(redPagerEvent.prizes, 'id');
        goodsCollection.find({_id: {$in: goodsIds}}, function(err, docs){
            if (err){
                res.send(500, err);
            } else{
                var prizeMap = {}
                _.each(docs, function(o){
                    prizeMap[o._id.toString()] = o;
                })

                _.each(redPagerEvent.prizes, function(o){
                    o.name = prizeMap[o.id].name
                    o.pic = prizeMap[o.id].pic
                    o.type = prizeMap[o.id].type
                })
                if (redPagerEvent.endTime){
                    redPagerEvent.endTime = moment(redPagerEvent.endTime).format('YYYY/MM/DD HH:mm:ss');
                }
                return res.send(redPagerEvent)
            }
        });
    }

    findGoods();
}

exports.delRedPagerEvent = function(req ,res){
    redpagereventsCollection.updateById(req.redPagerEvent._id, {$set: {deleted: true}}, function(err){
        if (err){
            return res.send(500, err)
        } else {
            return res.send(200)
        }
    })
}

exports.enterRedPager = function(req, res){
    var needNotAuth = true
    for (var i = 0; i < req.redPagerEvent.prizes.length; i++){
        var prize = req.redPagerEvent.prizes[i];
        if (prize.type == 2){
            needNotAuth = false;
            break;
        }
    }

    console.log('req.session.tvmMallOpenId:' + req.session.tvmMallOpenId)
    console.log('needNotAuth:' + needNotAuth)
    if (req.session.tvmMallOpenId || needNotAuth){
        console.log('direct')
        res.redirect('/pointMall/inner/redPager/' + req.redPagerEvent._id);
    } else {
        var mallDomain = 'http://mb.mtq.tvm.cn'
        var redirect_url = 'http://' + req.host + '/pointMall/inner/redPager/' + req.redPagerEvent._id
        var url = mallDomain + "/oauth?wx_token=" + config.tvmMallToken + "&token=7fda67277f&state=123456&opid=1&redirecturl=" + encodeURIComponent(redirect_url);
        console.log(url)
        res.redirect(url)
    }
}

exports.redPagerResult = function(req, res){
    var tvmMallOpenId = req.param('openid')
    if (tvmMallOpenId){
        req.session.tvmMallOpenId = tvmMallOpenId;
    }

    delete req.redPagerEvent.prizes
    var options = {
        redPagerEvent: req.redPagerEvent
    }
    res.render('redPager-result', options)
}

exports.checkUserFollowed = function(req, res, next){
    var user = req.user
    if (user && user.status == 'subscribe'){
        return next();
    }
    return res.send({status: -4, name: req.wxname, followUrl: req.followUrl})
}

exports.drawRedPager = function(req, res){
    var redPagerEvent = req.redPagerEvent;

    //没抽中奖的
    var notWinningredPager = function(){
        //userGroup.addBehaviorAndGroup(req.token,req.session.openId,'抢红包',redPagerEvent.name,'未抽中',function(data){});
    };


    if (redPagerEvent.deleted){
        notWinningredPager();
        return res.send({status: -1})
    }

    var random = Math.random();

    redPagerEvent.prizes.sort(function(){
        return (0.5 < Math.random())?-1:1
    })

    if (redPagerEvent.endTime && new Date().getTime() > redPagerEvent.endTime.getTime()){
        notWinningredPager();
        return res.send({status: -2})
    }

    var lookRedPager = function(){
        async.eachSeries(redPagerEvent.prizes, function(o, done){
            if (o.type == 2){
                if (!req.session.tvmMallOpenId){
                    return done()
                } else if (new Date().getHours() < 8){
                    return done()
                }
            }
            if (random < o.p){
                var key = "keys_drawRedPager";
                var field = redPagerEvent._id.toString() + '-' + o.id;
                var limit = o.count;
                checkRedPagerRecord(key, field, limit, function(err, count){
                    if (err){
                        done()
                    } else {
                        if (o.shoppingCards && o.shoppingCards.length > 0){
                            if (o.shoppingCards.length < count){
                                return done()
                            } else {
                                o.shoppingCard = o.shoppingCards[count]
                            }
                        }
                        done(o)
                    }
                })
            } else {
                done()
            }
        }, function(o){
            dealResult(o)
        })
    }

    var dealResult = function(result){
        if (!result){
            notWinningredPager();
            return res.send({status: -1})
        } else {
            goodsCollection.findById(result.id, function(err, o){
                if (err){
                    notWinningredPager();
                    res.send({status: -1})
                } else {
                    res.send({pic: o.pic, name: o.name, price: o.price, type: o.type, score: o.score, ext: o.ext});
                    //userGroup.addBehaviorAndGroup(req.token,req.session.openId,'抢红包',redPagerEvent.name,'中奖',function(data){});
                    saveRedPagerRecord(redPagerEvent, o, req.token, req.session.openId, result.boundText, result.shoppingCard, result.bid);
                    if (o.type == typeConfig.goods.type.cashRedPager){
                        var key = "keys_dealResult";
                        var field = 'redpager-count-' + moment(new Date()).format('YYYY-MM-DD-HH-mm');
                        console.log("key: %j, field: %j", key, field);
                        redisClient.HINCRBY(key, field, 1, function(err, value){
                            if (err){

                            } else {
                                var value = parseInt(value, 10);
                                if (_.isNaN(value) || value < 1){

                                } else if (value > 1800){
                                    wxInfo.pushErrorMsg('env: ' + config.NODE_ENV + '\n' + '发送红包数到达限制：' + key + ':' + value)
                                } else {
                                    wxPay.sendRedPack(redPagerEvent.name, result.nick_name, result.send_name, result.wishing, result.remark, req.session.tvmMallOpenId, o.price, function(err){
                                        if (err){
                                            wxInfo.pushErrorMsg('env: ' + config.NODE_ENV + '\n' + err)
                                        } else {

                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }
    }
    lookRedPager()
}

function sendMessage(doc, storeLink, storeName){
    goodsCollection.findById(doc.redPagerId, function(err, o){
        if (err){
            return console.log(err)
        }
        var message = "恭喜您获得" + o.name + "券码" + doc.shoppingCard + '。'
        if (storeLink && storeName){
            if (doc.redPagerId == '54d5d360bff32c4f4e000a35'){
                message += '<a href="' + storeLink + '">立刻去爱康国宾健康商城逛逛</a>。' + '结算时输入券码就能立减30元。详情请咨询爱康国宾在线客服~'
            } else {
                message += '<a href="' + storeLink + '">立即激活</a>。'
            }
        }

        interface.pushMessage(doc.token, doc.openId, message, function(err, response){
            if (err){
                console.log('sendMessage err:' + err)
            }
        });
    })
}

function saveRedPagerRecord2Redis(redPagerEvent, redPager, openId) {    //将商品信息存入redis用于统计
    var redPagerEventId = redPagerEvent._id.toString();     //事件ID
    var userOpenId      = openId;                           //用户openID
    var prizeId         = redPager._id.toString();          //奖品id
    var prizePrice      = +(redPager.price?redPager.price:0);                  //奖品金额
    var prizeName       = redPager.name;                    //奖品名字

    var totalPartInKey  = redPagerEventId + "_users";            //统计总参与人数key， field为openid， val为该openid的参与次数
    var grabPrizeKey    = redPagerEventId + "_grab_count";       //每个奖品的抢中数量key，field为prizeId， val为抢中的数量
    var grabPriceKey    = redPagerEventId + "_grab_prize_price"; //每个奖品的总金额key，field为prizeId， val为抢中的总金额
    var prizeNameKey    = "redPager_prize_name";                 //每个奖品对应的奖品名称，field为prizeId， val为奖品名称

    async.parallel([
        function writePartIn(cb) {
            redisClient.HINCRBY(totalPartInKey, userOpenId, 1, function(err, data) {
                if (err){
                    logger.error("writePartIn error, err info: %j, %j, %j", err, totalPartInKey, userOpenId);
                }
                cb(err, data);
            });
        },
        function writegrabPrize(cb) {
            redisClient.HINCRBY(grabPrizeKey, prizeId, 1, function(err, data) {
                if (err){
                    logger.error("writegrabPrize error, err info: %j, %j, %j", err, grabPrizeKey, prizeId);
                }
                cb(err, data);
            });
        },
        function writegrabPrice(cb) {
            redisClient.HINCRBYFLOAT(grabPriceKey, prizeId, prizePrice, function(err, data) {
                if (err){
                    logger.error("writegrabPrice error, err info: %j, %j, %j, %j", err, grabPriceKey, prizeId, prizePrice);
                }
                cb(err, data);
            });
        },
        function writeprizeName(cb) {
            redisClient.HSET(prizeNameKey, prizeId, prizeName, function(err, data) {
                if (err){
                    logger.error("writeprizeName error, err info: %j, %j, %j", err, prizeNameKey, prizeId);
                }
                cb(err, data);
            });
        }
    ], function (err, result) {
        if (!!err) {
            logger.error("saveRedPagerRecord2Redis error, err info: %j", err);
        }
    });
}

function saveRedPagerRecord(redPagerEvent, redPager, token, openId, boundText, shoppingCard, bid){
    var doc = {
        token: token,
        openId: openId,
        redPagerId: redPager._id.toString(),
        redPagerEventId: redPagerEvent._id.toString(),
        boundText: boundText,
        goodsType: redPager.type,
        state: 0
    }
    if (redPager.ext && redPager.ext.cardEndTime && redPager.ext.cardStartTime){
        doc.endTime = redPager.ext.cardEndTime
        doc.cardStartTime = redPager.ext.cardStartTime
        doc.price = +redPager.price
    }
    if (shoppingCard){
        doc.shoppingCard = shoppingCard
    }
    doc.dateTime = new Date();
    saveRedPagerRecord2Redis(redPagerEvent, redPager, openId);
    redpagerrecordsCollection.save(doc, function(err, o){
        if (err){
            console.log('saveRedPagerRecord', err)
        }
        if (shoppingCard){
            sendMessage(o, redPagerEvent.storeLink, redPagerEvent.storeName)
        }
    });

    if (redPager.type == typeConfig.goods.type.score && redPager.score){
        mIntegral.changeIntegral(token, openId, redPager.score, '抢红包')
    } else if (redPager.type == typeConfig.goods.type.cashRedPager){
        //wxPay.sendRedPack()
    }
}

exports.loadBoundList = function(req, res){
    var token = req.token;
    var redPagerEvent = req.redPagerEvent
    var condition = {
        token: token,
        redPagerEventId: redPagerEvent._id.toString()
    }
    redpagerrecordsCollection.find(condition, {redPagerId: 1, openId: 1, dateTime: 1, boundText: 1, goodsType: 1}, {limit: req.pageSpec.limit, skip: req.pageSpec.skip, sort: {dateTime: -1}}, function(err, docs){
        if (err){
            res.send(500, err);
        } else {
            findRedPager(docs);
        }
    })

    var findRedPager = function(data){
        var goodsIds = _.pluck(data, 'redPagerId')
        goodsIds = dbUtils.id2Str(goodsIds)
        goodsIds = _.uniq(goodsIds)
        goodsCollection.find({_id: {$in: goodsIds}}, {name: 1, price: 1, score: 1}, function(err, docs){
            if (err){
                res.send(500, err);
            } else{
                var prizeMap = {}
                _.each(docs, function(o){
                    prizeMap[o._id.toString()] = o;
                })

                _.each(data, function(o){
                    o.redPagerName = prizeMap[o.redPagerId.toString()].name
                    o.price = prizeMap[o.redPagerId.toString()].price
		            o.score = prizeMap[o.redPagerId.toString()].score
                    o.dateTime = moment(o.dateTime).format('MM/DD HH:mm')
                })
                findUser(data);
            }
        });
    }

    var findUser = function(data){
        var openIds = _.pluck(data, 'openId')
        userCollection.find({openId: {$in: openIds}}, {nickName: 1, headImg: 1, openId: 1}, function(err, docs){
            if (err){
                res.send(500, err);
            } else{
                var userMap = {}
                _.each(docs, function(o){
                    userMap[o.openId] = o;
                })

                _.each(data, function(o){
                    o.userName = userMap[o.openId].nickName
                    o.headImg = userMap[o.openId].headImg
                })
                final(data);
            }
        })
    }

    var final = function(data){
        res.send(data);
    }
}

exports.checkUserRedPagerTimes = function (req, res, next) {
    var openId = req.session.openId;
    if (!openId) {
        return res.send(400, 'openId参数不存在');
    }
    var redPagerEvent = req.redPagerEvent;
    if (redPagerEvent.limit && redPagerEvent.limit > 0) {
        var key = "keys_checkUserRedPagerTimes";
        var field = req.token + '-' + redPagerEvent._id.toString() + '-' + openId;
        redisClient.HINCRBY(key, field, 1, function (err, value) {
            if (err) {
                return next();
            }
            value = parseInt(value, 10);
            if (value > redPagerEvent.limit) {
                return res.send({status: -3, limit: redPagerEvent.limit});
            }
            return next();
        });
    }
    else {
        return next();
    }
};

exports.listEnableRedPager = function(req, res){
    var token = req.token
    var openId = req.openId;
    var condition = {
        token: token,
        openId: openId,
        goodsType: typeConfig.goods.type.redPager,
        endTime: {$gt: new Date()},
        cardStartTime: {$lt: new Date()},
        state: 0
    }
    redpagerrecordsCollection.find(condition, {redPagerId: 1, endTime: 1, cardStartTime: 1}, function(err, docs){
        if (err){
            res.send(500, err);
        } else {
            findRedPager(docs);
        }
    })

    var findRedPager = function(data){
        var goodsIds = _.pluck(data, 'redPagerId')
        goodsCollection.find({_id: {$in: goodsIds}}, {name: 1, price: 1, pic: 1}, function(err, docs){
            if (err){
                res.send(500, err);
            } else{
                var prizeMap = {}
                _.each(docs, function(o){
                    prizeMap[o._id.toString()] = o;
                })

                _.each(data, function(o){
                    o.name = prizeMap[o.redPagerId].name
                    o.price = prizeMap[o.redPagerId].price
                    o.pic = prizeMap[o.redPagerId].pic
                    o.endTime = o.endTime.getTime()
                    o.cardStartTime = o.cardStartTime.getTime()
                })
                res.send(data)
            }
        });
    }
}

exports.gotoRedPagerStatistics = function(req, res){
    logger.info("**************gotoRedPagerStatistics begin***************");
    var redPagerEvent = req.redPagerEvent;
    var eventName       = redPagerEvent.name;                    //事件名称
    var redPagerEventId = redPagerEvent._id.toString();          //事件ID
    var totalPartInKey  = redPagerEventId + "_users";            //统计总参与人数key， field为openid， val为该openid的参与次数
    var grabPriceKey    = redPagerEventId + "_grab_prize_price"; //每个奖品的总金额key，field为prizeId， val为抢中的总金额
    var grabPrizeKey    = redPagerEventId + "_grab_count";       //每个奖品的抢中数量key，field为prizeId， val为抢中的数量
    var prizeNameKey    = "redPager_prize_name";                 //每个奖品对应的奖品名称，field为prizeId， val为奖品名称

    async.parallel([
        function getPartInNum(cb) {     //获取参与人数
            redisClient.HLEN(totalPartInKey, function (err, data) {
                cb(err, data);
            });
        },
        function getTotalMoney(cb) {    //每个奖品总金额
            redisClient.HGETALL(grabPriceKey, function (err, data) {
                cb(err, data);
            });
        },
        function getTotalNum(cb) {      //每个奖品总数量
            redisClient.HGETALL(grabPrizeKey, function (err, data) {
                cb(err, data);
            });
        }
    ], function (err, results) {
        if (!!err) {
            return res.send(500, err);
        }
        if (!results[1] || !results[2]) {   //当查询结果为空(即不存在对应的key或field)
            res.render('redPager-event-statistics',
                {name: eventName, records: [], total: 0, totalPrice: 0});
        }
        var totalPeople = +results[0];  //总的参与人数
        var priceList = results[1];     //每个奖品的总金额
        var totalPrice = 0;
        _.each(priceList, function (val) {
            totalPrice += +val;
        });
        var numberList = results[2];    //每个奖品的总数量
        var prizeIdList = _.keys(priceList);    //奖品ID列表
        redisClient.HMGET(prizeNameKey, prizeIdList, function (err, data) {   //根据prizeIdList获取奖品名称
            if (!!err) {
                return res.send(500, err);
            }
            var prizeNameList = data;
            var records = [];
            var index = 0;
            _.each(prizeIdList, function (val) {
                var record = {};
                record.name = prizeNameList[index++];
                record.count = +numberList[val];
                record.price = +priceList[val];
                records.push(record);
            });
            logger.info("**************gotoRedPagerStatistics end***************");
            res.render('redPager-event-statistics',
                {name: eventName, records: records, total: totalPeople, totalPrice: totalPrice});
        });
    });

    /*
    var records = []
    var findRedPagerRecord = function(){
        var condition = {
            token: req.token,
            redPagerEventId: redPagerEvent._id.toString()
        }
        RedPagerRecord.aggregate({$match: condition}, {$group: {_id: "$redPagerId", count: {$sum: 1}}}, function(err, docs){
            if (err){
                res.send(500, err)
            } else {
                findGoods(docs)
            }
        })
    }

    var findGoods = function(data){
        console.log(data)
        var goodsIds = _.pluck(data, '_id')
        goodsIds.push(_.pluck(redPagerEvent.prizes, 'id'))
        goodsIds = _.flatten(goodsIds)
        goodsIds = _.uniq(goodsIds)
        console.log(goodsIds)
        goodsCollection.find({_id: {$in: goodsIds}}, {name: 1, price: 1}, function(err, docs){
            if (err){
                res.send(500, err);
            } else{
                var redPagerRecordMap = {}
                _.each(data, function(o){
                    redPagerRecordMap[o._id.toString()] = o;
                })

                var totalPrice = 0
                _.each(docs, function(o){
                    var record = {}
                    record.name = o.name
                    record.count = redPagerRecordMap[o._id.toString()]?redPagerRecordMap[o._id.toString()].count:0
                    record.price = record.count * o.price
                    records.push(record)
                    totalPrice += record.price
                })
                findTotal(totalPrice)
            }
        });
    }

    var findTotal = function(totalPrice){
        var key = req.token + '-' + redPagerEvent._id.toString() + '-*';
        redisClient.keys(key, function(err, value){
            if (err){
                res.send(500, err);
            } else {
                final(value.length, totalPrice)
            }
        })
    }

    var final = function(total, totalPrice){
        res.render('redPager-event-statistics', {name: redPagerEvent.name, records: records, total: total, totalPrice: totalPrice})
    }
    findRedPagerRecord()
    */
};

var MD5 = require("crypto-js/md5");
function generatePassword(token){
    return MD5(token + 'pass').toString().substring(0, 10);
}

exports.verifyPassword = function(req, res){
    var password = req.param('password')
    if (password != generatePassword(req.token)){
        return res.send(400)
    }
    return res.send(200)
}

exports.updateRedPagerRecordState = function(req, res){
    console.log(req.body)
    var ids = req.body.ids
    if (!ids || ids.length <= 0){
        return;
    }
    var condition = {
        _id: {$in: ids},
        openId: req.openId,
        token: req.token
    }
    redpagerrecordsCollection.update(condition, {$set: {state: 1}}, {multi: true}, function(err, count){
        if (err){
            res.send(400, 'err')
        } else {
            res.send(200, {count: 1})
        }
    })
}

exports.listRedPagerPrice = function(req, res){
    var ids = req.body.ids
    console.log(req.body)
    var condition = {
        _id: {$in: ids}
    }
    redpagerrecordsCollection.find(condition, {redPagerId: 1}, function(err, docs){
        if (err){
            res.send(500, err);
        } else {
            findRedPager(docs);
        }
    })

    var findRedPager = function(data){
        var goodsIds = _.pluck(data, 'redPagerId')
        goodsCollection.find({_id: {$in: goodsIds}}, {price: 1}, function(err, docs){
            if (err){
                res.send(500, err);
            } else{
                var prizeMap = {}
                _.each(docs, function(o){
                    prizeMap[o._id.toString()] = o;
                })

                _.each(data, function(o){
                    o.price = prizeMap[o.redPagerId].price
                })
                res.send(data)
            }
        });
    }
}