/**
 * Created by chenjie on 2015/6/8.
 */

var models = require('../models/index');
var MallCard = models.MallCard;

exports.listEnableCard = function(req, res){
    var token = req.token
    var openId = req.openId;
    var condition = {
        token: token,
        openId: openId,
        startTime: {$lt: new Date()},
        endTime: {$gt: new Date()},
        state: 0
    }

    var goodsId = req.param('goodsId');
    condition.usedGoodsIds = goodsId
    console.log(condition)
    MallCard.find(condition, function(err, docs){
        if (err){
            res.send(500, err);
        } else {
            res.send(docs)
        }
    })
}

exports.midMallCardCheck = function(req, res, next){
    var mallCardId = req.param('mallCardId');
    if (!mallCardId){
        return next()
    }
    MallCard.findById(mallCardId, function (err, doc) {
        if (err) {
            return res.send(500, 'mongodb error');
        }
        if (doc){
            req.mallCard = doc;
        }
        next()
    })
}

exports.changeMallCard = function(id, state, callback){
    MallCard.findByIdAndUpdate(id, {$set: {state: state}}, function (err, doc) {
        if (err) {
            return res.send(500, 'mongodb error');
        }
        callback()
    })
}
