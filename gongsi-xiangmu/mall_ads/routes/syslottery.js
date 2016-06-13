/**
 * Created by luosm on 2015/7/3.
 * 系统抽奖
 * 1 开始抽奖
 * 2 收集用户
 * 3 产生中奖结果 3.1结果保存到订单表
 * 4 订单表数据
 */
var moment = require('moment');
var _                      = require("underscore");
var CryptoJS               = require("crypto-js");
var redisCache             = require("../dal/redis_cache.js");
var sysLotteryCreate       = require("./syslotterycreate.js");
var orders                 = require("./orders.js");
var dbUtils                = require('../mongoSkin/mongoUtils.js')
var prizeCollection        = new dbUtils('prize');
var queueUtil              = require('../queue/redisQueue.js');
var tools                  = require('../tools');
var popRedisClient         = tools.sysLotteryRedis();
var lotterySetRedisClient  = tools.sysLotteryRedis();
var lotterySetRedisPrize   = tools.sysLotteryRedis();
var lotteryupdRedisLotte   = tools.sysLotteryRedis();
var sysLotteryMoneyRedis   = tools.sysLotteryMoneyRedis();
var sysLotteryRedisBlack   = tools.sysLotteryRedis();
var ordersCollection       = new dbUtils('order');
var typeConfig             = require('./typeConfig.js');
var async                  = require("async");
var checkAbnormalUser      = require('./checkAbnormalUser.js');
var prizeCount             = require('../routes/shoppingCard.js');
var mWxRed                 = require('../routes/wxRed.js');
//var lotterys={};

var acceptUser = {noStart: 0, success: 1,error :2, ended:3,noLottery:4,exits:5}

/*
 并发开始抽奖会有问题
* 开始抽奖
* 根据穿过来的抽奖id 查询出抽奖的详细信息 如奖品信息
* 抽奖结束
* 返回值 data 说明
* 0 未在抽奖列表中找到该抽奖信息
 1 开始抽奖
 2 开始抽奖出错
 3 已经正在抽奖
 * */
exports.startLottery=function(req,res) {

    var lotteryid = req.body.lotteryid;  //抽奖id  根据抽奖id 在db中找到抽奖信息
    if(!lotteryid){
        return res.send(500,"param lotteryid is required");
    }
    if(!req.body.length) {
        return res.send(500,"param length is required");
    }
    console.log('lotteryid:' + lotteryid + ',lenght: ' + req.body.length)
    if(!parseInt(req.body.length)){
        return res.send(500,"param length must be a num");
    }

    var createTime=req.body.createTime;
    if(!createTime){
        return res.send(500,"param createTime is required");
    }

    var channel_id=req.body.channel_id;
    if(!channel_id){
        return res.send(500,"param channel_id is required");
    }

    sysLotteryCreate.getSysLotteryInfo(lotteryid, function (err, doc) {
        if (err) {
            return res.send(500, {code:2,msg:"开始抽奖出错"});
        } else {
            if (doc == null) {
                return res.send(500, {code:0,msg:"未在抽奖列表中找到该抽奖信息"});
            }

            checkRedisExistLottery(lotteryid,function(err,result){
                if(err){
                    return res.send(500,"checkRedisExistLottery"+err);
                }
                if(!result){
                    var length = req.body.length;  //抽奖时间长度 毫秒
                    var startTime = (new Date()).getTime();
                    console.log("startTime :"+startTime);
                    console.log("starttime :"+moment(startTime).format("YYYY/MM/DD HH:mm:ss"));
                    var myLottery={
                        type:doc.type,  //系统抽奖类型
                        tvmId: doc.tvmId,
                        yyyappId: doc.yyyappId,
                        send_name: doc.send_name,
                        key: lotteryid,
                        createTime:createTime,//开拍时间
                        start: startTime,
                        length: length,
                        end: startTime + parseInt(length, 10),
                        users: [],
                        winCount: doc.count,
                        money: doc.money,
                        prizes: doc.prizes,
                        channel_id:channel_id.toString()
                    };
                    //如果在红包预设下 包含奖品信息  需要提前把奖品的详细信息查出
                    if(doc.money.prizes) {
                        var prizeIds = _.pluck(doc.money.prizes, "id")
                        prizeCollection.find({_id: {"$in": dbUtils.toId(prizeIds)}}, {}, {},
                            function (err, prizesDoc) {
                                if (err) {
                                    return res.send(500, {code: 100, type: doc.type, msg: "查询抽奖奖品出错" + err});
                                }
                                _.each(prizesDoc, function (prize) {
                                    console.log(prize)
                                    var p = _.find(doc.money.prizes, function (p) {
                                        return p.id == prize._id
                                    });
                                    delete prize.count; //不检查库存
                                    p = _.extend(p, prize);
                                });
                                //按奖品等级排序   3 4 5 6 奖品等级
                                myLottery.money.prizes = _.sortBy(myLottery.money.prizes, function (prize) {
                                    return parseInt(prize.rate, 10)
                                });
                                addToRedis(req, res, myLottery);
                            });
                    }
                    //单纯红包信息
                    else{
                        addToRedis(req,res,myLottery);
                    }
                }else{
                    return  res.send(200,  {code:3,msg:"已经正在抽奖"});
                }
            })
        }
    });
}


