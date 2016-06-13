/**
 * Created by chenjie on 2014/9/3.
 */
var _ = require('underscore')
var moment = require('moment')
var async = require('async');

var ut = require('./utils')
var lottery = require('./lottery');
var interface = require('../interface');
var config = require('../config.js');
var wxInfo = require('./../interface/wxInfo');
var tkConfig = require('../tokenConfig');
var integral = require("./../interface/integral.js");

var typeConfig = require('./typeConfig.js');
var dbUtils = require('../mongoSkin/mongoUtils.js');
var userCollection = new dbUtils('users');
var goodsCollection = new dbUtils('goods');
var lotteryeventsCollection = new dbUtils('lotteryevents');
var groupsCollection = new dbUtils('groups');
var groupUserIdsCollection = new dbUtils('groupuserids');
var redpagerrecordCollection = new dbUtils('redpagerrecords');

exports.getEvent = function(req, res){
    var event = req.event;
    if (!event){
        return res.send(404, '活动不存在');
    }

    var findGoods = function(){
        var condition = {
            token: req.token
        }

        var goodsIds = _.pluck(event.goods, 'id')
        if (goodsIds.length == 0){
            return final();
        }
        condition._id = {$in: goodsIds};
        goodsCollection.find(condition, function(err, docs){
            if (err){
                return res.send(500, 'mongodb error');
            }

            var goodsMap = {};
            _.each(docs, function(o){
                goodsMap[o._id] = o;
            })
            _.each(event.goods, function(goods){
                goods.pic = goodsMap[goods.id].pic;
                goods.name = goodsMap[goods.id].name;
            })
            final();
        })
    }

    var final = function(){
        req.event.dateTime = moment(req.event.dateTime).format('YYYY/MM/DD HH-dd')
        res.send(event);
    }

    findGoods();
}

exports.listLotteryEvent = function(req, res){
    var state = req.param('state');
    if (!_.contains(['undo', 'completed'], state)){
        return res.send(400, 'state err:' + state);
    }

    var findLotteryEvent = function(){
        var condition = {
            state: state,
            token: req.token,
            deleted: {$ne: true}
        }
        lotteryeventsCollection.find(condition, {}, {limit: req.pageSpec.limit, skip: req.pageSpec.skip, sort: {dateTime: -1}}, function(err, docs){
            if (err){
                console.log(err)
                return res.send(500, 'mongodb err:' + err);
            } else if (!docs){
                docs = []
            }
            findGoods(ut.doc2Object(docs));
        })
    }

    var findGoods = function(data){
        var condition = {
            token: req.token
        }

        var goodsIds = []
        _.each(data, function(o){
            goodsIds.push(_.pluck(o.goods, 'id'));
        })

        goodsIds = _.flatten(goodsIds);
        goodsIds = _.uniq(goodsIds);
        if (goodsIds.length == 0){
            return final(data);
        }
        condition._id = {$in: goodsIds};
        goodsCollection.find(condition, function(err, docs){
            if (err){
                return res.send(500, 'mongodb error');
            }

            var goodsMap = {};
            _.each(docs, function(o){
                goodsMap[o._id] = o;
            })

            _.each(data, function(o){
                _.each(o.goods, function(goods){
                    goods.pic = goodsMap[goods.id].pic;
                    goods.name = goodsMap[goods.id].name;
                })
            })

            final(data);
        })
    }

    var final = function(data){
        _.each(data, function(o){
            o.dateTime = moment(o.dateTime).format('YYYY/MM/DD HH-mm')
        });
        res.send(data);
    }

    findLotteryEvent();

}

exports.gotoLotteryEvent = function(req, res){
    res.render('lottery_event');
}

