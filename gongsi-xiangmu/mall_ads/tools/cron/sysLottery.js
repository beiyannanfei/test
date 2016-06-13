/**
 * Created by luosm on 2015/7/6.
 * 统一抽奖信息
 */
var _ = require('underscore');
var tools = require('../../tools');
var deep_copy         = require('deepcopy');
/*var redis                = require('redis');
 var sysLotteryRedis        = redis.createClient("6379", "10.148.68.31");*/
var sysLotteryRedis = tools.sysLotteryRedis();
var sysLotteryRedis1 = tools.sysLotteryRedis();
var sysLotteryRedis2 = tools.sysLotteryRedis();
var sysLotteryRedis3 = tools.sysLotteryRedis();
var sysLotteryRedisBlack = tools.sysLotteryRedis();
var sysLotteryRedisGoods = tools.sysLotteryRedis();
var sysLotteryMoneyRedis = tools.sysLotteryMoneyRedis();
var orders = require("../../routes/orders.js");
var typeConfig = require('../../routes/typeConfig.js');
var dbUtils = require('../../mongoSkin/mongoUtils.js');
var mWxRed = require('../../routes/wxRed.js');
var prizeCollection = new dbUtils('prize')
var queueClient = tools.queueRedis();
var config = require('../../config.js');
var anaApi = require("../../interface/anaApi.js");


//延续高级奖池
var isContinuation = false;

var TVMSysLottery = {};

function pop() {

    sysLotteryRedis.HGETALL("sysLotteryDataKeys", function (err, lotterys) {
        //console.log(JSON.parse(data)) ;
        //console.log(lotterys)
        _.each(lotterys, function (lottery, key) {
            //console.log(key);
            //console.log(typeof lottery);
            lottery = JSON.parse(lottery)
            lottery.end = parseInt(lottery.end, 10)

            //放到本地内存中
            var selfLottery = _.extend({}, lottery);

            if (!TVMSysLottery[lottery.key]) {
                selfLottery.lusers = {};
                TVMSysLottery[lottery.key] = selfLottery;
            }

            console.log(lottery.key + ':start time:' + new Date(lottery.end))
            console.log('cur time:' + new Date())
            console.log('lottery time:' + (new Date(lottery.end).getTime() - new Date().getTime()))
            //超过10分钟未开奖 删除抽奖信息
            if (new Date().getTime() - lottery.end > 10 * 60 * 1000) {
                delete TVMSysLottery[lottery.key]
                sysLotteryRedis.HDEL("sysLotteryDataKeys", key, function (err, hdelresult) {
                    console.log(err);
                    console.log("10分钟未 开奖:" + hdelresult);
                });
            }

            //总抽奖时间为99s 系统抽奖提前20s结束
            else if (lottery.end <= (new Date().getTime()) + 1000 * 15) {
                queueClient.rpush('notiKaijiang', true);
                console.log('do lottery');
                sysLotteryRedis.HLEN(lottery.key + "allUsers", function (err, doc) {
                    if (err) {
                        console.log("allUsers length err" + err);
                    }
                    var tt = _.extend({}, TVMSysLottery[lottery.key]);
                    delete TVMSysLottery[lottery.key]
                    anaApi.getUV(tt.tvmId, tt.createTime, function (err, num) {
                        if (err) {
                            tt.allUsersLength = doc;
                        }
                        if (_.isNumber(num) && num > 0) {
                            tt.allUsersLength = num;
                        } else {
                            tt.allUsersLength = doc;
                        }
                        toOrder2(tt);
                        (function (tt, lottery, key) {
                            sysLotteryRedis.HDEL("sysLotteryDataKeys", key, function (err, hdelresult) {
                                //var tt1 = _.extend({}, tt);
                                var tt1 =deep_copy(tt);// deepCopy(tt); //deepcopy后 prizes会从数组变成对象
                                tt1.winsUsersLength = tt1.users.length;
                                delete tt1.users;
                                delete tt1.lusers;
                                if(tt1.money && tt1.money.prizes){
                                    _.each(tt1.money.prizes,function(prize){
                                        delete prize.prizeUser;
                                    });
                                }
                                //120s后开始统计
                                (function (tt1) {
                                    setTimeout(function () {
                                        console.log("tt1:"+JSON.stringify(tt1));
                                        //存储开奖信息
                                        sysLotteryRedis.lpush("countSysLottery", JSON.stringify(tt1));
                                    }, 1000 * 120);
                                })(tt1)
                                sysLotteryRedis.HSET("sysLotteryDataKeys_noWin", key,
                                    JSON.stringify(tt1), function (err, doc) {
                                    });
                            });
                        })(tt, lottery, key);
                    });
                });
            }
        })
    });
}
pop();


