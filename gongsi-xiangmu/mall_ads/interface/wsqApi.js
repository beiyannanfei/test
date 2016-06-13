/**
 * Created by chenjie on 2015/7/22.
 */

var httpUtils = require('./http-utils.js')
var config = require('../config.js')
var _ = require('underscore')

exports.postBound = function(param, cb){
    var url = config.wsqHost + '/actions/livestreamtalkpost/saveLotteryBarrage.do?'
    _.each(param, function(v, k){
        url += '&' + k + '=' + v
    })
    httpUtils.httpGetNoJson(url, cb)
}

/*var param = {
    yyyappid: "wx6fc288e6ddd63347",
    orderid: "orderId111111111111111",
    headimg: "http://wx.qlogo.cn/mmopen/Clmib55rFNCPeKibmBu6m715apzhLFGficLxM8wtR4ibmb8XZ9Id4LVcysAKrQwpHEq4mRsP01uqfNTJbohUYUliaT7sUQ95K61C3",
    nickname: "清杨",
    openid: 'openId',
    type: 102,
    prize: "53.25元现金红包",
    money: '53.25',
    prizeInfo: "红包",
    create_timestamp: 1437556628 * 1000
}
exports.postBound(param, function(){
    console.log(arguments)
})*/
