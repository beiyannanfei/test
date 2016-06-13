/**
 * Created by chenjie on 2015/5/19.
 */

var dbUtils = require('../mongoSkin/mongoUtils.js')
var cardSkuCollection = new dbUtils('cardSku')

var wxCardApi = require('../interface/wxcardApi.js');

exports.get = function(card_id, cb){
    console.log({card_id: card_id})
    cardSkuCollection.findOne({card_id: card_id}, function(err, o) {
        if (err) {
            cb(err);
        } else {
            cb(null, o)
        }
    });
}

exports.find = function(condition, cb){
    cardSkuCollection.find(condition, cb);
}

exports.save = function(card_id, count, cb){
    cardSkuCollection.save({card_id: card_id, count: count}, cb)
}

exports.updateCount = function(card_id, count, ACCESS_TOKEN, cb){
    var param = {card_id: card_id, increase_stock_value: 0, reduce_stock_value: 0}
    if (count < 0){
        param.reduce_stock_value = -count
    } else {
        param.increase_stock_value = count
    }
    wxCardApi.modifystock(ACCESS_TOKEN, param, function(err, response){
        if (err){
            cb(err)
        } else {
            cardSkuCollection.update({card_id: card_id}, {$inc: {count: count}}, cb)
        }
    })
}

exports.incCount = function(card_id, count, cb){
    cardSkuCollection.update({card_id: card_id}, {$inc: {count: count}}, cb)
}