setInterval(function () {
    pop();
}, 1000)

setInterval(function () {
    getSysLotteryUsers();
}, 2000)


//
function toOrder(lottery) {
    var t1 = (new Date()).getTime();
    console.log("start get users")
    sysLotteryRedis.HGETALL(lottery.key, function (err, doc) {
        var t2 = (new Date()).getTime();
        console.log("t2 " + (t2 - t1));
        _.each(doc, function (user) {
            lottery.users.push(JSON.parse(user));
        });
        var t3 = (new Date()).getTime();
        console.log("t3 " + (t3 - t2));
        //lottery.users=lottery.users.splice(0,10)
        console.log(lottery.users.length)
        //return;
        //console.log(lottery.users);
        if (lottery.money || lottery.type == 1) { //现金抽奖
            //参与抽奖的总人数 lottery.users.length
            //distributionMoney(winUsers,lottery);
            createwinlotteryUsersAndNot(lottery, function (winusers, users) {
                distributionMoneyAll(winusers, users, lottery);
            })
            //distributionMoneyAll()
        } else { //其他抽奖
            //中奖人
            var winUsers = createwinlotteryUsers(lottery.users, lottery.winCount);
            distributionPrize(winUsers, lottery, lottery.prizes);
        }
    });

}

function toOrder2(lottery) {
    console.log(JSON.stringify(lottery));
    console.log("geted users")
    console.log(lottery.users.length)
    console.log("geted users splice")
    //只取10000人 其余人中其他奖品  防止有人刷接口添加人
    lottery.users = _.shuffle(lottery.users);
    lottery.users=lottery.users.splice(0,10000);
    console.log(lottery.users.length)
    if (lottery.money || lottery.type == 1) { //现金抽奖
        createwinlotteryUsersAndNot(lottery, function (winusers, users) {
            distributionMoneyAll(winusers, users, lottery);
        })
        //distributionMoneyAll()
    } else { //其他抽奖
        //中奖人
        var winUsers = createwinlotteryUsers(lottery.users, lottery.winCount);
        distributionPrize(winUsers, lottery, lottery.prizes);
    }
}

/*
 * 产生中奖用户 由shuffle函数随机排列
 */
function createwinlotteryUsers(users, count) {
    if (count <= users.length) {
        users = _.shuffle(users)

        /*for(var i=0;i<10;i++) { //顺序打乱10次

         }*/
        var winUsers = users.splice(0, count);
        //中奖用户 存入集合 和 订单
        return winUsers;
    } else {
        return users;
    }
}

function getSysLotteryUsers() {
    _.each(TVMSysLottery, function (lottery) {
        (function (lottery) {
            sysLotteryRedis1.HGETALL(lottery.key, function (err, doc) {
                _.each(doc, function (user) {
                    var u = JSON.parse(user);
                    if (!lottery.lusers[u.openId]) {
                        lottery.lusers[u.openId] = "a";
                        console.log("push " + u);
                        lottery.users.push(u);
                    }
                    sysLotteryRedis2.HDEL(lottery.key, u.openId, function (err, hdelresult) {
                        sysLotteryRedis3.HSET(lottery.key + "readyusers", u.openId,
                            JSON.stringify(u),
                            function (err, hdelresult) {

                            })
                    })
                });
            });
        })(lottery)
    })
}

