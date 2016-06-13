/**
 * Created by luosm on 2015/8/7.
 */
var _                    = require('underscore');
var tools                = require('../../tools');
var sysLotteryRedis      = tools.sysLotteryRedis();
var sysLotteryRedis2     = tools.sysLotteryRedis();
var sysLotteryRedisPrize = tools.sysLotteryRedis();
var lotterySetRedisClient= tools.sysLotteryRedis();
var sysLotteryRedisBlack = tools.sysLotteryRedis();
var sysLotteryRedisGoods = tools.sysLotteryRedis();
var sysLotteryMoneyRedis = tools.sysLotteryMoneyRedis();
var orders               = require("../../routes/orders.js");
var typeConfig           = require('../../routes/typeConfig.js');
var dbUtils              = require('../../mongoSkin/mongoUtils.js');
var mWxRed               = require('../../routes/wxRed.js');
var async                = require("async");
var queueClient          = tools.queueRedis();
var config               = require('../../config.js');
var anaApi               = require("../../interface/anaApi.js");
var wxInfo               = require('../../interface/wxInfo.js');
var maxUsers             = 30000;      //取出的总人数 超过3w人后 不再参加红包抽奖
var AdvanceSeconds       = 1000 * 15;  //提前多少s开奖 预留创建红包和入redis 时间
var args                 = process.argv;
var prizeCountRedis      = require('../../routes/shoppingCard.js');
//频道号
//var channel_id = args[2]?args[2].toString():"1782";  //1782 北京生活
var channel_id="all";                                    //开所有频道
var log4js               = require('log4js');
log4js.configure({
    "appenders": [{
        "type": "dateFile",
        "absolute": true,
        "filename": "E:\\tvm\\code\\logs\\"+channel_id+"_lottery.log",
        "pattern": "-yyyy-MM-dd",
        "category":"sysLottery"
    },{
        "type": "console"
    }
    ],
    "levels": {
        "logger": "trace"
    },
    replaceConsole: true
}, {});
var sysLotteryLogger=log4js.getLogger('sysLottery');
sysLotteryLogger.info("channel_id is:"+channel_id);
var TVMSysLottery = {};
setInterval(function () {
    doLottery();
}, 1000);
//轮询抽奖信息
function doLottery(){
    sysLotteryRedis.HGETALL("sysLotteryDataKeys", function (err, lotterys) {
        _.each(lotterys, function (lottery, key) {
            lottery = JSON.parse(lottery)
            lottery.end = parseInt(lottery.end, 10)
            //放到本地内存中
            var selfLottery = _.extend({}, lottery);
            if (!TVMSysLottery[lottery.key] ) {//&& channel_id==selfLottery.channel_id
                selfLottery.lusers = {};
                TVMSysLottery[lottery.key] = selfLottery;
            }
            sysLotteryLogger.info('lottery time:' + (new Date(lottery.end).getTime() - new Date().getTime()))
            //超过10分钟未开奖 删除抽奖信息
            if (new Date().getTime() - lottery.end > 10 * 60 * 1000) {
                delete TVMSysLottery[lottery.key]
                sysLotteryRedis.HDEL("sysLotteryDataKeys", key, function (err, hdelresult) {
                    sysLotteryLogger.error(err);
                    sysLotteryLogger.info("10分钟未 开奖:" + hdelresult);
                });
            }
            //总抽奖时间为100s 系统抽奖提前AdvanceSeconds结束
            else if (lottery.end <= (new Date().getTime()) + AdvanceSeconds) {
                //通知不创建红包 30s 后继续创建
                queueClient.rpush('notiKaijiang', true);
                //获取抽奖详细信息
                var lotteryInfo = TVMSysLottery[lottery.key];
                if(lotteryInfo){
                    getNumbers(lotteryInfo);
                    noticeStatistics(lotteryInfo);
                }else{
                    sysLotteryLogger.error("!!!not found lottery!!!")
                }
            }
        });
    });
}