function addToRedis(req,res,myLottery){
    popRedisClient.HSET('sysLotteryDataKeys',myLottery.key,
        JSON.stringify(myLottery),function(err,rdoc){
            if(err){
                return res.send(500,"HSET sysLotteryDataKeys "+err) ;// console.log()
            }
            console.log("myLottery "+JSON.stringify(myLottery));
            clearUsersAndWinUsersAsync(myLottery,function(){
                if(myLottery.type){
                    if(myLottery.type==typeConfig.sysLotteryType.common){
                        return res.send(200, {code:1,type:myLottery.type,msg:"正常开始普通抽奖"});
                    }else if(myLottery.type==typeConfig.sysLotteryType.money){
                        return res.send(200, {code:1,type:myLottery.type,msg:"正常开始预设红包抽奖"});
                    }
                }else{
                    return res.send(200, {code:1,type:myLottery.type,msg:"正常开始普通抽奖"});
                }
            });
        })
}



/*
 *   收集用户 openid 用户唯一标识
 *        0         1          2         3          4
 *   抽奖未开始 成功接收用户  接收错误   抽奖结束  没有抽奖信息
 *
 * */
exports.acceptUsers=function(req,res){
    var lotteryid = req.body.lotteryid;
    //console.log("acceptUsers" +lotteryid)
    if(!lotteryid){
        return res.send(404,"param lotteryid is required");
    }

    checkBlackList(req.user,function(exists){
        //在黑名单中
        if(exists){
            console.log("blacklist:"+JSON.stringify(req.user));
            return res.send(200, {code: acceptUser.success, msg: "------接收用户------"});
        }
        //不在黑名单中
        else{
            checkRedisExistLotteryforNotWin(lotteryid,function(err,rdoc){
                if(err){
                    return res.send(500,"acceptUsers checkRedisExistLottery "+err);
                }
                //console.log(rdoc)
                if(rdoc){
                    var lottery = JSON.parse(rdoc);
                    if(lottery.start>(new Date()).getTime()){
                        return res.send(499,{code:acceptUser.noStart,msg:"抽奖未开始"});
                    }

                    //存在抽奖信息 并且 抽奖的结束时间大于等于当前时间
                    if(lottery.end-1000*2>=(new Date()).getTime()){
                        if(req.user) {
                            //加入无序集合
                            lotterySetRedisClient.SADD(lotteryid+":set",JSON.stringify(req.user),function(err,doc){
                                console.log("err:set"+err);
                                console.log("doc:set"+doc);
                            })
                            popRedisClient.HSET(lotteryid, req.user.openId, JSON.stringify(req.user),
                                function (err, doc) {
                                    if (err) {
                                        return res.send(400, err);
                                    }
                                    if (doc == 1) {
                                        //如果是money 类型的系统抽奖 需要设置总金额
                                        setLotteryTotalMoney(lottery);
                                        return res.send(200, {code: acceptUser.success, msg: "接收用户"});
                                    } else { //覆盖已存在的返回0
                                        return res.send(499, {code: acceptUser.exits, msg: "已存在,用户信息已更新"});
                                    }
                                }
                            );
                        }else{
                            res.send(499,{code:acceptUser.error,msg:"接收出错"});
                        }
                    }else{
                        console.log("lottery.end "+lottery.end);
                        console.log("(new Date()).getTime() "+(new Date()).getTime());
                        console.log("lottery.end-now "+(lottery.end-(new Date()).getTime()));
                        res.send(499,{code:acceptUser.ended,msg:"抽奖结束"});
                    }
                }
                else{
                    return res.send(400,{code:acceptUser.noLottery,msg:"没有抽奖信息"});
                }
            });
        }
    })

}