function createwinlotteryUsersAndNot(lottery, cb) {
    var t1 = (new Date()).getTime();
    var users = lottery.users;

    var lottMoney = lottery.money;
    var winCount = 0;
    //人均金额需要 小于等于1
    lottMoney.average = lottMoney.average >= 1 ? 1 : lottMoney.average;
    var totalMoney = 0;
    if (lottery.allUsersLength) {
        totalMoney = lottery.allUsersLength * lottMoney.average;
    } else {
        totalMoney = lottery.users.length * lottMoney.average;
    }
    //var totalMoney=lottery.users.length*lottMoney.average;
    lottMoney.total = totalMoney > lottMoney.max ? lottMoney.max : totalMoney;
    lottMoney.SurplusTotal = lottMoney.total;
    _.each(lottMoney.info, function (prizeinfo) {
        //prizeinfo.count 中奖人数
        //console.log(Math.floor(users.length*prizeinfo.count/100));
        console.log("prizeinfo.type:" + prizeinfo.type);
        if (prizeinfo.type == "p") { //percent
            prizeinfo.newCount = Math.floor(users.length * prizeinfo.count / 100);
        }
        else if (prizeinfo.type == undefined || prizeinfo.type == "c") {
            prizeinfo.newCount = prizeinfo.count;//Math.floor(users.length*prizeinfo.count/100);
        }
        if (prizeinfo.newCount > 0) {
            prizeinfo.total = lottMoney.total * prizeinfo.percent / 100; //每个奖项共有多少钱
            //计算平均每个人多少钱
            var usermoney = (prizeinfo.total / prizeinfo.newCount).toFixed(2) > 4999 ?
                4999 : (prizeinfo.total / prizeinfo.newCount).toFixed(2);
            console.log("usermoney:" + usermoney);
            if (usermoney < 1) { //小于1块钱 的时候 优先发一元
                //中奖人数 由 100 减到 50
                prizeinfo.newTotal = Math.floor(prizeinfo.total);
                prizeinfo.newCount = prizeinfo.newTotal;
                prizeinfo.userMoney = 1;
            } else {
                prizeinfo.userMoney = usermoney;
            }

            if (prizeinfo.redMax) {//红包金额上限  0 或者不设置  就表示没有上限
                prizeinfo.userMoney = prizeinfo.redMax;
                var t = prizeinfo.total; //当前奖总奖池
                console.log("redMax:" + prizeinfo.redMax);
                //如果上限超过总金额 人均为t
                if (prizeinfo.userMoney > t) {
                    prizeinfo.userMoney = t;
                    console.log("人均金额:" + t);
                }
                //金额格式化到2位小数
                //prizeinfo.userMoney=+((+prizeinfo.userMoney).toFixed(2));
                prizeinfo.userMoney = Math.floor(prizeinfo.userMoney * 100) / 100;
                // 红包金额                 人数              当前奖项总金额
                if (prizeinfo.userMoney * prizeinfo.newCount > prizeinfo.total) {
                    prizeinfo.newCount = Math.floor(prizeinfo.total / prizeinfo.userMoney);
                }
            }
            console.log("prizeinfo:" + JSON.stringify(prizeinfo));
            winCount += parseInt(prizeinfo.newCount, 10);
        }
    });

    users = _.shuffle(users);

    //过滤掉黑名单
    /*getNotInBlackLint(users,function(clearUsers,blacks){
     console.log("winCount"+winCount+" "+(new Date()));
     var winUsers=clearUsers.splice(0,winCount); //中红包用户组
     clearUsers=clearUsers.concat(blacks); //追加黑名单
     console.log("winUsers.length "+winUsers.length+" "+(new Date()));
     console.log("users.length "+ clearUsers.length+" "+(new Date()));
     var t2=(new Date()).getTime();
     console.log("createwinlotteryUsersAndNot t2 "+(t2-t1))
     //验证交集  存在交集可能订单会重复
     var wwww=[];
     var uuuu=[];
     _.each(winUsers,function(user){
     wwww.push(user.openId);
     })
     _.each(clearUsers,function(user){
     uuuu.push(user.openId);
     })
     var jiaoji=_.intersection(wwww,uuuu);
     console.log("jiaoji:"+jiaoji.length);
     cb(winUsers,clearUsers);
     })*/

    console.log("winCount" + winCount + " " + (new Date()));
    var winUsers = users.splice(0, winCount); //中红包用户组
    console.log("winUsers.length " + winUsers.length + " " + (new Date()));
    console.log("users.length " + users.length + " " + (new Date()));
    var t2 = (new Date()).getTime();
    console.log("createwinlotteryUsersAndNot t2 " + (t2 - t1))
    cb(winUsers, users);
    //如果在黑名单中 把黑名单的人 放到数组最前端 取中奖用户时 是pop出来的
    /*checkBlackList(winUsers,function(newWinsUser){
     cb(newWinsUser,users);
     });*/
}

