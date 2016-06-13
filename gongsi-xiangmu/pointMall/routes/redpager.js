/**
 * Created by chenjie on 2015/1/19.
 */

var models = require('../models/index');
var Goods = models.Goods;
var Users = models.Users;
var RedPagerRecord = models.RedPagerRecord;
var mGoods = require('../models/goods');
var async = require('async');
var _ = require('underscore');
var moment = require('moment');
var ut = require('./utils');

exports.gotoMeRedPagerList = function(req, res){
    res.render('me-red-pager-list')
}

exports.meRedPagerList = function(req, res){
    var condition = {
        token: req.token,
        openId: req.openId
    }

    var findRecords = function(){
        RedPagerRecord.find(condition, {}, {sort: {dateTime: -1}}, function(err, docs){
            if (err){
                res.send(400, err)
            } else {
                findGoods(ut.doc2Object(docs))
            }
        })
    }

    var findGoods = function(docs){
        var ids = _.pluck(docs, 'redPagerId');
        Goods.find({_id: {$in: ids}}, {name: 1, price: 1, type: 1}, function(err, goods){
            if (err){
                res.send(500, err)
            } else {
                var goodsMap = {}
                _.each(goods, function(o){
                    goodsMap[o._id.toString()] = o
                })
                _.each(docs, function(o){
                    o.price = goodsMap[o.redPagerId].price
                    o.name = goodsMap[o.redPagerId].name
                    o.goodsType = goodsMap[o.redPagerId].type
                    if (o.endTime){
                        o.isEndLine = (new Date().getTime() > o.endTime.getTime())?true:false
                        o.endTime = moment(o.endTime).format('YYYY/MM/DD HH:mm')
                    }
                })
                final(docs);
            }
        })
    }

    var final = function(data){
        res.send(data);
    }

    findRecords()
}