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
        if(lottery.money || lottery.type==1){ //�ֽ�齱
            //����齱�������� lottery.users.length
            //distributionMoney(winUsers,lottery);
            createwinlotteryUsersAndNot(lottery,function(winusers,users){
                distributionMoneyAll(winusers,users,lottery);
            })
            //distributionMoneyAll()
        }else{ //�����齱
            //�н���
            var winUsers=createwinlotteryUsers(lottery.users,lottery.winCount);
            distributionPrize(winUsers,lottery,lottery.prizes);
        }
    });

}

/*
 * �����н��û� ��shuffle�����������
 */
function createwinlotteryUsers(users,count){
    if(count<=users.length){
        for(var i=0;i<10;i++) { //˳�����10��
            users = _.shuffle(users)
        }
        var winUsers=users.splice(0,count);
        //�н��û� ���뼯�� �� ����
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
    //�˾������Ҫ С�ڵ���1
    lottMoney.average=lottMoney.average>=1?1:lottMoney.average;
    var totalMoney=lottery.users.length*lottMoney.average;
    lottMoney.total=totalMoney>lottMoney.max?lottMoney.max:totalMoney;
    lottMoney.SurplusTotal=lottMoney.total;
    _.each(lottMoney.info,function(prizeinfo){
        //prizeinfo.count �н�����
        //console.log(Math.floor(users.length*prizeinfo.count/100));
        console.log("prizeinfo.type:"+prizeinfo.type);
        if(prizeinfo.type=="p"){ //percent
            prizeinfo.newCount=Math.floor(users.length*prizeinfo.count/100);
        }
        else if (prizeinfo.type ==undefined ||prizeinfo.type=="c"){
            prizeinfo.newCount=prizeinfo.count;//Math.floor(users.length*prizeinfo.count/100);
        }
        if(prizeinfo.newCount>0){
            prizeinfo.total=lottMoney.total*prizeinfo.percent/100; //ÿ������ж���Ǯ
            //����ƽ��ÿ���˶���Ǯ
            var usermoney=(prizeinfo.total/prizeinfo.newCount).toFixed(2)>4999?
                4999:(prizeinfo.total/prizeinfo.newCount).toFixed(2);
            console.log("usermoney:"+usermoney);
            if(usermoney<1){ //С��1��Ǯ ��ʱ�� ���ȷ�һԪ
                //�н����� �� 100 ���� 50
                prizeinfo.newTotal=Math.floor(prizeinfo.total);
                prizeinfo.newCount=prizeinfo.newTotal;
                prizeinfo.userMoney=1;
            }else{
                prizeinfo.userMoney=usermoney;
            }

            if(prizeinfo.redMax){//����������  0 ���߲�����  �ͱ�ʾû������
                prizeinfo.userMoney=prizeinfo.redMax;
                // ������                 ����              ��ǰ�����ܽ��
                if(prizeinfo.userMoney*prizeinfo.newCount>prizeinfo.total){
                    prizeinfo.newCount=Math.floor(prizeinfo.total/prizeinfo.userMoney);
                }
            }
            winCount+=parseInt(prizeinfo.newCount,10);
        }

    });
    for(var i=0;i<10;i++) { //˳�����10��
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
 * �ַ���Ʒ
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
                            //ʵ�ﶩ��Ϊδ����  ����������Ϊ���״̬���ѷ���
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
                        //���붩���� ��֤��Ʒ��ȷ�Ժ� �ٷ���redis
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
    //�˾������Ҫ С�ڵ���1
    lottMoney.average=lottMoney.average>=1?1:lottMoney.average;
    var totalMoney=lottery.users.length*lottMoney.average;
    lottMoney.total=totalMoney>lottMoney.max?lottMoney.max:totalMoney;
    //console.log("lottMoney.total "+lottMoney.total);
    //
    _.each(lottMoney.info,function(prize){ /* name:"һ�Ƚ�",percent:0.15, count:10 */
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
                winUser.money={rate:prize.rate,name:usermoney+"�ֽ���",money:usermoney,pic:prize.pic};
                (function(winUser){
                    var redPrize={
                        yyyappId: lottery.yyyappId,
                        name: "�ֽ���",
                        wxredParam: {
                            "send_name" : lottery.send_name,
                            "hb_type" : "NORMAL",   //��ͨ���  lottery.send_name
                            "total_amount" : winUser.money.money*100,   //��λ��
                            "total_num" : 1,
                            "wishing" : "��ϲ����",
                            "act_name" : "΢��10����",
                            "remark" : "��ϲ����"
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
 * �н��û������ δ�н��ķ���ȯ
 * */
function distributionMoneyAll(winUsers,user,lottery){
    distributionMoney(winUsers,lottery);//�н��ķ����
    console.log("------------------------------------------------------------------------")
    console.log("lottery.money && lottery.money.prizes: "+ (lottery.money && lottery.money.prizes));
    if(lottery.money && lottery.money.prizes){
        console.log("lottery.money.prizes"+JSON.stringify(lottery.money.prizes))
        //console.log(user);
        console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
        distributionPrize(user,lottery,lottery.money.prizes); //δ�н��ķ���ͨ��Ʒ ���翨ȯ
    }
}

/*
 ��ͬʱ���ж���齱��ʱ��
 ���ж෢��Ʒ�Ŀ���
 �������ֻ�ܱ�֤�����齱��������Ʒ
 */
function getPrizeCount(prize,cb){
    return cb(null,null);
}