/*
 * 分发奖品
 * */
function distributionPrize(users, lottery, LotteryPrizes) {
    var userIndex = 0;
    var prizeListUsers = [];
    //console.log(LotteryPrizes);
    _.each(LotteryPrizes, function (prize) {
        console.log("prize.count " + prize.count);
        //防止庫存檢查慢 先分出哪些人中獎品
        prize.prizeUser = users.splice(0, prize.count);
        (function (prize) {
            getPrizeCount(prize, function (err, inventories) {
                console.log("prize.prizeUser.length " + prize.prizeUser.length);
                if (err) {
                    console.log("getPrizeCount" + err);
                } else {
                    var canUsePrizeCount = prize.count;
                    //检查库存信息
                    if (inventories != null) {
                        canUsePrizeCount = prize.count > inventories ? inventories : prize.count;
                        console.log("inventories:" + inventories);
                    }
                    var prizeUsers = [];
                    console.log("canUsePrizeName:" + prize.name + "canUsePrizeCount" + canUsePrizeCount + " " + ((new Date())));
                    for (var i = 0; i < canUsePrizeCount; i++) {
                        //var currentUser = users[userIndex];
                        var currentUser = prize.prizeUser.pop();
                        if (currentUser) {
                            //console.log("username ------------"+currentUser.name);
                            currentUser.prize = prize;
                            //进入订单后 保证奖品正确性后 再放入redis
                            (function (prize, currentUser) {
                                orders.createLottery(lottery,
                                    {prize: currentUser.prize, user: currentUser},
                                    function (err, dborder) {
                                        console.log("dborder" + ((new Date())));
                                        if (err) {
                                            console.log("createLotteryerr: " + ((new Date())) + ":" + JSON.stringify(err));
                                        } else {
                                            currentUser.iswin = 1;
                                            prizeUsers.push(currentUser);
                                            var winUser = _.extend({}, {user: dborder.user});
                                            winUser.user.prize = dborder.prize;
                                            winUser.orderId = dborder._id;
                                            /*//如果是实物订单 前端需要根据订单id 设置订单数据setAddress
                                             if (prize.type == typeConfig.prizeType.goods) {
                                             winUser.orderId = dborder._id;
                                             console.log("goods order " + winUser.orderId + " prize.name"
                                             + JSON.stringify(dborder.prize) + " " + (new Date()))
                                             }*/
                                            winUser.createTime = dborder.createTime;
                                            (function (currentUser, winUser) {
                                                sysLotteryRedisGoods.HSET(lottery.key + "wins",
                                                    currentUser.openId,
                                                    JSON.stringify(winUser), function (err, doc) {
                                                        if (err) {
                                                            console.log("prize wins err:" + err);
                                                        }
                                                    });
                                                winUser.openId = currentUser.openId;
                                                toSaveHighRate(winUser.user.prize, winUser, lottery);
                                            })(currentUser, winUser)
                                        }
                                    }
                                );
                            })(prize, currentUser);
                        }
                        else {
                            console.log("no currentUser index " + userIndex);
                            break;
                        }
                        userIndex++;
                    }
                    prizeListUsers.push(prizeUsers);
                }
            });
        })(prize)
    });
    //console.log("lottery win users")
    //console.log(JSON.stringify(prizeListUsers));
}


//mWxRed.createwxredAndLottery