/*
* 有后来获取奖品的人员
* so延迟2分钟通知统计开始
* */
function noticeStatistics(lotteryInfo) {
    //删除 sysLotteryDataKeys 中的抽奖信息
    sysLotteryRedis.HDEL("sysLotteryDataKeys", lotteryInfo.key, function (err, hdelresult) {
        var lotteryInfo_extend = _.extend({}, lotteryInfo);//仅copy一级属性 二级属性为引用
        delete TVMSysLottery[lotteryInfo.key]
        delete lotteryInfo_extend.users;  //防止存储信息过大
        delete lotteryInfo_extend.lusers; //防止存储信息过大
        setTimeout(function () {
            sysLotteryLogger.info("lotteryInfo_extend:" + JSON.stringify(lotteryInfo_extend));
            //通知开始统计
            sysLotteryRedis.lpush("countSysLottery", JSON.stringify(lotteryInfo_extend), function (err, doc) {
                if (err) {
                    sysLotteryLogger.error("noticeStatistics:" + err);
                } else {
                    sysLotteryLogger.info("noticeStatistics doc:" + doc);
                    sysLotteryLogger.info("noticeStatistics countSysLottery:" + JSON.stringify(lotteryInfo_extend));
                }
            });
        }, 1000 * 120);
        //在已开奖集合中做存储记录
        sysLotteryRedis.HSET("sysLotteryDataKeys_noWin", lotteryInfo_extend.key,
            JSON.stringify(lotteryInfo_extend), function (err, doc) {
                sysLotteryLogger.info("sysLotteryDataKeys_noWin:" + doc);
            }
        );
        sysLotteryRedis.HSET("sysLotteryDataKeys_noWin_prize", lotteryInfo_extend.key,
            JSON.stringify(lotteryInfo_extend), function (err, doc) {
                sysLotteryLogger.info("sysLotteryDataKeys_noWin_prize:" + doc);
            }
        );
    });
}