exports.gotoLotteryEventBound = function(req, res){
    var event = req.event;
    event.goods.sort(function(a, b){
        return a.count > b.count;
    })

    if (event.state != 'completed'){
        return res.send('抽奖未完成，没有榜单');
    }

    var openIds = _.pluck(event.goods, 'openIds');
    openIds = _.flatten(openIds);
    openIds = _.uniq(openIds);

    var findUser = function(){
        var condition = {
            wxToken: event.token,
            openId: {$in: openIds}
        }

        userCollection.find(condition, {openId: 1, nickName: 1, headImg: 1}, function(err, docs){
            if (err){
                console.log('user find mongodb error：' + err)
                return res.send(500, 'mongodb error：' + err);
            }

            docs = ut.doc2Object(docs);
            var userMap = {}
            _.each(docs, function(o){
                userMap[o.openId] = o;
            })

            _.each(event.goods, function(goods){
                var users = []
                _.each(goods.openIds, function(openId){
                    users.push(userMap[openId]);
                })
                goods.users = users;
            })
            findGoods()
        })
    }

    var findGoods = function(){
        var condition = {
            token: event.token
        }

        var goodsIds = _.pluck(event.goods, 'id')
        if (goodsIds.length == 0){
            return final();
        }
        condition._id = {$in: goodsIds};
        goodsCollection.find(condition, function(err, docs){
            if (err){
                console.log('Goods find mongodb error：' + err)
                return res.send(500, 'mongodb error');
            }

            var goodsMap = {};
            _.each(docs, function(o){
                goodsMap[o._id] = o;
            })
            _.each(event.goods, function(goods){
                goods.pic = goodsMap[goods.id].pic;
                goods.name = goodsMap[goods.id].name;
            })
            final();
        })
    }

    var final = function(){
        res.render('userlistGetawards', {data: event.goods});
    }
    findUser();
}

exports.getLotteryEventBoundList = function(req, res){
    var event = req.event;
    event.goods.sort(function(a, b){
        return a.count > b.count;
    })

    if (event.state != 'completed'){
        return res.send('抽奖未完成，没有数据');
    }

    var openIds = _.pluck(event.goods, 'openIds');
    openIds = _.flatten(openIds);
    openIds = _.uniq(openIds);

    var findUser = function(){
        var condition = {
            wxToken: event.token,
            openId: {$in: openIds}
        }

        userCollection.find(condition, {openId: 1, nickName: 1, headImg: 1}, function(err, docs){
            if (err){
                console.log('user find mongodb error：' + err)
                return res.send(500, 'mongodb error：' + err);
            }

            docs = ut.doc2Object(docs);
            var userMap = {}
            _.each(docs, function(o){
                userMap[o.openId] = o;
            })

            _.each(event.goods, function(goods){
                var users = []
                _.each(goods.openIds, function(openId){
                    users.push(userMap[openId]);
                })
                goods.users = users;
            })
            findGoods()
        })
    }

    var findGoods = function(){
        var condition = {
            token: event.token
        }

        var goodsIds = _.pluck(event.goods, 'id')
        if (goodsIds.length == 0){
            return final();
        }
        condition._id = {$in: goodsIds};
        goodsCollection.find(condition, function(err, docs){
            if (err){
                console.log('Goods find mongodb error：' + err)
                return res.send(500, 'mongodb error');
            }

            var goodsMap = {};
            _.each(docs, function(o){
                goodsMap[o._id] = o;
            })
            _.each(event.goods, function(goods){
                goods.pic = goodsMap[goods.id].pic;
                goods.name = goodsMap[goods.id].name;
            })
            final();
        })
    }

    var final = function(){
        res.send(event.goods)
    }
    findUser();
}

exports.gotoLotteryEventMembers = function(req, res){
    var event = req.event;
    var goods = req.goods;
    if (!event){
        return res.send(404, '活动不存在');
    }

    var lotteryGoods = null;
    for(var i = 0; i < event.goods.length; i++){
        if (event.goods[i].id == goods._id.toString()){
            lotteryGoods = event.goods[i];
            break;
        }
    }
    if (!lotteryGoods){
        console.log('商品不在这个活动中');
        return res.send(404, '商品不在这个活动中');
    }

    goods.state = lotteryGoods.state;
    res.render('lottery-member', {event: event, goods: goods});
}