/*
* 接收用户无论答题正确与否
* */
exports.acceptAllUsers=function(req,res){
    var lotteryid = req.body.lotteryid;
    if(!lotteryid){
        console.log("param lotteryid is required");
        return res.send(404,"param lotteryid is required");
    }
    if(req.user) {
        console.log("req.user ok");
        popRedisClient.HSET(lotteryid+"allUsers", req.user.openId, JSON.stringify(req.user),
            function (err, doc) {
                if (err) {
                    console.log("receive all user err "+err);
                    return res.send(400, err);
                }
                console.log("receive all user "+req.user.openId);
                if (doc == 1) {
                    return res.send(200, {code: acceptUser.success, msg: "接收用户"});
                } else { //覆盖已存在的返回0
                    return res.send(500, {code: acceptUser.exits, msg: "已存在,用户信息已更新"});
                }
            }
        );
    }
    else{
        console.log("no req.user "+JSON.stringify(req.user));
        res.send(500,{code:acceptUser.error,msg:"req.user err"});
    }
}

/*
 * 产生中奖结果
 * 把中奖用户存入中奖集合中  如 一等奖 iPhone [{XXX photo, XXX}]
 * */
exports.lotteryResult=function(req,res){
    var lotteryId=req.param("lotteryid");
    if(!lotteryId){
        return res.send(404,"param lotteryid is required");
    }
    console.log("lotteryResult")
    sysLotteryCreate.getSysLotteryInfo(lotteryId, function (err, LotteryDoc) {
        if(err){
            return res.send(500,err);
        }
        if(!LotteryDoc){
            return res.send(500,"not found lottery by "+lotteryId);
        }

        checkRedisExistLottery(lotteryId,function(err,data) {
            if (err) {
                res.send(500, "checkRedisExistLottery" + err);
            }
            if (data) {
                return res.send(400, {code:4,message:"未到开奖时间"});
            }else{
                //console.log(data);
                popRedisClient.HGET("sysLotteryDataKeys_noWin",lotteryId,function(err,lotteryInfo){
                    if(err){
                        return res.send(500,"get sysLotteryDataKeys_noWin"+err);
                    }
                    var lotteryObj=JSON.parse(lotteryInfo)
                    if(lotteryObj){
                        //已到开奖时间
                        if(((new Date()).getTime()) >= lotteryObj.end-1000*1){
                            popRedisClient.get(lotteryId+"winsList",function(err,doc){
                                if(err){
                                    return  res.send(500,"获取本期榜单"+err);
                                }
                                if(doc){
                                    console.log("winsListcache");
                                    return res.send(200,JSON.parse(doc));
                                }

                                sysLotteryMoneyRedis.HGETALL(lotteryId+"nWinsMoney",function(err,doc){
                                    if(err){
                                        return  res.send(500,"获取本期榜单"+err);
                                    }
                                    if(doc){
                                        //console.log(doc);
                                        var newMoney=[]
                                        var allWinUserCount=0;
                                        _.each(doc,function(obj){
                                            allWinUserCount++;
                                            obj=JSON.parse(obj);
                                            if(obj.openId){
                                                newMoney.push(obj);
                                            }
                                        })
                                        console.log("body money");
                                        console.log(newMoney);
                                        //console.log(newMoney)
                                        var result=[];
                                        result=result.concat(groupmoney(newMoney));
                                        //console.log(result);
                                        //按照奖品等级从1-N
                                        result=_.sortBy(result,function(prize){return prize.rate});
                                        //中奖人数 => 参与人数
                                        //popRedisClient.HLEN(lotteryId+"wins",function(err,userCount){
                                        popRedisClient.HLEN(lotteryId+"allUsers",function(err,userCount){
                                            if(err){
                                                return res.send(500,"获取用户数量错误:"+err);
                                            }else{
                                                //订单存储到缓存
                                                popRedisClient.set(lotteryId+"winsList",
                                                    JSON.stringify({count:userCount,result:result}));
                                                return res.send(200,{count:userCount,result:result});
                                            }
                                        });
                                    }
                                    else{
                                        console.log("no body money")
                                        //没人中钱 就获取中奖人数
                                        popRedisClient.HLEN(lotteryId+"allUsers",function(err,userCount){
                                            if(err){
                                                return res.send(500,"获取用户数量错误:"+err);
                                            }
                                            return res.send(200,{count:userCount,result:[]});
                                        });
                                    }
                                });
                            })
                        }
                        else{
                            return res.send(400, {code:4,message:"未到开奖时间w"});
                        }
                    }
                    else{
                        return res.send(400, {code:4,message:"未到开奖时间n"});
                    }
                });
            }
        });
    });

}

/*
 * 查询单个用户某次抽奖中奖结果
 * 奖品类型（0 微信红包 1卡券 2实物 3电子码 4链接）
 * */