function distributionMoney(winUsers, lottery) {
    console.log("distributionMoney")
    var lottMoney = lottery.money;
    //人均金额需要 小于等于1
    lottMoney.average = lottMoney.average >= 1 ? 1 : lottMoney.average;
    var totalMoney = lottery.users.length * lottMoney.average;
    if (lottery.allUsersLength) {
        totalMoney = lottery.allUsersLength * lottMoney.average;
    } else {
        totalMoney = lottery.users.length * lottMoney.average;
    }
    lottMoney.total = totalMoney > lottMoney.max ? lottMoney.max : totalMoney;
    //console.log("lottMoney.total "+lottMoney.total);
    //
    _.each(lottMoney.info, function (prize) { /* name:"一等奖",percent:0.15, count:10 */
        console.log("prize " + JSON.stringify(prize))
        for (var i = 0; i < prize.newCount; i++) {
            var winUser = winUsers.pop();
            if (winUser) {
                prize.total = lottMoney.total * prize.percent / 100;
                /*usermoney 1-4999*/
                var usermoney = 1;//(prize.total/prize.newCount).toFixed(2)>4999?
                //4999:(prize.total/prize.newCount).toFixed(2);

                if (prize.newTotal) {
                    usermoney = 1;
                }
                usermoney = prize.userMoney;
                usermoney = usermoney > 4999 ? 4999 : usermoney;
                usermoney = usermoney < 1 ? 1 : usermoney;
                console.log("usermoney " + usermoney);
                winUser.money = {rate: prize.rate, name: usermoney + "元现金红包", money: usermoney, pic: prize.pic};
                (function (winUser) {
                    var redPrize = {
                        yyyappId: lottery.yyyappId,
                        name: "现金红包",
                        wxredParam: {
                            "send_name": lottMoney.send_name,
                            "hb_type": "NORMAL",   //普通红包  lottery.send_name
                            "total_amount": winUser.money.money * 100,   //单位分
                            "total_num": 1,
                            "wishing": "恭喜发财",
                            "act_name": "微信10周年",
                            "remark": "恭喜发财"
                        }
                    }
                    mWxRed.createwxredAndLottery(redPrize, function (err, redLotteryId) {
                        if (err) {
                            console.log("createwxredAndLottery err" + (new Date()) + " " + err);
                            console.log(err)
                            console.log(redLotteryId)
                        }
                        else {
                            if (redLotteryId) {
                                winUser.prize = {};
                                winUser.money.wxRedLotteryId = redLotteryId;
                                winUser.money.type = typeConfig.prizeType.wxred;
                                winUser.prize.name = winUser.money.money + "元现金红包"
                                winUser.prize.rate = winUser.money.rate;
                                winUser.prize.type = winUser.money.type;
                                winUser.prize.pic = winUser.money.pic;
                                winUser.prize.money = winUser.money.money;//记录金额
                                winUser.prize.wxRedLotteryId = redLotteryId;
                                console.log("现金红包:" + winUser.money.money);
                                setBlacklist(winUser); //设置黑名单
                                orders.createSysLotteryMoneyOrder(lottery, winUser, function (err, result) {
                                    if (err) {
                                        console.log("createSysLotteryMoneyOrder ")
                                    }
                                    console.log("wxlotteryred:" + winUser.money.money
                                        + " redLotteryId:" + redLotteryId + " " + (new Date()));
                                    winUser.orderId = result._id; //orderid
                                    winUser.createTime = result.createTime;
                                    console.log("winUser.orderId+" + winUser.orderId);
                                    //把中红包用户放入单独redis实例
                                    setSysLotteryMoney(winUser.prize, winUser, lottery);
                                    toSaveMoney(winUser.prize, winUser, lottery);
                                    sysLotteryRedis.HSET(lottery.key + "wins",
                                        winUser.openId,
                                        JSON.stringify(winUser), function (err, doc) {
                                            console.log("HSET")
                                        }
                                    );
                                    //toSaveHighRate(winUser.prize, winUser, lottery);
                                });

                            }
                            else {
                                console.log("redLotteryId info:" + redLotteryId);
                            }
                        }
                    })
                })(winUser)
            }
        }
    });
}

/*
 * 中奖用户发红包 未中奖的发卡券
 * */
function distributionMoneyAll(winUsers, user, lottery) {
    distributionMoney(winUsers, lottery);//中奖的发红包
    console.log("------------------------------------------------------------------------")
    console.log("lottery.money && lottery.money.prizes: " + (lottery.money && lottery.money.prizes));
    if (lottery.money && lottery.money.prizes) {
        console.log("lottery.money.prizes" + JSON.stringify(lottery.money.prizes))
        //console.log(user);
        console.log("KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK")
        distributionPrize(user, lottery, lottery.money.prizes); //未中奖的发普通奖品 比如卡券
    }
}