exports.gotoLotteryEventDetail = function(req, res){
    var event = req.event;
    if (!event){
        return res.send(404, '活动不存在');
    }

    var findGoods = function(){
        var condition = {
            token: req.token
        }

        var goodsIds = _.pluck(event.goods, 'id')
        if (goodsIds.length == 0){
            return final();
        }
        condition._id = {$in: goodsIds};
        goodsCollection.find(condition, function(err, docs){
            if (err){
                return res.send(500, 'mongodb error');
            }

            var goodsMap = {};
            _.each(docs, function(o){
                goodsMap[o._id] = o;
            })
            _.each(event.goods, function(goods){
                goods.pic = goodsMap[goods.id].pic;
                goods.name = goodsMap[goods.id].name;
            })
            final();
        })
    }

    var final = function(){
        res.render('lottery_event_detail', {event: event});
    }

    findGoods()

}

function getTags(token, activity, cb){
    groupsCollection.distinct('key', {wxToken: token, activity: activity}, function(err, tags){
        if (err){
            cb([])
        } else{
            cb(tags);
        }
    })
}

exports.getTagCategory = function(token, cb){
    console.log(token)
    if (token == '6384de36ad5f' || token == 'tvmty' || token == '33580c57d3c86f07'){
        return cb({});
    }

    integral.getUserGroupInfo(token, function (err, data) {
        if (!!err) {
            return cb({});
        }
        if (data.length <= 0) {
            return cb({});
        }
        var result = {};
        _.each(data, function (val) {
            var activity = val.activity;
            var key = val.key;
            if (!result[activity]) {
                result[activity] = [];
            }
            if (-1 == result[activity].indexOf(key)) {  //key值去重
                result[activity].push(key);
            }
        });
        return cb(result);
    });
};

exports.gotoAddLotteryEvent = function(req, res){
    exports.getTagCategory(req.token, function(tags){
        res.render('add-lottery-event', {tag: JSON.stringify(tags)});
    });
}

exports.gotoUpdateLotteryEvent = function(req, res){
    exports.getTagCategory(req.token, function(tags){
        res.render('add-lottery-event', {event: req.event, tag: JSON.stringify(tags)});
    });
}

exports.midEventLoader = function(req, res, next){
    var id = req.param('id');
    if (!id){
        return res.send(400, 'id param is required');
    }

    lotteryeventsCollection.findById(id, function(err, doc){
        if (err){
            return res.send(500, 'mongodb err:' + err);
        } else if (!doc){
            return res.send(404);
        }
        req.event = ut.doc2Object(doc);
        next();
    })
}

exports.addLotteryEvent = function(req, res){
    dealEvent(req, res);
}

exports.updateEvent = function(req, res){
    var event = req.event;

    var eventErr = ''
    _.each(event.goods, function(o){
        if (o.openIds.length > 0){
            eventErr = '已经抽过奖，不能更新或者添加商品';
        }
    })
    if (eventErr){
        console.log(eventErr);
        return res.send(403, eventErr);
    }

    dealEvent(req, res);
}

