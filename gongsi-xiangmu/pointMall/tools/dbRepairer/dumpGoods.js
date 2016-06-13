/**
 * Created by chenjie on 2015/1/27.
 */

var i = process.argv.indexOf('-token')
if (i < 0){
    return console.log('please input token, eg: node dumpToken.js -token dsbl')
}
var token = process.argv[i + 1]
if (!token){
    return console.log('please input token, eg: node dumpToken.js -token dsbl')
}

var fs = require('fs')
var _ = require('underscore');
var async = require('async');
var tools = require('../../tools');
var models = require('../../models')
var mGoods = require('../../models/goods')
var mLottery = require('../../routes/lottery')
var ut = require('../../routes/utils');
var DailyRecord = models.DailyRecord;
var Goods = models.Goods;

function exportGoods(){
    var condition = {
        token: token,
        deleted: {$ne: true},
        use: mGoods.useType.pay
    }
    var findGoods = function(){
        console.log('findGoods')
        Goods.find(condition, {name: 1, count: 1}, {sort: {dateTime: -1}}, function(err, docs){
            if (err){
                return res.send(500, 'mongodb error:' + err);
            }
            docs = ut.doc2Object(docs);
            findSaleCount(docs)
        })
    }

    var findSaleCount = function(docs){
        console.log('findSaleCount')
        mLottery.getSaleCount(token, _.pluck(docs, '_id'), function(result){
            findPv(docs, result)
        })
    }

    var findPv = function(docs, saleResult){
        console.log('findPv')
        var goodsId = _.pluck(docs, '_id');
        var condition = {
            type: 'goods',
            sourceId: {
                $in: goodsId
            },
            dateString: 'total'
        }
        DailyRecord.find(condition, function(err, result){
            if (err){
                final(docs, saleResult, {})
            } else {
                var map = {}
                _.each(result, function(o){
                    map[o.sourceId] = {
                        pv: o.ext.total,
                        uv: o.ext.openIds.length
                    }
                })
                final(docs, saleResult, map)
            }
        });
    }

    var final = function(docs, saleResult, pvResult){
        console.log('final')
        _.each(docs, function(o){
            var dailyP = {
                pv: 0,
                uv: 0
            }
            if (pvResult[o._id.toString()]){
                dailyP.pv = pvResult[o._id.toString()].pv
                dailyP.uv = pvResult[o._id.toString()].uv
            }
            o.pv = dailyP.pv;
            o.uv = dailyP.uv;
            o.saleCount = saleResult[o._id];
            delete o._id
        })

        var result = []
        _.each(docs, function(o){
            result.push('名字:' + o.name + '   库存:' + o.count + '    pv/uv:' + o.pv + '/' + o.uv + '    销量:' + o.saleCount)
        })
        fs.writeFileSync('dumpGoods.txt', JSON.stringify(result, null, 4))
        console.log('save success');
        exit()
    }
    findGoods()
}

setTimeout(function(){
    exportGoods()
}, 5000)

function exit(){
    setTimeout(function(){
        process.exit()
    }, 2000)
}