exports.getUserWinInfo=function(req,res){
    var openId=req.param("openId");
    var lotteryid=req.param("lotteryid");
    if(!lotteryid){
        return res.send(500,"param lotteryid is required");
    }
    //判断是否开奖了
    popRedisClient.HGET("sysLotteryDataKeys_noWin",lotteryid,function(err,lotteryInfo) {
        if(err){
            return res.send(500,"err"+err);
        }
        if (lotteryInfo) {
            var lotteryObj = JSON.parse(lotteryInfo);
            //验证异常行为用户
            checkAbnormalUser.setUsersBlackList(lotteryObj,openId);
            //到开奖时间
            if(lotteryObj.end <=(new Date()).getTime()){
                popRedisClient.HGET(lotteryid+"wins",openId,function(err,doc){
                    if(err){
                        return res.send(500,"getwins"+err);
                    }
                    //中奖
                    if(doc){
                        var docObj=JSON.parse(doc);
                        if(docObj.user){
                            docObj.user.prize.flag=0; //0中奖
                            console.log(docObj.user.prize);
                            //if(docObj.user.prize.type==typeConfig.prizeType.goods){
                                //console.log("设置orderId"+docObj.orderId);
                                //docObj.user.prize.orderId=docObj.orderId;
                            //}
                            docObj.user.prize.datetime=moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
                            docObj.user.prize.createTime=docObj.createTime;//+"_"+lotteryid;
                            docObj.user.prize.sysLotteryID=lotteryid;
                            docObj.user.prize.orderId=docObj.orderId;
                            console.log("返回奖品信息:"+JSON.stringify(docObj.user.prize));
                            return res.send(200,docObj.user.prize);
                        }
                        else if(docObj.money){
                            docObj.prize.flag=0;
                            docObj.prize.type=102;
                            docObj.prize.pic="http://q.cdn.mtq.tvm.cn/adsmall/hb.jpg";
                            docObj.prize.orderId=docObj.orderId; //orderid
                            docObj.prize.createTime=docObj.createTime;//+"_"+lotteryid;
                            docObj.prize.sysLotteryID=lotteryid;
                            docObj.prize.datetime=moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
                            console.log("返回红包信息:"+JSON.stringify(docObj.prize));
                            return res.send(200,docObj.prize);
                        }
                        else {
                            setPirze(req,res,lotteryid,openId,lotteryObj);
                        }
                    }
                    //未中
                    else{
                        setPirze(req,res,lotteryid,openId,lotteryObj);
                    }
                });
            }else{
                return res.send(200,{code:4,message:"no1"});
            }
        }
        else {
            return res.send(200,{code:4,message:"no2"});
        }
    });


}

function setPirze(req,res,lotteryid,openId,lotteryObj) {
    var userName = req.param("name");
    if (!userName || 'undefined' == userName) {
        return res.send(500, "param name is required");
    }
    var icon = req.param("icon");
    if (!icon || 'undefined' == icon) {
        return res.send(500, "param icon is required");
    }
    var sex = req.param("sex");
    var realIp = req.realIp; //ip地址
    console.log("用户未中奖 手动分配");
    //未中奖分配默认奖
    var prizes = lotteryObj.money.prizes;
    console.log(prizes)
    if (prizes && prizes.length > 0) {
        //数量最多的奖品
        var lastPrize = _.max(prizes, function (prize) {
            return parseInt(prize.count);
        });
        prizeCollection.findById(lastPrize.id, function (err, o) {
            if ((lastPrize.type == typeConfig.prizeType.goods
                || lastPrize.type == typeConfig.prizeType.link
                || lastPrize.type == typeConfig.prizeType.wxcard)) {
                console.log("lastPrize.count:" + o.count);
                if (o.count <= 0) {
                   return res.send(500, "库存不足");
                }
            }
            sendLastPrize(lotteryObj, lastPrize, userName, lotteryid, res, icon, openId, sex, realIp);
        });
    }
    else {
        return res.send(500, "配置错误");
    }
}

function sendLastPrize(lotteryObj,lastPrize,userName,lotteryid,res,icon,openId,sex,realIp){

    orders.createLottery(
        lotteryObj,
        {   prize:lastPrize,
            user:{
                name:userName,
                icon:icon,
                openId:openId,
                sex:sex,
                realIp:realIp
            }
        }
        ,function(err,myOrder){

            if(err){
                return res.send(200,"get order "+JSON.stringify(err));
            }
            if(myOrder && myOrder.user && myOrder.prize) {
                popRedisClient.HDEL(lotteryid, myOrder.user.openId,function(err,hdelresult){
                    popRedisClient.HSET(lotteryid+"readyusers", myOrder.user.openId,
                        JSON.stringify(myOrder.user),
                        function(err,hdelresult){

                        }
                    )
                    var winUser= _.extend({},{user:myOrder.user});
                    winUser.user.prize=myOrder.prize;
                    popRedisClient.HSET(lotteryid+"wins",
                        myOrder.user.openId,
                        JSON.stringify(winUser),function(err,doc){
                            console.log("sysLotteryRedis wins "+err);
                            console.log(doc);
                        });
                })
                console.log("myOrder.prize.type==typeConfig.prizeType.goods "
                    +myOrder.prize.type==typeConfig.prizeType.goods)
                myOrder.prize.orderId=myOrder._id;
                console.log("未中奖 手动分配 "+myOrder.prize.orderId)
                myOrder.prize.flag=0; //0中奖
                myOrder.prize.createTime=myOrder.createTime;//+"_"+lotteryObj.key;
                myOrder.prize.sysLotteryID=lotteryObj.key;

                return res.send(200,myOrder.prize);
            }else{
                return res.send(500,"订单错误")
            }
        }
    );
}