function dealEvent(req, res){
    var theme = req.param('theme')
    if (!theme){
        return res.send(400, 'theme param is required')
    }
    theme = theme.trim();

    var tag = req.param('tag')
    if (!tag){
        return res.send(400, 'tag param is required')
    }

    tag = tag.trim();

    var tagCategory = req.param('tagCategory')
    if (!tag){
        return res.send(400, 'tag param is required')
    }

    var defaultGoodsId = req.param('defaultGoodsId')

    var goods = req.body.goods;
    if (!goods){
        return res.send(400, 'goods param is required')
    }

    if (!_.isArray(goods)){
        goods = [goods];
    }

    var err = ''
    var goodsIds = []
    _.each(goods, function(o){
        if (!o.id){
            err = 'goods id not exists';
            return;
        } else if (!o.message || (o.message = o.message.trim()).length == 0){
            err = 'goods message not exists';
            return;
        } else if (!o.memo || (o.memo = o.memo.trim()).length == 0){
            err = 'goods memo not exists';
            return;
        } else {
            if (_.isUndefined(o.count)){
                err = 'goods count not exists';
                return;
            } else if(!(/^([1-9][\d]{0,3})$/.test(o.count))){
                err = '中奖人数必须是1-4位整数！';
                return;
            }
        }
        goodsIds.push(o.id);
    })
    if (err){
        console.log(err);
        return res.send(400, err);
    }

    var checkIfGoodsExists = function(){
        var ids = _.uniq(goodsIds);
        if (ids.length != goodsIds.length){
            return res.send(400, '商品Id重复');
        }
        goodsCollection.count({_id: {$in: ids}}, function(err, count){
            if (err){
                return res.send(500, 'mongodb err:' + err);
            } else if (ids.length != count){
                return res.send(400, '商品Id不存在');
            } else{
                final();
            }
        })
    }

    var final = function(){
        var eventDoc = {
            theme: theme,
            tag: tag,
            tagCategory: tagCategory,
            goods: goods,
            token: req.token
        }
        if (defaultGoodsId){
            eventDoc.defaultGoodsId = defaultGoodsId
        }
        if (req.event){
            lotteryeventsCollection.updateById(req.event._id, {$set: eventDoc}, function(err){
                if (err){
                    console.log(err)
                    return res.send(500, 'mongodb err:' + err);
                }
                res.send(200);
            })
        } else {
            var obj = eventDoc;
            obj.dateTime = new Date();
            lotteryeventsCollection.save(obj, function (err, doc) {
                if (err) {
                    return res.send(500, 'mongodb err:' + err)
                }

                if (!doc) {
                    return res.send(500, 'event insert error');
                }
                res.send(doc)
            })
        }
    }

    checkIfGoodsExists();
}

exports.startLottery = function(req, res){
    var openIds = req.body.openIds;
    var goods = req.goods;
    var event = req.event;

    var lotteryGoods = null;
    for(var i = 0; i < event.goods.length; i++){
        if (event.goods[i].id == goods._id.toString()){
            lotteryGoods = event.goods[i];
        }
    }
    if (!lotteryGoods){
        console.log('商品不在这个活动中');
        return res.send(404, '商品不在这个活动中');
    }

    if (!openIds){
        openIds = [];
    } else if (!_.isArray(openIds)){
        openIds = [openIds];
    }

    var count = lotteryGoods.count - openIds.length
    if (count <= 0){
        console.log(count);
        return res.send(403, '指定中奖人数超过限制');
    }

    var findUser = function(openIds){
        var condition = {
            wxToken: event.token,
            openId: {$in: openIds}
        }

        userCollection.find(condition, function(err, docs){
            if (err){
                return res.send(500, 'mongodb error：' + err);
            }
            docs = ut.doc2Object(docs);
            _.each(docs, function(doc){
                if (lotteryGoods.notice){
                    doc.notice = lotteryGoods.notice[doc.openId];
                }
            })
            return res.send(docs);
        })
    }

    if (lotteryGoods.openIds.length == 0){
        var otherLotteryOpenIds = _.pluck(event.goods, 'openIds');
        otherLotteryOpenIds = _.flatten(otherLotteryOpenIds);
        otherLotteryOpenIds = _.uniq(otherLotteryOpenIds);
        exports.randomFindOpenIdsByTag(req.token, openIds, otherLotteryOpenIds, event.tagCategory, event.tag, count, function(err, result){
            if (err){
                console.log(err)
                return res.send(500, err);
            } else{
                findUser(result);
            }
        })
    } else{
        findUser(lotteryGoods.openIds);
    }

}

exports.getOpenIdsByTag = function(token, tagCategory, tag, done){
    groupsCollection.findOne({wxToken: token, activity: tagCategory, key: tag}, {_id: 1}, function(err, doc){
        if (err){
            console.log(err);
            done([]);
        } else{
            if(doc){
                var groupId = doc._id;
                groupUserIdsCollection.distinct('openId', {groupId:groupId},function(err,docs){
                    if (err){
                        console.log(err);
                        done([]);
                    } else{
                        done(docs)
                    }
                });
            }else{
                done([]);
            }
        }
    });
}

