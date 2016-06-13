/**
 * Created by chenjie on 2015/1/27.
 */

var _ = require('underscore');
var async = require('async');
var tools = require('../../tools');
var redisClient = tools.redisClient();
redisClient.select(5, function() {
    console.log('抽奖程序切换到database 5');
});

var redisClientRed = tools.redisClient();
redisClientRed.select(6, function() {
    console.log('抢红包切换到database 6');
});

var fs = require('fs')
process.maxTickDepth = Number.MAX_VALUE;

function importRedisData(){
    var text = fs.readFileSync('temp/lottery-redis.json')
    var objects = JSON.parse(text)
    var i = 0
    _.each(objects, function(o){
        redisClient.set(o.key, o.value, function(err, values){
            if (err){
                console.log('import lottery redis err:', err)
            }
            i++
            console.log(objects.length + ',cur:' + i)
        })
    })

    var text1 = fs.readFileSync('temp/red-redis.json')
    var objects1 = JSON.parse(text1)
    var j = 0
    _.each(objects1, function(o){
        redisClientRed.set(o.key, o.value, function(err, values){
            if (err){
                console.log('import red redis err:', err)
            }
            console.log(objects1.length + ',cur:' + j)
        })
    })
}

setTimeout(function(){
    importRedisData();
}, 5000)