/*
* 所有获得非红包奖品的信息
* */
exports.getUserWinInfo2=function(req,res){
    var openId=req.param("openId");
    var lotteryid=req.param("lotteryid");
    if(!lotteryid){
        return res.send(500,"param lotteryid is required");
    }
    var userName = req.param("name");
    if (!userName || 'undefined' == userName) {
        return res.send(500, "param name is required");
    }
    var icon = req.param("icon");
    if (!icon || 'undefined' == icon) {
        return res.send(500, "param icon is required");
    }
    var sex = req.param("sex");
    var realIp = req.realIp; //ip地址
    var CUser={
        name:userName,
        icon:icon,
        openId:openId,
        sex:sex,
        realIp:realIp
    };

    popRedisClient.HGET("sysLotteryDataKeys_noWin_prize",lotteryid,function(err,lotteryInfo) {
        if(err){
            return res.send(500,"err"+err);
        }
        if (lotteryInfo) {

            var lotteryObj = JSON.parse(lotteryInfo);
            //验证异常行为用户
            checkAbnormalUser.setUsersBlackList(lotteryObj,openId);
            //到开奖时间
            if(lotteryObj.end <=(new Date()).getTime()){
                popRedisClient.HGET(lotteryid+"wins",openId,function(err,doc){
                    if(err){
                        return res.send(500,"getwins"+err);
                    }
                    //中奖
                    if(doc){
                        var docObj=JSON.parse(doc);
                        if(docObj.user){
                            docObj.user.prize.flag=0; //0中奖
                            console.log(docObj.user.prize);
                            docObj.user.prize.datetime=moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
                            docObj.user.prize.createTime=docObj.createTime;//+"_"+lotteryid;
                            docObj.user.prize.sysLotteryID=lotteryid;
                            docObj.user.prize.orderId=docObj.orderId;
                            console.log("返回奖品信息:"+JSON.stringify(docObj.user.prize));
                            return res.send(200,docObj.user.prize);
                        }
                        else if(docObj.money) {
                            docObj.prize.flag = 0;
                            docObj.prize.type = 102;
                            docObj.prize.pic = "http://q.cdn.mtq.tvm.cn/adsmall/hb.jpg";
                            docObj.prize.orderId = docObj.orderId; //orderid
                            docObj.prize.createTime = docObj.createTime;//+"_"+lotteryid;
                            docObj.prize.sysLotteryID = lotteryid;
                            docObj.prize.datetime = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
                            console.log("red info:" + JSON.stringify(docObj.prize));
                            return res.send(200, docObj.prize);
                        }
                        else {
                            setPrizeN(req,res,lotteryObj,CUser);
                        }
                    }
                    //未中
                    else{
                        setPrizeN(req,res,lotteryObj,CUser);
                    }
                });
            }else{
                return res.send(200,{code:4,message:"no1"});
            }
        }
        else {
            return res.send(200,{code:4,message:"no2"});
        }
    });
}
/*
* 分发奖品
* */
function setPrizeN(req,res,lotteryObj,user) {

    if (lotteryObj.money && lotteryObj.money.prizes) {
        var LotteryPrizes = lotteryObj.money.prizes;
        if (LotteryPrizes.length > 0) {
            var prize = LotteryPrizes[0];
            var maxRatePrize = _.max(LotteryPrizes, function (prize) {
                return parseInt(prize.rate, 10)
            });
            var maxRate=maxRatePrize.rate;
            setUserPrize(lotteryObj, LotteryPrizes, +prize.rate, user, maxRate,  function (err, order) {
                if (err) {
                    return res.send(500, "库存不足")
                }
                if (order) {
                    //添加到订单记录
                    console.log("order.user:"+JSON.stringify(order.user));
                    var winUser = _.extend({}, {user: order.user});
                    winUser.user.prize = order.prize;
                    winUser.orderId = order._id;
                    winUser.createTime = order.createTime;
                    winUser.openId = order.user.openId;
                    popRedisClient.HSET(lotteryObj.key + "wins", order.user.openId,
                        JSON.stringify(winUser), function (err, doc) {
                            console.log("sysLotteryRedis wins " + err);
                            console.log(doc);
                        }
                    );
                    order.prize.orderId = order._id;
                    console.log("未中奖 手动分配 " + order.prize.orderId)
                    order.prize.flag = 0; //0中奖
                    order.prize.createTime = order.createTime;//+"_"+lotteryObj.key;
                    order.prize.sysLotteryID = lotteryObj.key;
                    return res.send(200, order.prize);
                }
                else {
                    return res.send(500, "订单错误")
                }
            });

        }else{
            return res.send(500, "lotteryObj no prize info")
        }
    } else {
        return res.send(500, "lotteryObj err")
    }
}
function setUserPrize(lotteryObj,LotteryPrizes,rate,user,maxRate,cb) {
    var rateNum = rate ;
    if (rateNum > maxRate) {
        console.log("rateNum:"+rateNum);
        return cb("rateNum > maxRate")
    }
    lotterySetRedisPrize.HINCRBY(lotteryObj.key + ":prizeCount", rateNum, -1, function (err, num) {
        //查到对应等级的奖品信息
        var prizeInfo = _.find(LotteryPrizes, function (prize) {
            return prize.rate == rateNum;
        });
        if (num >= 0) { // 为0 是最后一个奖品
            user.prize = prizeInfo;
            orders.createLottery(lotteryObj, {prize: user.prize, user: user},
                function (err, dborder) {
                    if(err){
                        return cb("order err"+err);
                    }
                    if(dborder){
                        return cb(null,dborder);
                    }else{
                        return cb("order null")
                    }
                }
            );
        } else {
            //上一等级的奖品发完  发下一等级 sysLotteryDataKeys_noWin_prize
            //删除该奖品信息 计数器会有负数 但不影响
            LotteryPrizes.splice(LotteryPrizes.tvm_indexOf(prizeInfo),1);
            lotteryupdRedisLotte.HSET("sysLotteryDataKeys_noWin_prize", lotteryObj.key,
                JSON.stringify(lotteryObj), function (err, doc) {
                    console.log("sysLotteryDataKeys_noWin_prize:" + doc);
                }
            );
            setUserPrize(lotteryObj, LotteryPrizes, 1+rate, user, maxRate,cb);
        }
    });
}
Array.prototype.tvm_indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
/*
* 获取某次抽奖的奖品信息
* */
exports.getLotteryPrizes=function(req,res){
    var lotteryId=req.param("lotteryid");
    if(!lotteryId){
        return res.send(500,"param lotteryid is required");
    }
    sysLotteryCreate.getSysLotteryInfo(lotteryId, function (err, doc) {
        if(err){
            return res.send(500,err);
        }
        var prizes=[];
        if(doc){
            if(doc.prizes){
                var prizeIds=_.pluck(doc.prizes,"id")
                prizeCollection.find({_id:{"$in":dbUtils.toId(prizeIds)}},{},{},function(err,prizesDoc){
                    if(err){
                        return res.send(500,err);
                    }
                    _.each(prizesDoc,function(prize){
                        console.log(prize)
                        console.log(doc.prizes)
                        var p= _.find(doc.prizes,function(p){
                            return p.id==prize._id
                        });
                        console.log(p)
                        var prate=(p==undefined)?null: p.rate;
                        prizes.push({
                            rate:  prate,
                            name:prize.name,
                            pic:prize.pic
                        })
                    });
                    return res.send(200,prizes);
                });
            }else if (doc.money) {
                res.send(200,"money");
            }else{
                res.send(400,"doc not prize money");
            }
        }else{
            res.send(404,"not find lottery by id "+lotteryId);
        }
    });
}

