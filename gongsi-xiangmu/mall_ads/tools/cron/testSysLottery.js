/**
 * Created by luosm on 2015/7/16.
 */
var _                 = require('underscore');
var redis             = require('redis');
var sysLotteryRedis   = redis.createClient("6380", "10.20.30.67");
var typeConfig        = {
    prizeType: {goods: 1, card: 2, link: 3, wxcard: 101, wxred: 102},
    orderType: {Delivered:1,NonDelivery:2,Complete:3,Refund:4},
    sysLotteryType: {common:0,money:1}
}

function pop(){
    sysLotteryRedis.HGETALL("sysLotteryDataKeys_test",function(err,lotterys){
        console.log(lotterys)
        _.each(lotterys,function(lottery,key){
            lottery=JSON.parse(lottery)
            lottery.end = parseInt(lottery.end, 10)
            toOrder(lottery);
        })
    });
}
pop();


function toOrder(lottery){
    var t1=(new Date()).getTime();
    console.log("start get users")
    sysLotteryRedis.HGETALL(lottery.key,function(err,doc){
        var t2=(new Date()).getTime();
        console.log("t2 "+(t2-t1));
        _.each(doc,function(user){
            lottery.users.push(JSON.parse(user));
        });
        var t3=(new Date()).getTime();
        console.log("t3 "+(t3-t2));
        //lottery.users=lottery.users.splice(0,10)
        console.log(lottery.users.length)
        //return;
        //console.log(lottery.users);
        if(lottery.money || lottery.type==1){ //现金抽奖
            //参与抽奖的总人数 lottery.users.length
            //distributionMoney(winUsers,lottery);
            createwinlotteryUsersAndNot(lottery,function(winusers,users){
                distributionMoneyAll(winusers,users,lottery);
            })
            //distributionMoneyAll()
        }else{ //其他抽奖
            //中奖人
            var winUsers=createwinlotteryUsers(lottery.users,lottery.winCount);
            distributionPrize(winUsers,lottery,lottery.prizes);
        }
    });

}

/*
 * 产生中奖用户 由shuffle函数随机排列
 */
function createwinlotteryUsers(users,count){
    if(count<=users.length){
        for(var i=0;i<10;i++) { //顺序打乱10次
            users = _.shuffle(users)
        }
        var winUsers=users.splice(0,count);
        //中奖用户 存入集合 和 订单
        return winUsers;
    }else{
        return users;
    }
}


function createwinlotteryUsersAndNot(lottery,cb){
    var t1=(new Date()).getTime();
    var users=lottery.users;
    var lottMoney=lottery.money;
    var winCount=0;
    //人均金额需要 小于等于1
    lottMoney.average=lottMoney.average>=1?1:lottMoney.average;
    var totalMoney=lottery.users.length*lottMoney.average;
    lottMoney.total=totalMoney>lottMoney.max?lottMoney.max:totalMoney;
    lottMoney.SurplusTotal=lottMoney.total;
    _.each(lottMoney.info,function(prizeinfo){
        //prizeinfo.count 中奖人数
        //console.log(Math.floor(users.length*prizeinfo.count/100));
        console.log("prizeinfo.type:"+prizeinfo.type);
        if(prizeinfo.type=="p"){ //percent
            prizeinfo.newCount=Math.floor(users.length*prizeinfo.count/100);
        }
        else if (prizeinfo.type ==undefined ||prizeinfo.type=="c"){
            prizeinfo.newCount=prizeinfo.count;//Math.floor(users.length*prizeinfo.count/100);
        }
        if(prizeinfo.newCount>0){
            prizeinfo.total=lottMoney.total*prizeinfo.percent/100; //每个奖项共有多少钱
            //计算平均每个人多少钱
            var usermoney=(prizeinfo.total/prizeinfo.newCount).toFixed(2)>4999?
                4999:(prizeinfo.total/prizeinfo.newCount).toFixed(2);
            console.log("usermoney:"+usermoney);
            if(usermoney<1){ //小于1块钱 的时候 优先发一元
                //中奖人数 由 100 减到 50
                prizeinfo.newTotal=Math.floor(prizeinfo.total);
                prizeinfo.newCount=prizeinfo.newTotal;
                prizeinfo.userMoney=1;
            }else{
                prizeinfo.userMoney=usermoney;
            }

            if(prizeinfo.redMax){//红包金额上限  0 或者不设置  就表示没有上限
                prizeinfo.userMoney=prizeinfo.redMax;
                // 红包金额                 人数              当前奖项总金额
                if(prizeinfo.userMoney*prizeinfo.newCount>prizeinfo.total){
                    prizeinfo.newCount=Math.floor(prizeinfo.total/prizeinfo.userMoney);
                }
            }
            winCount+=parseInt(prizeinfo.newCount,10);
        }

    });
    for(var i=0;i<10;i++) { //顺序打乱10次
        users = _.shuffle(users);
    }
    console.log("winCount"+winCount);
    var winUsers=users.splice(0,winCount);
    console.log("winUsers.length "+winUsers.length);
    console.log("users.length "+ users.length);
    var t2=(new Date()).getTime();
    console.log("createwinlotteryUsersAndNot t2 "+(t2-t1))

    cb(winUsers,users);
}

