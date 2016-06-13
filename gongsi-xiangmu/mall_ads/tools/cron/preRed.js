/**
 * Created by chenjie on 2015/7/14.
 */

var _ = require('underscore');
var CronJob     = require('cron').CronJob;
var tools       = require('../../tools');
var wxInfo = require('../../interface/wxInfo.js');
var async = require('async')
var config = require('../../config');
var queueClient = tools.queueRedis();

var mWxRed = require('../../routes/wxRed.js');
var mPreRedRedis = require('../../redPager/preRedRedis.js');

//qq prod
var number = 10
var yyyappId = 'wx33dc1a5264b4e846'
if (config.NODE_ENV == 'dev'){
    yyyappId = 'wxddd09c59c4c73c99'
    number = 10
} else if (config.NODE_ENV == 'qa'){
    yyyappId = 'wx44490bbc768ce355'
    number = 10
} else {
    number = 0
}

var wxPrize = {
    yyyappId: yyyappId,
    name: '1元红包',
    wxredParam: {
        "send_name" : "天脉聚源",
        "hb_type" : "NORMAL",   //普通红包
        "total_amount" : 100,   //单位分
        "total_num" : 1,
        "wishing" : "恭喜发财",
        "act_name" : "摇一摇抽大奖",
        "remark" : "摇一摇抽大奖"
    }
};
var running = false;
var notiStop = false;

process.on('uncaughtException', function (err) {
    console.log("[%j]: file: %j * uncaughtException * err: %j", new Date().toLocaleString(), __filename, err);
    running = false;
    notiStop = false;
});

function checkNum(){
    mPreRedRedis.getLength(function(err, num){
        if (err){
            wxInfo.pushErrorMsg('mPreRedRedis getLength err')
            running = false
        } else {
            if (num < number){
                var arr = []
                for (var i = num; i < number; i++){
                    arr.push(i)
                }
                async.eachSeries(arr, function(o, done){
                    if (notiStop){
                        return done()
                    }
                    mWxRed.createwxredAndLotteryInner(wxPrize, function(err, id){
                        if (err){
                            wxInfo.pushErrorMsg('checkNum err:' + err)
                        }
                        if (id){
                            console.log('mPreRedRedis push id:' + id)
                            mPreRedRedis.push(id)
                        }
                        done()
                    })
                }, function(err){
                    running = false
                })
            } else {
                running = false
            }
        }
    })
}

new CronJob('*/5 * * * * *', function(){

    if (running){
        return;
    } else {
        running = true
    }

    console.log(new Date().getTime())
    console.log(running)
    mPreRedRedis.getPreCount(function(err, count){
        console.log('getPreCount:' + count)
        if (count){
            number = parseInt(count, 10)
        } else {
            number = 0
        }
        checkNum()
    })
}, null, true)

function pop(){
    queueClient.BRPOP('notiKaijiang', 0, function(err, data){
        queueClient.del('notiKaijiang')
        notiStop = true
        setTimeout(function(){
            console.log('timeout end')
            notiStop = false
            pop()
        }, 30 * 1000)
    })
}
pop()