/*
*获取系统抽奖的总金额
* */
exports.getMoney=function(req,res){
    var lotteryId=req.param("lotteryid");
    if(!lotteryId){
        return res.send(500,"param lotteryid is required");
    }
    //获取抽奖的人均金额 乘以人数
    sysLotteryCreate.getSysLotteryInfo(lotteryId, function (err, doc) {
        if(err){
            return res.send(500,err);
        }
        if(!doc){
            return res.send(404,"not found lottery by id "+ lotteryId);
        }
        if(doc.money || doc.type==typeConfig.sysLotteryType.money){

            //验证异常行为用户
            checkAbnormalUser.setUsersBlackList(lotteryId,req.openId);

            //allUsers readyusers
            popRedisClient.HLEN(lotteryId+"allUsers", function (err, len) {
                if (err) {
                    return res.send(500, err);
                }
                var t=parseInt((doc.money.average * len).toFixed(4),10);
                //var t=(doc.money.average * len).toFixed(2);
                console.log("当前总金额:"+t);
                return res.send(200, t);
            });
           /* popRedisClient.GET(doc._id+"money",function(err,money){
               if(err){
                   return res.send(500,err);
               }
                if(money){
                    money=parseInt(money,10);
                    res.send(200,money);
                }else {
                    //获取redis中人员数量 hlen
                    popRedisClient.HLEN(lotteryId+"readyusers", function (err, len) {
                        if (err) {
                            return res.send(500, err);
                        }
                        var t=parseInt((doc.money.average * len).toFixed(4),10);
                        return res.send(200, t);
                    });
                }
            });*/

        }else{
            return res.send(500,"not money");
        }
    });

}


