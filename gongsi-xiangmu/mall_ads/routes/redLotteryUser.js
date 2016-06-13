/**
 * Created by chenjie on 2015/7/5.
 */

var ut = require('./utils');
var tools       = require('../tools');
var lotteryRedisClient = tools.lotteryRedis();
lotteryRedisClient.select(4, function() {
    console.log('红包抽奖参与人数切换到database 4');
});

exports.addUser = function(req, res){
    var id = req.body.id;
    var openId = req.user.openId;
    lotteryRedisClient.HSET(id, openId, JSON.stringify(req.user), function(err){
        if (err){
            res.send(500, err)
        } else {
            res.send(200)
        }
    })
}

exports.getUser = function(id, cb){
    lotteryRedisClient.HLEN(id, function(err, count){
        if (err || !count){
            cb(0)
        } else {
            count = ut.checkPositiveInt(count)
            if (!count){
                cb(0)
            } else {
                cb(count)
            }
        }
    })
}
