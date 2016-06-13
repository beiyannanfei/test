/**
 * Created by luosm on 2015/7/7.
 * 定时获取最近的100条订单信息
 * 放到redis中
 */

var CronJob     = require('cron').CronJob;
var _                 = require('underscore');
var dbUtils           = require('../../mongoSkin/mongoUtils.js')
var ordersCollection  = new dbUtils('order');
var moment            = require('moment');
var tools             = require('../../tools');
var redisClient       = tools.redisClient();
redisClient.select(0, function() {
    console.log('百条订单 database 0');
});

function getOrders(){
    //倒序 100条
    ordersCollection.find({},{},{sort: {dateTime: -1},limit:100},function(err,doc){
        if(err){

        }else{
            var someOrders=[];
            _.each(doc,function(order){
                if(order.user){
                    var u={
                        name:order.user.name,
                        icon:order.user.icon
                    };
                    if (order.prize){
                        u.prize = order.prize.name
                    } else if (order.money){
                        u.prize = order.money.name
                    } else {
                        u.prize = '奖品'
                    }
                    if(!checkUsers(someOrders,u)){
                        someOrders.push(u);
                    }
                }else{
                    console.log("order.user")
                    console.log(order.user)
                }
            });
            if(someOrders.length>0){
                redisClient.set("someOrders", JSON.stringify(someOrders));
            }
        }
    })
}
//getOrders();

new CronJob('0 5 * * * *', function(){
    getOrders();
}, null, true)

function checkUsers(someOrders,u){
    return _.find(someOrders,function(user){return user.name== u.name});
}

/*
redisClient.ZINCRBY("tvmidorders",1,"tvmid15011",function(err,doc){
    console.log(err);
    console.log(doc);
});
*/
