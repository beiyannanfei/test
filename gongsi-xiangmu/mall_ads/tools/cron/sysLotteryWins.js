/**
 * Created by luosm on 2015/7/13.
 * 抽奖信息
 */
var _                 = require('underscore');
var tools             = require('../../tools');
var sysLotteryRedis   = tools.sysLotteryRedis();
var redisCache        = require("../../dal/redis_cache.js");
var orders            = require("../../routes/orders.js");
var typeConfig        = require('../../routes/typeConfig.js');
var dbUtils           = require('../../mongoSkin/mongoUtils.js');
var mWxRed            = require('../../routes/wxRed.js');
var prizeCollection   = new dbUtils('prize');
var AdvanceTimes      = 1000*10;  //提前多长时间开奖ms

//延续高级奖池
var isContinuation=false;

function TVMLottery(){
    sysLotteryRedis.HGETALL("sysLotteryDataKeys",function(err,lotterys){
        _.each(lotterys,function(lottery,key){
            lottery=JSON.parse(lottery)
            lottery.end = parseInt(lottery.end, 10)
            console.log(lottery.key + ':start time:' + new Date(lottery.end))
            console.log('cur time:' + new Date())
            console.log('lottery time:' + (new Date(lottery.end).getTime() - new Date().getTime()))
            if (new Date().getTime() - lottery.end > 10 * 60 * 1000){ //超过10分之未开奖 就不再开奖
                sysLotteryRedis.HDEL("sysLotteryDataKeys",key,function(err,hdelresult){
                    console.log(err);
                    console.log(hdelresult);
                });
            }else if(lottery.end<=(new Date().getTime())+AdvanceTimes){//系统抽奖提前10s结束
                console.log('do lottery')
                toOrder(lottery);
                sysLotteryRedis.HDEL("sysLotteryDataKeys",key,function(err,hdelresult){
                });
            }
        });
    });
}
TVMLottery();
/*
setInterval(function(){
    TVMLottery();
},1000)*/


function toOrder(lottery){
    //在用户集合中查到所有用户信息
    sysLotteryRedis.HGETALL(lottery.key,function(err,users){
        _.each(users,function(user){
            //参加本次抽奖的人数
            lottery.users.push(JSON.parse(user));
        });
        console.log("参加本次抽奖的人数:"+lottery.users.length);
        //现金抽奖
        if(lottery.type==1){
            createwinlotteryUsersAndNot(lottery,function(){

            });
        }
    });
}
//设置抽奖用户
function createwinlotteryUsersAndNot(lottery){
    //单次抽奖的所有用户
    var users=lottery.users;
    //奖品等级信息
    var lottMoney=lottery.money;
    //单次抽奖人员总金额
    var totalMoney=users.length*lottMoney.average;
    //单次抽奖实际可用总金额
    lottMoney.total=totalMoney>lottMoney.max?lottMoney.max:totalMoney;
    //剩余金额
    lottMoney.SurplusTotal=lottMoney.total;
    //遍历所有奖信息
    _.each(lottMoney.info,function(moneyPrize){
        //percent 百分比的人中奖
        if(moneyPrize.type=="p"){
            moneyPrize.newCount=Math.floor(users.length*moneyPrize.count/100);
        }
        else if(moneyPrize.type=="c"){
            moneyPrize.newCount=moneyPrize.count;
        }
        //验证逻辑中奖人数
        if(moneyPrize.newCount>0){
            //设置单个奖项逻辑金额
            moneyPrize.total=lottMoney.total*moneyPrize.percent/100;
            //人均红包金额 保留2位小数
            var personalMoney=Math.round(moneyPrize.total/moneyPrize.newCount*100)/100;
            //如果小于1元 优先人数发放 每人1元
            if(personalMoney<1){
                //向下取整金额
                moneyPrize.newTotal=Math.floor(moneyPrize.total);
                //中奖人数更新
                moneyPrize.newCount=moneyPrize.newTotal;
            }
        }
    });
}