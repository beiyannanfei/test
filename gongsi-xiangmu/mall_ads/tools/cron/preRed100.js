/**
 * Created by chenjie on 2015/7/14.
 */

var _ = require('underscore');
var CronJob     = require('cron').CronJob;
var tools       = require('../../tools');
var wxInfo = require('../../interface/wxInfo.js');
var async = require('async')
var config = require('../../config');

var mWxRed = require('../../routes/wxRed.js');
var mPreRedRedis = require('../../redPager/preRedRedis.js');

//qq prod
var number = 5
var yyyappId = 'wx33dc1a5264b4e846'
if (config.NODE_ENV != 'qq'){
    yyyappId = 'wxddd09c59c4c73c99'
    number = 0
}

var wxPrize = {
    yyyappId: yyyappId,
    name: '100元红包',
    wxredParam: {
        "send_name" : "天脉聚源",
        "hb_type" : "NORMAL",   //普通红包
        "total_amount" : 10000,   //单位分
        "total_num" : 1,
        "wishing" : "恭喜发财",
        "act_name" : "摇一摇",
        "remark" : "恭喜发财"
    }
}

var running = false
function checkNum(){
    mPreRedRedis.getLength100(function(err, num){
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
                    mWxRed.createwxredAndLotteryInner(wxPrize, function(err, id){
                        if (err){
                            wxInfo.pushErrorMsg('checkNum err:' + err)
                        }
                        if (id){
                            console.log('mPreRedRedis push id:' + id)
                            mPreRedRedis.push100(id)
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
    console.log(new Date().getTime())
    if (running){
        return;
    } else {
        running = true
    }
    mPreRedRedis.getPreCount100(function(err, count){
        if (count){
            number = parseInt(count, 10)
        } else {
            number = 0
        }
        checkNum()
    })
}, null, true)