function toSaveHighRate(prize, winUser, lottery) {
    if (prize.rate == 1 || prize.rate == 2) {
        /*sysLotteryRedis.HSET(lottery.key+"winsHighRate",
         winUser.openId,
         JSON.stringify(winUser),function(err,doc){
         console.log("winsHighRate HSET")
         }
         );*/
    }
}
//存储中红包的集合
function toSaveMoney(prize, winUser, lottery) {
    //if(prize.rate==1|| prize.rate==2){
    sysLotteryRedis.HSET(lottery.key + "winsMoney",
        winUser.openId,
        JSON.stringify(winUser), function (err, doc) {
            if (err) {
                console.log("toSaveMoney err" + err)
            }
            if (doc) {
                console.log("wins money HSET doc:" + winUser.money.money + " doc:" + doc)
            } else {
                console.log("wins money HSET nodoc:" + winUser.money.money + " doc:" + doc)
            }
        }
    );
    //}
}
//由于redis入库慢把rate为1的大奖单独存储 未使用
function setRate1Money(prize, winUser, lottery) {
    if (prize.rate == 1) {
        sysLotteryRedis.HSET(lottery.key + "winsRateMoney",
            winUser.openId,
            JSON.stringify(winUser), function (err, doc) {
                if (err) {
                    console.log("toSaveMoney err" + err)
                }
                if (doc) {
                    console.log("rate wins money HSET doc:" + winUser.money.money + " doc:" + doc)
                } else {
                    console.log("rate wins money HSET nodoc:" + winUser.money.money + " doc:" + doc)
                }
            }
        );
    }
}
//把中钱用户 放另一个redis实例
function setSysLotteryMoney(prize, winUser, lottery) {
    sysLotteryMoneyRedis.HSET(lottery.key + "nWinsMoney",
        winUser.openId,
        JSON.stringify(winUser), function (err, doc) {
            if (err) {
                console.log("ntoSaveMoney err" + err);
            }
            if (doc) {
                console.log("nwins money HSET doc:" + winUser.money.money + " doc:" + doc);
            } else {
                console.log("nwins money HSET nodoc:" + winUser.money.money + " doc:" + doc);
            }
        }
    );
}
/*
 在同时进行多个抽奖的时候
 会有多发奖品的可能
 这个函数只能保证单个抽奖不发超奖品
 */
function getPrizeCount(prize, cb) {

    //return cb(null,null);
    prizeCollection.findById(prize.id, function (err, o) {

        if (err) {
            cb(err);
        }
        prize.type = o.type;
        console.log(prize);
        //prize
        if (o.type == typeConfig.prizeType.goods && o.expiredDay) {
            prize.expiredDay = o.expiredDay;
        }
        //实物和卡券 返回实际库存信息
        if ((o.type == typeConfig.prizeType.goods
            || o.type == typeConfig.prizeType.link
            || o.type == typeConfig.prizeType.wxcard)) {
            console.log("prizeName:" + prize.name + " prizeCount:" + o.count + " " + (new Date()));
            cb(null, o.count);
        } else {
            cb(null, null);
        }
    });
}

