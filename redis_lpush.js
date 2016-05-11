/**
 * Created by wyq on 2015/7/30.
 */

var redis = require('redis');

var redisClient = redis.createClient(6379, '127.0.0.1');

var doc ={
    "yyyappId" : "wx33dc1a5264b4e846",
    "tvmId" : "13522414321",
    "state" : 2,
    "prize" : {
        "id" : "55a5cf74199a124b0fc5252b",
        "type" : 1,
        "name" : "iphone5s 手机（实物）",
        "pic" : "http://mall.mtq.tvm.cn/pic/20150715111145-13399-1wm9tpq.jpg",
        "rate" : "2"
    },
    "user" : {
        "name" : "wpmma",
        "icon" : "undefined",
        "openId" : "onC35t7iHt1ZmirLlzou3cQE1B6g",
        "realIp" : "192.168.1.1"
    },
    "sysLotteryID" : "55a5d4169daaac4d0f9ea045",
    "createTime": "2015-01-01 12:12:12"

};

redisClient.lpush("yyylotterystatistics", JSON.stringify(doc), function (err, res) {
    console.log("*********************** err: %j, res: %j", err, res);
});


/*
function noop(){
    console.log("*********uncaughtException************");
}
process.on('uncaughtException', noop);

var doc = {
    key: '55a5d3bb6c73b05a1f2aaf49',
    allUsersLength: 20,
    createTime: new Date().toLocaleString()
};

function test() {
    redisClient.lpush('countSysLottery', JSON.stringify(doc), function(err, res) {
        console.log("arguments: %j", arguments);
        throw new Error();
    });
}

test();
*/