/*
 * 在添加用户前判断该用户是否已经存在 未使用
 * */
function checkExistUser(lotteryid,openid,cb){
    popRedisClient.HGET(lotteryid,openid,function(err,doc){
        if(err){
            cb(err);
        }else{
            cb(null,doc);
        }
    });
}

/*
 * 在添加抽奖前判断该抽奖是否已经存在
 * */
function checkRedisExistLottery(lotteryid,cb){
    popRedisClient.HGET("sysLotteryDataKeys",lotteryid,function(err,doc){
        if(err){
            cb(err);
        }else{
            cb(null,doc);
            /*if(doc==null){
                popRedisClient.HGET("sysLotteryDataKeys_noWin",lotteryid,function(nerr,ndoc){
                    cb(null,ndoc);
                });
            }else{
                cb(null,doc);
            }*/
        }
    });
}


function checkRedisExistLotteryforNotWin(lotteryid,cb) {
    popRedisClient.HGET("sysLotteryDataKeys", lotteryid, function (err, doc) {
        if (err) {
            cb(err);
        } else {
            if (doc == null) {
                popRedisClient.HGET("sysLotteryDataKeys_noWin", lotteryid, function (nerr, ndoc) {
                    cb(null, ndoc);
                });
            } else {
                cb(null, doc);
            }
        }
    });
}

function groupmoney(newMoney){
    var r=_.groupBy(newMoney,function(o){
        return o.prize.rate
    })
    var resultt=[];
    _.each(r,function(p,key){
        var t={
            rate: key,
            name:"",
            money:"",
            type:typeConfig.prizeType.wxred,
            prizeInfo:"红包",
            pic:"http://q.cdn.mtq.tvm.cn/adsmall/hb.jpg",
            users:[]
        }
        _.each(p,function(obj){
            t.name=obj.prize.name;
            t.money=obj.prize.money;
            t.users.push({
                name:obj.name,
                icon:obj.icon
            })
        });

        t.count= t.users.length;
        t.users=t.users.splice(0,10);
        resultt.push(t);
    });
    return resultt;
}
function groupprize(doc){
    var resultt=[];
    var r=_.groupBy(doc,function(o){
        return o.user.prize.rate
    })
    _.each(r,function(p,key){
        var t={
            rate: key,
            name:"",
            pic:"",
            users:[],
            type:"",
            prizeInfo:""
        }
        _.each(p,function(obj){
            t.name=obj.user.prize.name;
            t.prizeInfo=obj.user.prize.name;
            t.pic=obj.user.prize.pic;
            t.type=obj.user.prize.type;
            t.users.push({
                name:obj.user.name,
                icon:obj.user.icon
            });
        });
        resultt.push(t);
    });

    return resultt;
}

function formateWinList(result){
    var t=[];
    _.each(result,function(prize){
        _.each()
    })
    return t;
}
/*
* 如果是系统抽奖中的红包类型  需要根据人数和人均金额进行计算
* */
function setLotteryTotalMoney(lottery){
    if(lottery.money || lottery.type==1){

        popRedisClient.INCRBYFLOAT(lottery.key+"money",lottery.money.average)
        /*popRedisClient.HLEN(lottery.key+"readyusers",function(err,len){
            if(err){
                return ;
            }
        });*/
    }
}

