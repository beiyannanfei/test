var tools       = require('../index');
var redisClient = tools.redisBlackListClient();
var _           = require('underscore');
var CronJob     = require('cron').CronJob;


redisClient.select(2, function () {
});

var config = {
    'lottery':[
        {interval:1,setName:'lotteryHacker',threshold:10},
        {interval:10,setName:'lotteryHacker',threshold:20}
    ],
    'integral':[
        {interval:1,setName:'integralHacker',threshold:10000},
        {interval:10,setName:'integralHacker',threshold:20000}
    ]
};


_.each(config,function(infos, key) {
    _.each(infos,function(info,index) {
        new CronJob('0 */' + info.interval +' * * * *', function(){
            console.log('blacklistScan')
            redisClient.zrangebyscore(info.setName,info.threshold,'+inf',function(err,replies) {
                if(replies && replies.length > 0){
                    _.each(replies,function(openId) {
                        redisClient.zrem(info.setName,openId);
                        console.log('将' + openId + ' 加入黑名单');
                        if(info.setName === 'lotteryHacker')
                            redisClient.setex(openId,6*60*60,'抽奖被封');
                        else if(info.setName === 'integralHacker')
                            redisClient.setex(openId,6*60*60,'加积分被封');
                    });
                }
                if(index === 1) {
                    redisClient.zremrangebyrank(info.setName,0,-1,function(err,reply) {
                        console.log('10分钟重置');
                        console.log(reply);
                    });
                }
            });
        }, null,true);
    })
});