exports.randomFindOpenIdsByTag = function(token, assignOpenIds, otherLotteryOpenIds, tagCategory, tag, count, cb){
    var result = []
    var page = 0
    var isLastPage = false
    var times = 0
    var findUser = function(openIds, last){
        var condition = {
            wxToken: token,
            openId: {$in: openIds},
            "status": "subscribe"
        }

        userCollection.find(condition, {openId: 1}, function(err, docs){
            if (err){
                return cb(null, result);
            } else {
                var opIds = _.pluck(docs, 'openId');
                result.push(opIds)
                result = _.flatten(result)
                if (count == result.length){
                    return cb(null, result);
                }
                if (last || times > 4){
                    return cb(null, result);
                }
                if (isLastPage){
                    page = 0
                    times++
                }
                findOpenIds(count - result.length);
            }
        })
    }

    var findOpenIds = function(leftCount){
        var pageCount = 10000
        /*mGroup.getOpenIdsByTag(token, tagCategory, tag, page, pageCount, function(openIds){
            var last = false
            if (openIds.length < pageCount){
                isLastPage = true
            }
            if (page == 0 && openIds.length < pageCount){
                last = true
            }
            page++
            openIds = _.difference(openIds, assignOpenIds);
            openIds = _.difference(openIds, result);
            if (openIds.length <= leftCount){
                findUser(openIds, last);
            } else{
                openIds = _.difference(openIds, otherLotteryOpenIds);
                if (openIds.length <= leftCount){
                    findUser(openIds, last);
                } else {
                    openIds = _.shuffle(openIds);
                    openIds = openIds.slice(0, leftCount)
                    findUser(openIds, false);
                }
            }
        })*/
    }
    findOpenIds(count)
}