/*
* 获取开奖时刻的有效参与人数
* */
function getNumbers(lotteryInfo) {
    //获取总金额
    async.parallel(
        [
            //参与抽奖的总人数
            function (cb) {
                sysLotteryRedis.HLEN(lotteryInfo.key + "allUsers", function (err, doc) {
                    if (err) {
                        sysLotteryLogger.error("getAllUsersLength err:" + err);
                        cb(null, -1);
                    } else {
                        sysLotteryLogger.info("getAllUsersLength doc:" + doc);
                        cb(null, doc);
                    }
                });
            },
            //开奖时刻获取广告UV数
            function (cb) {
                anaApi.getUVbyChannel(lotteryInfo.tvmId, lotteryInfo.createTime, lotteryInfo.channel_id,
                    function (err, num) {
                        if (err) {
                            sysLotteryLogger.error("getUV err:" + err);
                            cb(null, -1);
                        } else {
                            sysLotteryLogger.info("getUV num:" + num);
                            cb(null, num);
                        }
                    }
                );
            }
        ],
        function (err, result) {
            var allUsersLength=result[0];
            var uvNum=result[1];
            if(uvNum>0){ //uv数大于0 使用广告uv数
                lotteryInfo.allUsersLength=uvNum;
            }else{
                lotteryInfo.allUsersLength=allUsersLength;
            }
            CalculationUsers(lotteryInfo);
        }
    );
}
/*
* 计算中奖人数
* */
function CalculationUsers(lotteryInfo) {
    //金额对象
    var lottMoney = lotteryInfo.money;
    //红包人数
    var winCount = 0;
    //人均金额无论设置必须小于等于1
    lottMoney.average = lottMoney.average >= 1 ? 1 : lottMoney.average;
    //奖池总金额
    var totalMoney = lotteryInfo.allUsersLength * lottMoney.average;
    //奖池不可以超过设置金额
    lottMoney.total = totalMoney > lottMoney.max ? lottMoney.max : totalMoney;
    _.each(lottMoney.info, function (moneyPrize) {
        if (moneyPrize.type == "p") { //percent
            moneyPrize.newCount = Math.floor(lotteryInfo.allUsersLength * moneyPrize.count / 100);
        }
        else if (moneyPrize.type == undefined || moneyPrize.type == "c") {
            moneyPrize.newCount = moneyPrize.count;
        }
        if (moneyPrize.newCount > 0) {
            //每个奖项共有多少钱
            moneyPrize.total = lottMoney.total * moneyPrize.percent / 100;
            //计算平均每个人多少钱
            var usermoney = (moneyPrize.total / moneyPrize.newCount).toFixed(2) > 4999 ?
                4999 : (moneyPrize.total / moneyPrize.newCount).toFixed(2);
            if (usermoney < 1) { //小于1块钱 的时候 优先发一元
                //中奖人数 由 100 减到 50
                moneyPrize.newTotal = Math.floor(moneyPrize.total);
                moneyPrize.newCount = moneyPrize.newTotal;
                moneyPrize.userMoney = 1;
            } else {
                moneyPrize.userMoney = usermoney;
            }
            //红包金额上限  0 或者不设置  就表示没有上限
            if (moneyPrize.redMax) {
                moneyPrize.userMoney = moneyPrize.redMax;
                sysLotteryLogger.info("moneyPrize:" + moneyPrize.redMax);
                //如果上限超过总金额 人均为t
                if (moneyPrize.userMoney > moneyPrize.total) {
                    moneyPrize.userMoney = moneyPrize.total;
                    sysLotteryLogger.info("per money:" + moneyPrize.total);
                }
                moneyPrize.userMoney = Math.floor(moneyPrize.userMoney * 100) / 100;
                // 红包金额                 人数              当前奖项总金额
                if (moneyPrize.userMoney * moneyPrize.newCount > moneyPrize.total) {
                    moneyPrize.newCount = Math.floor(moneyPrize.total / moneyPrize.userMoney);
                }
            }
            sysLotteryLogger.info("prizeinfo:" + JSON.stringify(moneyPrize));
            winCount += parseInt(moneyPrize.newCount, 10);
        }
    });

    var totalCount = winCount > maxUsers ? maxUsers : winCount;
    sysLotteryLogger.info("totalCount:" + totalCount);
    sysLotteryLogger.info("winCount:" + winCount);
    console.time("lottery SRANDMEMBER");
    lotterySetRedisClient.SRANDMEMBER(lotteryInfo.key + ":set", totalCount, function (err, users) {
        console.timeEnd("lottery SRANDMEMBER");
        sysLotteryLogger.info("users.length:" + users.length);
        _.each(users, function (user) {
            var UserObj = JSON.parse(user);
            lotteryInfo.users.push(UserObj);
        })
        var MoneyUsers = lotteryInfo.users.splice(0, winCount);
        distributionMoney(MoneyUsers, lotteryInfo);
    })
    //设置物品库存到redis
    setLotteryPrizeCount(lotteryInfo);

}
/*
* 发红包 发物
* */
function distributionMoneyAll(winUsers, user, lottery) {
    distributionMoney(winUsers, lottery);//中奖的发红包
    if (lottery.money && lottery.money.prizes) {
        distributionPrize(user, lottery, lottery.money.prizes); //未中奖的发普通奖品 比如卡券
    }
}

/*
* 发红包
* */
function distributionMoney(winUsers, lottery) {
    var lottMoney = lottery.money;
    var moneyFuncs=[];
    _.each(lottMoney.info, function (moneyInfo) {
        for (var i = 0; i < moneyInfo.newCount; i++) {
            var winUser = winUsers.pop();
            if (winUser) {
                var usermoney = moneyInfo.userMoney;
                usermoney = usermoney > 4999 ? 4999 : usermoney;
                usermoney = usermoney < 1 ? 1 : usermoney;
                winUser.money = {rate: moneyInfo.rate, name: usermoney + "元现金红包", money: usermoney, pic: moneyInfo.pic};
                //createUserMoney(lottery,winUser);
                addDistributionMoney(lottery,winUser,moneyFuncs);
            }
        }
    });
    async.parallel(moneyFuncs,function(err,result){
        sysLotteryLogger.info("moneyOrders done");
    })
}
function addDistributionMoney(lottery,winUser,moneyFuncs){
    moneyFuncs.push(function(cb){
        createUserMoney(lottery,winUser,cb);
    })
}
/*
* 创建中红包用户订单
* */
function createUserMoney(lottery,winUser,callback){
    var lottMoney = lottery.money;
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
            redLotteryId="EEEE";
            sysLotteryLogger.error("createwxredAndLottery err" + err);
        }
        winUser.prize = {};
        winUser.money.wxRedLotteryId = redLotteryId;
        winUser.money.type = typeConfig.prizeType.wxred;
        winUser.prize.name = winUser.money.money + "元现金红包"
        winUser.prize.rate = winUser.money.rate;
        winUser.prize.type = winUser.money.type;
        winUser.prize.pic = winUser.money.pic;
        winUser.prize.money = winUser.money.money;//记录金额
        winUser.prize.wxRedLotteryId = redLotteryId;
        setBlacklist(winUser); //设置黑名单
        orders.createSysLotteryMoneyOrder(lottery, winUser, function (err, result) {
            if (err) {
                return sysLotteryLogger.error("createSysLotteryMoneyOrder:"+err)
            }
            winUser.orderId = result._id; //orderid
            winUser.createTime = result.createTime;
            //把中红包用户放入单独redis实例
            setSysLotteryMoney(winUser.prize, winUser, lottery);
            toSaveMoney(winUser.prize, winUser, lottery);
            sysLotteryRedis.HSET(lottery.key + "wins",
                winUser.openId,
                JSON.stringify(winUser), function (err, doc) {
                    if(err){
                        sysLotteryLogger.error("wins hset err:"+winUser.openId+" err:"+err);
                    }
                    sysLotteryLogger.info("HSET:"+winUser.openId+" doc:"+doc);
                    callback(null,"m");
                }
            );
        });
    });
}
/*
 * 发物
 * */
