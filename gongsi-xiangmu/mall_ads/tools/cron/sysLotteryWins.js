/**
 * Created by luosm on 2015/7/13.
 * �齱��Ϣ
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
var AdvanceTimes      = 1000*10;  //��ǰ�೤ʱ�俪��ms

//�����߼�����
var isContinuation=false;

function TVMLottery(){
    sysLotteryRedis.HGETALL("sysLotteryDataKeys",function(err,lotterys){
        _.each(lotterys,function(lottery,key){
            lottery=JSON.parse(lottery)
            lottery.end = parseInt(lottery.end, 10)
            console.log(lottery.key + ':start time:' + new Date(lottery.end))
            console.log('cur time:' + new Date())
            console.log('lottery time:' + (new Date(lottery.end).getTime() - new Date().getTime()))
            if (new Date().getTime() - lottery.end > 10 * 60 * 1000){ //����10��֮δ���� �Ͳ��ٿ���
                sysLotteryRedis.HDEL("sysLotteryDataKeys",key,function(err,hdelresult){
                    console.log(err);
                    console.log(hdelresult);
                });
            }else if(lottery.end<=(new Date().getTime())+AdvanceTimes){//ϵͳ�齱��ǰ10s����
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
    //���û������в鵽�����û���Ϣ
    sysLotteryRedis.HGETALL(lottery.key,function(err,users){
        _.each(users,function(user){
            //�μӱ��γ齱������
            lottery.users.push(JSON.parse(user));
        });
        console.log("�μӱ��γ齱������:"+lottery.users.length);
        //�ֽ�齱
        if(lottery.type==1){
            createwinlotteryUsersAndNot(lottery,function(){

            });
        }
    });
}
//���ó齱�û�
function createwinlotteryUsersAndNot(lottery){
    //���γ齱�������û�
    var users=lottery.users;
    //��Ʒ�ȼ���Ϣ
    var lottMoney=lottery.money;
    //���γ齱��Ա�ܽ��
    var totalMoney=users.length*lottMoney.average;
    //���γ齱ʵ�ʿ����ܽ��
    lottMoney.total=totalMoney>lottMoney.max?lottMoney.max:totalMoney;
    //ʣ����
    lottMoney.SurplusTotal=lottMoney.total;
    //�������н���Ϣ
    _.each(lottMoney.info,function(moneyPrize){
        //percent �ٷֱȵ����н�
        if(moneyPrize.type=="p"){
            moneyPrize.newCount=Math.floor(users.length*moneyPrize.count/100);
        }
        else if(moneyPrize.type=="c"){
            moneyPrize.newCount=moneyPrize.count;
        }
        //��֤�߼��н�����
        if(moneyPrize.newCount>0){
            //���õ��������߼����
            moneyPrize.total=lottMoney.total*moneyPrize.percent/100;
            //�˾������� ����2λС��
            var personalMoney=Math.round(moneyPrize.total/moneyPrize.newCount*100)/100;
            //���С��1Ԫ ������������ ÿ��1Ԫ
            if(personalMoney<1){
                //����ȡ�����
                moneyPrize.newTotal=Math.floor(moneyPrize.total);
                //�н���������
                moneyPrize.newCount=moneyPrize.newTotal;
            }
        }
    });
}