//清理之前的开奖信息
function clearUsersAndWinUsersAsync(myLottery,cb){
    var lotteryId=myLottery.key;
    async.parallel([
        //删除已接收的用户
        function(cb){
            popRedisClient.DEL(lotteryId,function(err,doc){
                console.log("del lotteryid "+doc+" lotteryId "+lotteryId);
                cb();
            })
        },
        //删除中奖用户
        function(cb){
            popRedisClient.DEL(lotteryId+"wins",function(err,doc){
                console.log("del lotteryid wins "+doc+" lotteryId "+lotteryId);
                cb();
            })
        },
        //删除奖池金额
        function(cb){
            popRedisClient.DEL(lotteryId+"money",function(err,doc){
                console.log("del lotteryid money "+doc+" lotteryId "+lotteryId);
                cb();
            })
        },
        //删除已中奖用户
        function(cb){
            popRedisClient.DEL(lotteryId+"readyusers",function(err,doc){
                console.log("del lotteryid readyusers "+doc+" lotteryId "+lotteryId);
                cb();
            })
        },
        //删除已开奖的信息 sysLotteryDataKeys_noWin
        function(cb){
            popRedisClient.HDEL("sysLotteryDataKeys_noWin",lotteryId,function(err,doc){
                console.log("del sysLotteryDataKeys_noWin "+doc+" lotteryId "+lotteryId);
                cb();
            });
        },
        //删除抽奖中的高级奖品
        function(cb){
            popRedisClient.DEL(lotteryId+"winsHighRate",function(err,doc){
                console.log("del lotteryid winsHighRate "+doc);
                cb();
            })
        },
        //删除winsMoney
        function(cb){
            popRedisClient.DEL(lotteryId+"winsMoney",function(err,doc){
                console.log("del lotteryid winsMoney "+doc);
                cb();
            })
        },
        //lotteryId+"winsList"
        function(cb){
            popRedisClient.DEL(lotteryId+"winsList",function(err,doc){
                console.log("del winsList winsMoney "+doc);
                cb();
            })
        },
        //lotteryId+"allUsers"
        function(cb){
            popRedisClient.DEL(lotteryId+"allUsers",function(err,doc){
                console.log("del allUsers  "+doc);
                cb();
            })
        },
        //winsRateMoney 中1等奖的红包用户
        function(cb){
            popRedisClient.DEL(lotteryId+"winsRateMoney",function(err,doc){
                console.log("del winsRateMoney  "+doc);
                cb();
            })
        },
        //sysLotteryMoneyRedis 新实例中红包用户
        function(cb){
            sysLotteryMoneyRedis.DEL(lotteryId+"nWinsMoney",function(err,doc){
                console.log("del nWinsMoney  "+doc);
                cb();
            })
        },
        //set 集合用户
        function(cb){
            sysLotteryMoneyRedis.DEL(lotteryId+":set",function(err,doc){
                console.log("del :set  "+doc);
                cb();
            })
        },
        //lottery prizeCount
        function(cb){
            sysLotteryMoneyRedis.DEL(lotteryId+":prizeCount",function(err,doc){
                console.log("del :prizeCount  "+doc);
                cb();
            })
        }
    ],function(err,result){
        cb();
    });
}

/*
* 检查黑名单信息  不再 在接收用户时检查
* */
function checkBlackList(user,cb){
    var openId=user.openId;
   /* //  只验证异常用户
   sysLotteryRedisBlack.get("AbnormalBehaviorUser"+openId,function(err,value){
        if(err){
            return cb(false);
        }
        if(value){
            return cb(true);
        }else{
            return cb(false);
        }
    });
    return;*/
    //return cb(false);
    async.waterfall(
        [
            //1等奖 48小时黑名单
            function(callback){
                sysLotteryRedisBlack.get("userBlackList"+openId,function(err,value){
                    if(err){
                        callback(null,false)
                    }
                    if(value){
                        callback(null,true)
                    }else{
                        callback(null,false)
                    }
                });
            }
            //2等奖黑名单 次数超过3次的不再接收用户
            ,function(existsBlack,callback) {
            if (existsBlack) {
                callback(null, existsBlack);
            }
            else {
                //2等奖黑名单 次数超过3次的不再接收用户
                sysLotteryRedisBlack.get("rate2userBlackList"+openId,function(err,value){
                    if(err){
                        callback(null,false);
                    }
                    if(value>=3){
                        callback(null,true);
                    }else{
                        callback(null,false);
                    }
                });
            }
        }
            //异常行为用户
            ,function(existsBlack,callback) {
                if (existsBlack) {
                    callback(null, existsBlack);
                }
                else {
                sysLotteryRedisBlack.get("AbnormalBehaviorUser" + openId, function (err, value) {
                    if (err) {
                        callback(null, false);
                    }
                    if (value) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                });
            }
        }
        ]
        ,function(err,exists){
            if(err){
                return cb(false);
            }
            return cb(exists);
        }
    );
    /*sysLotteryRedisBlack.get("userBlackList"+openId,function(err,value){
        if(err){
            return cb(false);
        }
        if(value){
            return cb(true);
        }else{
            return cb(false);
        }
    });
    //2等奖黑名单 次数超过3次的不再接收用户
    sysLotteryRedisBlack.get("rate2userBlackList"+openId,function(err,value){
        if(err){
            return cb(false);
        }
        if(value>=3){
            return cb(true);
        }else{
            return cb(false);
        }
    });*/
}

