/**
 * Created by luosm on 2015/7/7.
 * ��ʱ��ȡ�����100��������Ϣ
 * �ŵ�redis��
 */

var CronJob     = require('cron').CronJob;
var _                 = require('underscore');
var dbUtils           = require('../../mongoSkin/mongoUtils.js')
var ordersCollection  = new dbUtils('order');
var moment            = require('moment');
var tools             = require('../../tools');
var redisClient       = tools.redisClient();
redisClient.select(0, function() {
    console.log('�������� database 0');
});

function getOrders(){
    //���� 100��
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
                        u.prize = '��Ʒ'
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