exports.lotteryDone = function(req, res){
    var goods = req.goods;
    var event = req.event;

    var openIds = req.body.openIds;
    if (!openIds){
        openIds = [];
    } else if (!_.isArray(openIds)){
        openIds = [openIds];
    }

    var lotteryGoods = null;
    for(var i = 0; i < event.goods.length; i++){
        if (event.goods[i].id == goods._id.toString()){
            lotteryGoods = event.goods[i];
            break;
        }
    }
    if (!lotteryGoods){
        console.log('商品不在这个活动中');
        return res.send(404, '商品不在这个活动中');
    }

    if (lotteryGoods.state != 'undo'){
        return res.send(403, '已经抽过');
    }

    if (openIds.length > lotteryGoods.count){
        return res.send(403, '人数超过最大限制');
    }

    var updateEvent = function(openIds){
        var condition = {
            _id: event._id,
            goods: {
                $elemMatch: {
                    id: goods._id.toString()
                }
            }
        }
        var UPDATE_SPEC = {
            $set : {
                'goods.$.openIds' : openIds,
                'goods.$.state' : 'completed'
            }
        }

        var state = 'completed';
        for(var i = 0; i < event.goods.length; i++){
            if (event.goods[i].id != goods._id.toString()){
                if (event.goods[i].state == 'undo'){
                    state = 'undo';
                    break;
                }
            }
        }
        UPDATE_SPEC.$set.state = state;
        lotteryeventsCollection.update(condition, UPDATE_SPEC, function(err, o){
            if (err){
                return res.send(500, 'mongodb err:' + err);
            } else{
                res.send(200);
                if (state == 'completed'){
                    lotteryeventsCollection.findById(event._id, function (err, datas) {
                        if (!!err) {
                            console.error("[%j] lotteryDone db error: %j", __filename, err);
                        }
                        else {
                            postResult(datas);
                        }
                    });
                }
            }
        })
        generateLottery(goods, openIds)
        if (state == 'completed'){
            sendDefaultGoods(true, openIds);
        }
    }

    var generateLottery = function(goods, userOpenIds, isDefault){
        var lotteries = [];
        if (goods.type != typeConfig.goods.type.score && goods.type != typeConfig.goods.type.empty){
            _.each(userOpenIds, function(openId){
                var obj = {
                    token: req.token,
                    openId: openId,
                    prizeId: goods._id.toString(),
                    prizeType: goods.type,
                    prizeName: goods.name,
                    prizePic: goods.pic,
                    lotteryEvent: event._id.toString(),
                    from: 2
                }
                if (goods.type == typeConfig.goods.type.chargeCard || typeConfig.goods.type.shoppingCard || typeConfig.goods.type.goods){
                    obj.trade_state = 'new'
                }
                lotteries.push(obj)
            })
            lottery.addLotteries(lotteries, function(err){
                if (err){
                    console.log(err);
                }
            })
        }

        if (goods.type == typeConfig.goods.type.score){
            console.log('update user integral:' + goods.score)
            userCollection.update({wxToken: event.token, openId: {$in: userOpenIds}}, {$inc: {integral: goods.score}}, {multi: true}, function (err, doc) {

            });
        } else if (goods.type == typeConfig.goods.type.redPager){
            var records = [];
            _.each(userOpenIds, function(openId){
                records.push({
                    token: event.token,
                    openId: openId,
                    redPagerId: goods._id.toString(),
                    goodsType: goods.type
                })
            })
            async.eachSeries(records, function(doc, callback){
                doc.state = doc.state || 0;
                doc.boundText = doc.boundText || '';
                doc.dateTime = new Date();
                redpagerrecordCollection.save(doc, function (err, o) {
                    if (err) {
                        console.log('saveRedPagerRecord', err)
                    }
                    callback()
                })
            }, function(err){
                if (err){
                    console.log('添加红包日志出错');
                }
            })
        }

        if (isDefault){
            if (goods.type == typeConfig.goods.type.score || goods.type == typeConfig.goods.type.redPager){
                var message = '恭喜您在' + event.theme + '活动中获得了' + goods.name
                interface.pushMessage(event.token, userOpenIds, message, function(err, response){
                    if (err){
                        console.log(err);
                    } else{
                        console.log(response)
                    }
                });
            }
        }
    }

    var sendDefaultGoods = function(isDefault, openIds){
        if (event.defaultGoodsId){
            goodsCollection.findById(event.defaultGoodsId, function (err, doc) {
                if (err) {
                    console.log('mongodb error:' + err);
                } else if (!doc) {
                    console.log('goods is not exist');
                } else {
                    exports.getOpenIdsByTag(event.token, event.tagCategory, event.tag, function(userOpenIds){
                        var otherLotteryOpenIds = _.pluck(event.goods, 'openIds');
                        otherLotteryOpenIds.push(openIds)
                        otherLotteryOpenIds = _.flatten(otherLotteryOpenIds);
                        otherLotteryOpenIds = _.uniq(otherLotteryOpenIds);
                        userOpenIds = _.difference(userOpenIds, otherLotteryOpenIds);
                        generateLottery(doc, userOpenIds, isDefault)
                    })
                }
            })
        }
    }

    updateEvent(openIds);
}

exports.searchUser = function(req, res){
    var q = req.param('q');
    if (!q){
        return res.send(400, '查询关键字不存在');
    }

    var condition = {
        wxToken: req.token,
        nickName: q //{$regex: q}
    }
    userCollection.find(condition, function(err, docs){
        if (err){
            res.send(500, err);
        } else{
            res.send(docs);
        }
    })
}

exports.sendEventMessage = function(req, res){
    var event = req.event;
    var token = req.token;
    var content = event.theme + '获奖名单'
    var addressUrl = tkConfig.getDomain(token) + '/pointMall/lotteryEvent/' + event._id + '/bound/list';
    content += '<a href="' + addressUrl + '">点击查看榜单</a>'

    res.send(200);
}