/*
 * 分发奖品
 * */
function distributionPrize(users,lottery,LotteryPrizes){
    var userIndex=0;
    var prizeListUsers=[];
    //console.log(LotteryPrizes);
    _.each(LotteryPrizes,function(prize){
        getPrizeCount(prize,function(err,inventories){
            if(err){
                console.log("getPrizeCount"+err);
            }else{
                var canUsePrizeCount=prize.count;
                var prizeUsers=[];
                //console.log("canUsePrizeCount"+canUsePrizeCount);
                for(var i=0;i<canUsePrizeCount;i++){
                    //prizelist.push({id:prize.id,rate:prize.rate,img:"img"});
                    var currentUser=users[userIndex];
                    //currentUser.selfIndex=userIndex;
                    //console.log("currentUser");
                    //console.log(currentUser);
                    if(currentUser){
                        currentUser.prize=prize;
                        winUser={
                            yyyappId: "aaaaaaaaaaaaaaa",
                            tvmId:"111111111111",
                            //实物订单为未发货  其他订单都为完成状态即已发货
                            state:(prize.type == typeConfig.prizeType.goods)?
                                typeConfig.orderType.NonDelivery:typeConfig.orderType.Delivered,
                            prize: {
                                id: prize.id,
                                type: prize.type,
                                name: prize.name,
                                pic: prize.pic,
                                rate:prize.rate,
                                expiredDay:prize.expiredDay
                            },
                            user:{
                                name:"username",
                                icon:"usericon",
                                openId:"useropenid"
                            },
                            dateTime: new Date().getTime(),
                            sysLotteryID:lottery.key.toString(),
                            _id: "aaaaaaaaaaaaaaaaaaaaaaaa",
                            queueDataCollection: 'order'
                        };
                        //进入订单后 保证奖品正确性后 再放入redis
                        (function(prize,currentUser){
                            sysLotteryRedis.HSET(lottery.key+"wins",
                                currentUser.openId,
                                JSON.stringify(winUser),function(err,doc){
                                    console.log("to redis wins "+doc)
                                });
                        })(prize,currentUser);
                    }
                    else{
                        break;
                    }
                    userIndex++;
                }
                prizeListUsers.push(prizeUsers);
            }
        });
    });
    //console.log("lottery win users")
    //console.log(JSON.stringify(prizeListUsers));
}



function distributionMoney(winUsers,lottery){
    console.log("distributionMoney")
    var lottMoney=lottery.money;
    //人均金额需要 小于等于1
    lottMoney.average=lottMoney.average>=1?1:lottMoney.average;
    var totalMoney=lottery.users.length*lottMoney.average;
    lottMoney.total=totalMoney>lottMoney.max?lottMoney.max:totalMoney;
    //console.log("lottMoney.total "+lottMoney.total);
    //
    _.each(lottMoney.info,function(prize){ /* name:"一等奖",percent:0.15, count:10 */
        //console.log("prize "+JSON.stringify(prize))
        for(var i=0;i<prize.newCount;i++){
            var winUser=winUsers.pop();
            if(winUser){
                prize.total=lottMoney.total*prize.percent/100;
                /*usermoney 1-4999*/
                var usermoney=1;//(prize.total/prize.newCount).toFixed(2)>4999?
                //4999:(prize.total/prize.newCount).toFixed(2);

                if(prize.newTotal){
                    usermoney=1;
                }
                usermoney=prize.userMoney;
                usermoney=usermoney>4999?4999:usermoney;
                usermoney=usermoney<1?1:usermoney;
                //console.log("usermoney "+usermoney);
                winUser.money={rate:prize.rate,name:usermoney+"现金红包",money:usermoney,pic:prize.pic};
                (function(winUser){
                    var redPrize={
                        yyyappId: lottery.yyyappId,
                        name: "现金红包",
                        wxredParam: {
                            "send_name" : lottery.send_name,
                            "hb_type" : "NORMAL",   //普通红包  lottery.send_name
                            "total_amount" : winUser.money.money*100,   //单位分
                            "total_num" : 1,
                            "wishing" : "恭喜发财",
                            "act_name" : "微信10周年",
                            "remark" : "恭喜发财"
                        }
                    }
                    sysLotteryRedis.HSET(lottery.key+"wins",
                        winUser.openId,
                        JSON.stringify(winUser),function(err,doc){
                            //console.log("HSET")
                        });
                })(winUser)
            }
        }
    });
}

/*
 * 中奖用户发红包 未中奖的发卡券
 * */
function distributionMoneyAll(winUsers,user,lottery){
    distributionMoney(winUsers,lottery);//中奖的发红包
    console.log("------------------------------------------------------------------------")
    console.log("lottery.money && lottery.money.prizes: "+ (lottery.money && lottery.money.prizes));
    if(lottery.money && lottery.money.prizes){
        console.log("lottery.money.prizes"+JSON.stringify(lottery.money.prizes))
        //console.log(user);
        console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
        distributionPrize(user,lottery,lottery.money.prizes); //未中奖的发普通奖品 比如卡券
    }
}

/*
 在同时进行多个抽奖的时候
 会有多发奖品的可能
 这个函数只能保证单个抽奖不发超奖品
 */
function getPrizeCount(prize,cb){
    return cb(null,null);
}
