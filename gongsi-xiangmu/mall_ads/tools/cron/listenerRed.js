/**
 * Created by chenjie on 2015/7/23.
 */

/**
 * Created by chenjie on 2015/7/14.
 */

var _ = require('underscore');
var CronJob     = require('cron').CronJob;
var tools       = require('../../tools');
var wxInfo = require('../../interface/wxInfo.js');
var config = require('../../config');
var mPreRedRedis = require('../../redPager/preRedRedis.js');

new CronJob('0 0 */1 * * *', function(){
    console.log(new Date().getTime())
    mPreRedRedis.getPreCount(function(err, count){
        mPreRedRedis.getLength(function(err, num){
            wxInfo.pushErrorMsg('env: ' + config.NODE_ENV + '\n' + '1元红包: 预创建数量: ' + count + ', 当前总数: ' + num)
        });
    })
}, null, true)