exports.sendMessage = function(req, res){
    var goods = req.goods;
    var event = req.event;
    var token = req.token;

    var lotteryGoods = null;
    for(var i = 0; i < event.goods.length; i++){
        if (event.goods[i].id == goods._id.toString()){
            lotteryGoods = event.goods[i];
            break;
        }
    }
    if (!lotteryGoods){
        console.log('商品不在这个活动中');
        return res.send(404, '商品不在这个活动中');
    }

    var openIds = req.param('openId');
    if (!openIds){
        openIds = lotteryGoods.openIds;
    } else if (!_.isArray(openIds)){
        openIds = [openIds];
    }

    var content = lotteryGoods.message;
    interface.pushMessage(token, openIds, content, function(err, response){
        if (err){
            res.send(500, '通知失败：' + err);
        } else{
            if (response){
                response = JSON.parse(response);
                if (response.message){
                    var result = {}
                    _.each(response.message, function(o){
                        if (o.length > 0){
                            if (o[0].length > 1){
                                var errMsg = JSON.parse(o[0][1]);
                                result[o[1]] = errMsg.errcode
                            }
                        }
                    })
                    updateLotteryNotice(event._id.toString(), lotteryGoods.id, result);
                    res.send(result);
                } else{
                    res.send(500);
                }
            } else{
                res.send(500);
            }
        }
    })
}

function updateLotteryNotice(eventId, goodsId, notice){
    var condition = {
        _id: eventId,
        goods: {
            $elemMatch: {
                id: goodsId
            }
        }
    }
    var UPDATE_SPEC = {$set : {}}
    _.each(notice, function(value, key){
        UPDATE_SPEC.$set['goods.$.notice.' + key] = value
    })

    lotteryeventsCollection.update(condition, UPDATE_SPEC, function(err){
        if (err){
            console.log('update lottery notice err:' + err);
        }
    })
}

function postResult(event){
    event = ut.doc2Object(event)

    var openIds = _.pluck(event.goods, 'openIds');
    openIds = _.flatten(openIds);
    openIds = _.uniq(openIds);

    var findUser = function(){
        var condition = {
            wxToken: event.token,
            openId: {$in: openIds}
        }

        userCollection.find(condition, {openId: 1, nickName: 1, headImg: 1}, function(err, docs){
            if (err){
                console.log('user find mongodb error：' + err)
                return res.send(500, 'mongodb error：' + err);
            }

            docs = ut.doc2Object(docs);
            var userMap = {}
            _.each(docs, function(o){
                userMap[o.openId] = o;
            })

            _.each(event.goods, function(goods){
                var users = []
                _.each(goods.openIds, function(openId){
                    users.push(userMap[openId]);
                })
                goods.users = users;
            })
            findGoods()
        })
    }

    var findGoods = function(){
        var condition = {
            token: event.token
        }

        var goodsIds = _.pluck(event.goods, 'id')
        if (goodsIds.length == 0){
            return final();
        }
        condition._id = {$in: goodsIds};
        goodsCollection.find(condition, function(err, docs){
            if (err){
                console.log('Goods find mongodb error：' + err)
                return res.send(500, 'mongodb error');
            }

            var goodsMap = {};
            _.each(docs, function(o){
                goodsMap[o._id] = o;
            })
            _.each(event.goods, function(goods){
                goods.pic = goodsMap[goods.id].pic;
                goods.name = goodsMap[goods.id].name;
                delete goods._id
                delete goods.id
                delete goods.openIds
                delete goods.dateTime
                delete goods.notice
                delete goods.count
            })
            final();
        })
    }

    var final = function(){
        delete event.dateTime
        var data = {wx_token: event.token, id: event._id.toString(), dateTime: new Date().getTime(), data: event}
        wxInfo.postLotteryEventData(data, function(){
            console.log(arguments)
        })
    }
    findUser();
}

exports.delEvent = function(req, res){
    var id = req.param('id')
    lotteryeventsCollection.updateById(id, {$set: {deleted: true}}, function(err){
        if (err){
            res.send(500, err)
        } else{
            res.send(200)
        }
    })
}