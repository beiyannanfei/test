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
var token = '3a59f7a4b8b28dca' //'dsbl'

function ensureTempDir(){
    var temp = 'temp'
    if (!fs.existsSync(temp)){
        fs.mkdir(temp, function(err) {
            if (err) {
                console.log('create temp dir fail:', err)
            }
        });
    }
}
ensureTempDir()

function exportRedisData(){
    redisClient.keys('*', function(err, values){
        console.log('export lottery redis starting! total key:' + values.length);
        if (err){
            console.log(err)
        } else {
            var arr = []
            var lotteryCount = 0
            _.each(values, function(k){
                if (/^lottery-/.test(k)){
                    lotteryCount++
                } else {
                    redisClient.get(k, function(err1, v){
                        if (err1){
                            console.log(err1)
                        } else {
                            arr.push({key: k, value: v})
                        }
                        console.log(arr.length + ', total:' + values.length)
                        if (arr.length == values.length - lotteryCount){
                            console.log('redis lottery success!');
                            fs.writeFileSync('temp/lottery-redis.json', JSON.stringify(arr))
                        }
                    })
                }
            })
        }
    })

    redisClientRed.keys('*', function(err, values){
        console.log('export res redis starting! total key:' + values.length);
        if (err){
            console.log(err)
        } else {
            var arr = []
            _.each(values, function(k){
                redisClientRed.get(k, function(err1, v){
                    if (err1){
                        console.log(err1)
                    } else {
                        arr.push({key: k, value: v})
                    }
                    console.log(arr.length + ', total:' + values.length)
                    if (arr.length == values.length){
                        console.log('redis red success!');
                        fs.writeFileSync('temp/red-redis.json', JSON.stringify(arr))
                    }
                })
            })
        }
    })
}

setTimeout(function(){
    exportRedisData()
}, 5000)