function distributionPrize(users, lottery, LotteryPrizes) {
    var goodsFuncs=[];
    _.each(LotteryPrizes, function (prize) {
        //sysLotteryLogger.info("prize:"+JSON.stringify(prize));
        for (var i = 0; i < prize.canUseCount; i++){
            var currentUser = users.pop();
            if (currentUser) {
                currentUser.prize = prize;
                funcsArr(lottery, prize, currentUser,goodsFuncs);
            }
        }
    });
    sysLotteryLogger.info("goodsFuncs.length:"+goodsFuncs.length);
    async.parallel(goodsFuncs,function(err,result){
        sysLotteryLogger.info("goodsOrders done");
    })
}

function funcsArr(lottery, prize, currentUser,goodsFuncs){
    goodsFuncs.push(function(cb){
        goodsOrders(lottery, prize, currentUser, cb)
    })
}

/*
* 物品订单
* */
function goodsOrders(lottery,prize,currentUser,callback){
    orders.createLottery(lottery, {prize: currentUser.prize, user: currentUser},
        function (err, dborder) {
            if (err) {
                return sysLotteryLogger.error("createLotteryerr goodsOrders: " + JSON.stringify(err));
            }
            if(dborder) {
                //return callback(null,doc);
                currentUser.iswin = 1;
                var winUser = _.extend({}, {user: dborder.user});
                winUser.user.prize = dborder.prize;
                winUser.orderId = dborder._id;
                winUser.createTime = dborder.createTime;
                winUser.openId = currentUser.openId;
                sysLotteryRedisGoods.HSET(lottery.key + "wins",
                    winUser.openId,
                    JSON.stringify(winUser), function (err, doc) {
                        if (err) {
                            sysLotteryLogger.error("prize wins err:" + err);
                        }
                        callback(null,doc);
                        sysLotteryLogger.info("prize wins doc:" + doc);
                    }
                );
            }
        }
    );
}

