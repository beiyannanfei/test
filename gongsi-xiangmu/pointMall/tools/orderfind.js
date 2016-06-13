/**
 * Created by Administrator on 2015/1/4.
 */


var models = require('../models/index');
var _ = require('underscore');
var WxOrder     = models.WxOrder;

var condition = {
    /*mallToken: "7ce7aca30811",*/
    token: "7ce7aca30811",
    dateTime: {
        $gt: new Date(2015, 4, 18, 13, 29, 0),
        $lt: new Date(2015, 6, 31, 23, 59, 0)
    },
    payResult: {
        $exists: true
    },
    reFundResult: {
        $exists: false
    }
}
WxOrder.find(condition, function(err, docs){
    console.log('total:' + docs.length)
    var fee = 0
    var map = {}
    _.each(docs, function(o){
        if (o.payResult && o.payResult.total_fee){
            if (!map[o.goodsId]){
                map[o.goodsId] = {count: 0, fee: 0}
            }
            map[o.goodsId].fee += parseInt(o.payResult.total_fee) / 100
            map[o.goodsId].count += 1
            fee += parseInt(o.payResult.total_fee) / 100
        }
    })
    console.log('fee:' + fee)
    console.log(map)
})