//
function setBlacklist(winUser) {
    var ttl = 0;
    if (winUser.prize.rate == 1) {
        ttl = config.blackTTL.rate1Black;// 1 * 60 * 60 * 24 * 2; //大奖48小时黑名单
        //ttl = 1 * 60 * 40; //大奖40分钟黑名单
        winUser.toBlackListTime = new Date();
        sysLotteryRedisBlack.SETEX("userBlackList" + winUser.openId, ttl,
            JSON.stringify(winUser), function (err, doc) {
                if (err) {
                    console.log("set black list err" + err);
                } else {
                    console.log("set black list doc" + JSON.stringify(winUser));
                }
            }
        );
    } else if (winUser.prize.rate == 2) {
        ttl = config.blackTTL.rate2Black;// 1 * 60 * 60 * 24; //1元24小时中奖次数记录 超过三次就不再接收用户
        //ttl = 1 * 60 * 20; //小奖20分钟黑名单
        sysLotteryRedisBlack.EXISTS("rate2userBlackList" + winUser.openId, function (err, doc) {
            if (err) {
                console.log("exists user black list err" + err);
            }
            if (doc == 0) { //不存在
                sysLotteryRedisBlack.SETEX("rate2userBlackList" + winUser.openId, ttl, 1,
                    function (err, doc) {
                        if (err) {
                            console.log("SETEX one err " + err);
                        } else {
                            console.log("SETEX one doc " + doc);
                        }
                    }
                );
            }
            //在24小时内中过1元红包 次数+1
            else {
                sysLotteryRedisBlack.INCRBY("rate2userBlackList" + winUser.openId, 1,
                    function (err, doc) {
                        if (err) {
                            console.log("incrby one err " + err);
                        } else {
                            console.log("incrby one doc " + doc);
                        }
                    }
                );
            }
        })
        //sysLotteryRedisBlack.

    }

}
/*
 * 检查黑名单
 * */
function checkBlackList(winUsers, cb) {
    //return cb(winUsers);
    console.log("checkBlackList winUsers length:" + winUsers.length)
    sysLotteryRedis.keys("userBlackList*", function (err, doc) {
        var keys = [];
        _.each(doc, function (key) {
            keys.push(key.replace("userBlackList", ""))
        })
        //黑名单集合
        console.log(keys);
        var blacks = [];
        _.each(keys, function (blackopenid) {
            var buser = _.find(winUsers, function (user) {
                return user.openId = blackopenid;
            })
            if (buser) {
                winUsers = winUsers.filter(function (u) {
                    return u.openId != buser.openId
                });
                blacks.push(buser);
            }
        });
        var result = blacks.concat(winUsers);
        console.log("checkBlackList winUsers length result:" + result.length)
        return cb(result);
    })
}


function getNotInBlackLint(allUsers, callback) {
    console.log("allUsers.length" + allUsers.length);
    var nUsers = allUsers.concat();// _.extend({},allUsers);
    console.log("nUsers.length" + nUsers.length);
    sysLotteryRedis.keys("userBlackList*", function (err, doc) {
        var blackList = [];
        _.each(doc, function (key) {
            blackList.push(key.replace("userBlackList", ""))
        })
        var inBlacks = [];
        _.each(blackList, function (blackOpenId) {
            //查找黑名单在本次抽奖中的人
            var re = _.find(nUsers, function (user) {
                console.log("user.openId" + user.openId);
                console.log("blackopenid" + blackOpenId);
                return user.openId == blackOpenId
            });
            if (re) {
                console.log("bbbb")
                console.log(inBlacks);
                inBlacks.push(re);
                //过滤掉黑名单
                nUsers = nUsers.filter(function (u) {
                    console.log(u);
                    return u.openId != re.openId
                });
            }
        });
        /* var tvm_clearUsers=[];
         _.each(nUsers,function(user){
         tvm_clearUsers.push(user);
         })*/
        console.log(nUsers);
        console.log("nUsers.length " + nUsers.length);
        console.log("inBlacks.length" + inBlacks.length);

        //不在黑名单中的用户
        if (nUsers.length > 0) {
            callback(nUsers, inBlacks);
        }
        //如果过滤完黑名单 无人中奖 则设置黑名单中的人
        else {
            callback(inBlacks, []);
        }

    });
}

function filterBlack(allUser, callback) {
    sysLotteryRedis.keys("userBlackList*", function (err, doc) {
        var blackList = [];
        _.each(doc, function (key) {
            blackList.push(key.replace("userBlackList", ""))
        })
        var b = [];
        _.each(blackList, function (blackuser) {
            var re = _.find(allUser, function (user) {
                return user.openId == blackuser.openId
            })
            if (re) {
                b.push(re);
            }
        });
        callback(allUser);
    });
}


function deepCopy(source) {
    var result={};
    for (var key in source) {
        if (_.isObject(source[key])){
            result[key] = deepCopy(source[key])
        } else{
            result[key] = source[key];
        }
    }
    return result;
}