//把中钱用户 放另一个redis实例
function setSysLotteryMoney(prize, winUser, lottery) {
    sysLotteryMoneyRedis.HSET(lottery.key + "nWinsMoney",
        winUser.openId,
        JSON.stringify(winUser), function (err, doc) {
            if (err) {
                sysLotteryLogger.error("ntoSaveMoney err" + err);
            }
            if (doc) {
                sysLotteryLogger.info("nwins money HSET doc:" + winUser.money.money + " doc:" + doc);
            } else {
                sysLotteryLogger.info("nwins money HSET nodoc:" + winUser.money.money + " doc:" + doc);
            }
        }
    );
}
//存储中红包的集合
function toSaveMoney(prize, winUser, lottery) {
    sysLotteryRedis2.HSET(lottery.key + "winsMoney",
        winUser.openId,
        JSON.stringify(winUser), function (err, doc) {
            if (err) {
                sysLotteryLogger.error("toSaveMoney err" + err)
            }
            if (doc) {
                sysLotteryLogger.info("wins money HSET doc:" + winUser.money.money + " doc:" + doc)
            } else {
                sysLotteryLogger.info("wins money HSET nodoc:" + winUser.money.money + " doc:" + doc)
            }
        }
    );
}
/*
* 根据奖品配置信息 设置redis库存
* */
function setLotteryPrizeCount(lotteryInfo) {
    var lottMoney = lotteryInfo.money;
    var funcs = [];
    //按奖品等级排序 1 2 3 4 奖品等级最低的 不检查库存 不算人数
    lottMoney.prizes = _.sortBy(lottMoney.prizes, function (prize) {
        return parseInt(prize.rate, 10)
    });
    for (var i = 0; i < lottMoney.prizes.length; i++) {
        var prizeInfo = lottMoney.prizes[i];
        getPrizeCount(prizeInfo,funcs);
    }
    //获取非红包奖品的实际库存量后计算要多少人
    async.parallel(funcs, function (err, result) {
        for (var i = 0; i < lottMoney.prizes.length; i++) {
            var prizeInfo = lottMoney.prizes[i];
            //配置发放的量要小于实际库存量
            var canUsePrizeCount = prizeInfo.count > prizeInfo.tvmCanCount ? prizeInfo.tvmCanCount : prizeInfo.count;
            prizeInfo.canUseCount = parseInt(canUsePrizeCount, 10);
            sysLotteryRedisPrize.HINCRBY(lotteryInfo.key + ":prizeCount",
                prizeInfo.rate, prizeInfo.canUseCount, function (err, doc) {
                    sysLotteryLogger.info("HINCRBY prizeCount:" + doc);
                }
            );
        }
    });
}

function getPrizeCount(prizeInfo,funcs){
    funcs.push(function (cb) {
        if ((prizeInfo.type == typeConfig.prizeType.goods
            || prizeInfo.type == typeConfig.prizeType.link
            || prizeInfo.type == typeConfig.prizeType.wxcard)) {
            //获取非红包奖品的实际库存量
            prizeCountRedis.getCount(prizeInfo._id, function (count) {
                sysLotteryLogger.debug("prizeInfo._id:"+prizeInfo._id+"prizeInfo.count:"+count);
                prizeInfo.tvmCanCount = count;
                cb()
            })
        }
    });
}

/*
* 设置黑名单
* */
function setBlacklist(winUser) {
    var ttl = 0;
    if (winUser.prize.rate == 1) {
        ttl = config.blackTTL.rate1Black;// 1 * 60 * 60 * 24 * 2; //大奖48小时黑名单
        //ttl = 1 * 60 * 40; //大奖40分钟黑名单
        winUser.toBlackListTime = new Date();
        sysLotteryRedisBlack.SETEX("userBlackList" + winUser.openId, ttl,
            JSON.stringify(winUser), function (err, doc) {
                if (err) {
                    sysLotteryLogger.error("set black list err" + err);
                } else {
                    sysLotteryLogger.info("set black list doc" + JSON.stringify(winUser));
                }
            }
        );
    }
    else if (winUser.prize.rate == 2) {
        ttl = config.blackTTL.rate2Black;// 1 * 60 * 60 * 24; //1元24小时中奖次数记录 超过三次就不再接收用户
        //ttl = 1 * 60 * 20; //小奖20分钟黑名单
        sysLotteryRedisBlack.EXISTS("rate2userBlackList" + winUser.openId, function (err, doc) {
            if (err) {
                sysLotteryLogger.error("exists user black list err" + err);
            }
            if (doc == 0) { //不存在
                sysLotteryRedisBlack.SETEX("rate2userBlackList" + winUser.openId, ttl, 1,
                    function (err, doc) {
                        if (err) {
                            sysLotteryLogger.info("SETEX one err " + err);
                        } else {
                            sysLotteryLogger.info("SETEX one doc " + doc);
                        }
                    }
                );
            }
            //在24小时内中过1元红包 次数+1
            else {
                sysLotteryRedisBlack.INCRBY("rate2userBlackList" + winUser.openId, 1,
                    function (err, doc) {
                        if (err) {
                            sysLotteryLogger.info("incrby one err " + err);
                        } else {
                            sysLotteryLogger.info("incrby one doc " + doc);
                        }
                    }
                );
            }
        })
    }
}