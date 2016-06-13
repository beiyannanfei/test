/**
 * Created by chenjie on 2015/6/8.
 */
var dbUtils = require('../mongoSkin/mongoUtils.js')
var mallCardCollection = new dbUtils('mallCard')

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
    mallCardCollection.find(condition, function(err, docs){
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
    mallCardCollection.findById(mallCardId, function (err, doc) {
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
    mallCardCollection.updateById(id, {$set: {state: state}}, function (err, doc) {
        if (err) {
            return res.send(500, 'mongodb error');
        }
        callback()
    })
}
