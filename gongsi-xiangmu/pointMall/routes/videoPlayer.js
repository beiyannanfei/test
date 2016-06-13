/**
 * Created by Administrator on 2015/3/18.
 */

var models = require('../models/index');
var Goods = models.Goods;
var Users = models.Users;
var Lottery = models.Lottery;
var PlayerHistory = models.PlayerHistory;

var moment = require('moment');
var _ = require('underscore');

var ut = require('./utils');
var MD5 = require("crypto-js/md5");
var mGoods = require('../models/goods');
var store = require('./store');

exports.gotoVideoPlayer = function(req, res){
    var goods = req.goods;
    var user = req.user
    var isVip = ''
    if (user && user.vip && user.vip.demand && user.vip.demand.endDate){
        if (user.vip.demand.endDate.getTime() > new Date().getTime()){
            isVip = 'isVip'
        }
    }
    var options = {}
    options.unFollowed = req.unFollowed
    options.followUrl = req.followUrl
    options.goods = goods
    options.isVip = isVip
    var demandId = req.param('demandId')
    if (demandId){
        options.demandId = demandId
    } else if (goods.type == mGoods.type.demandPackage){
        options.demandId = goods.ext.package[0]
    } else{
        options.demandId = goods._id
    }
    res.render('video-player-info', options)
}

exports.getGoodsVideoRes = function(req, res){
    var goods = req.goods;
    var loadVideoGoods = function(){
        var ids = goods.ext.package
        Goods.find({_id: {$in: ids}}, {'ext.videoRes': 1, 'ext.detail': 1, name: 1, pic: 1, price: 1}, function(err, docs){
            if (err){
                final([])
            } else {
                var map = ut.arrToMap(docs, '_id')
                var result = []
                _.each(goods.ext.package, function(o){
                    result.push(map[o])
                })
                final(result)
            }
        })
    }

    var final = function(docs){
        res.send(docs)
    }

    if (goods.type == mGoods.type.demandPackage){
        loadVideoGoods()
    } else {
        final([{
            ext:{videoRes: goods.ext.videoRes, detail: goods.ext.detail},
            name: goods.name,
            _id: goods._id,
            pic: goods.pic,
            price: goods.price
        }])
    }
}

exports.addPlayerHistory = function(req, res){
    var id = req.param('id');
    var curDuration = req.param('curDuration');
    if (!id){
        return res.send(400)
    }
    if ((curDuration = ut.checkPositiveInt(curDuration)) == null){
        return res.send(400)
    }
    var SPEC = {
        token: req.token,
        openId: req.openId
    }

    var UPDATE_SPEC = {$set: {}}
    var key = 'records.' + id;
    UPDATE_SPEC.$set[key] = {dateTime: new Date(), curDuration: curDuration}
    console.log(UPDATE_SPEC)
    PlayerHistory.collection.findAndModify(SPEC, {}, UPDATE_SPEC, {upsert: true}, function(err, doc){
        if (err){
            console.log(err);
            return res.send(500)
        } else {
            return res.send(200)
        }
    })
}

exports.delPlayerHistory = function(req, res){
    var ids = req.body.ids;
    if (!ids || !_.isArray(ids)){
        return res.send(400)
    }
    var SPEC = {
        token: req.token,
        openId: req.openId
    }

    var UPDATE_SPEC = {$unset: {}}
    _.each(ids, function(o){
        var key = 'records.' + o;
        UPDATE_SPEC.$unset[key] = 1
    })
    PlayerHistory.findOneAndUpdate(SPEC, UPDATE_SPEC, function(err, doc){
        if (err){
            console.log(err);
            return res.send(500)
        } else {
            return res.send(200)
        }
    })
}

exports.gotoPlayerHistory = function(req, res){
    res.render('video-player-history');
}

exports.playerHistory = function(req, res){
    var condition = {
        token: req.token,
        openId: req.openId
    }
    var findHistory = function(){
        PlayerHistory.findOne(condition, function(err, doc){
            if (err){
                final(null)
            } else {
                findGoods(doc);
            }
        })
    }

    var findGoods = function(history){
        var ids = []
        if (history && history.records){
            ids = _.keys(history.records)
        }
        if (ids.length == 0){
            return final([])
        }

        Goods.find({_id: {$in: ids}}, {'ext.videoRes': 1, name: 1, pic: 1}, function(err, docs){
            if (err){
                final([])
            } else {
                docs = ut.doc2Object(docs);
                _.each(docs, function(o){
                    o = _.extend(o, history.records[o._id.toString()])
                    o.dateTime = moment(o.dateTime).format('YYYY-MM-DD HH:mm')
                })
                final(docs)
            }
        })
    }

    var final = function(docs){
        docs.sort(function(a, b){
            if (a.dateTime > b.dateTime){
                return -1
            } else {
                return 1
            }
        })
        res.send(docs)
    }

    findHistory()
}

exports.videoSign = function(req, res){
    var path = req.param('path');
    var goodsId = req.param('goodsId');
    var key = '373QCWnGZp7iddurKfIkzRfjuXdELs'
    var openId = req.openId;
    var concurrent = '2';
    var expire = Math.ceil(new Date().getTime() / 1000) + 3600;
    var sign = MD5(key + '&' + openId + '&' + path + '&' + concurrent + '&' + expire).toString().substring(12, 8) + '.' + openId + '.' + concurrent + '.' + expire;
    console.log(sign)
    var SPEC = {
        token: req.token,
        openId: req.openId
    }
    var uKey = 'records.' + goodsId
    var option = {}
    option[uKey] = 1
    PlayerHistory.findOne(SPEC, option, function(err, doc) {
        var data = {
            sign: sign
        }
        if (doc && doc.records && doc.records[goodsId]){
            data.curDuration = doc.records[goodsId].curDuration
        } else {
            data.curDuration = 0;
        }
        return res.send(data)
    })
}