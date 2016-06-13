/**
 * Created by luosm on 2015/7/6.
 * 订单信息
 */
var _                 = require('underscore');
var dbUtils           = require('../mongoSkin/mongoUtils.js');
var ordersCollection  = new dbUtils('order');
var queueUtil         = require('../queue/redisQueue.js');
var rubbishCollection   = new dbUtils('rubbish');
var typeConfig        = require('./typeConfig.js');
var mPrize            = require('./prize.js');
var userinfoCollection  = new dbUtils('userinfo');
var countCollection = new dbUtils('order');
var moment = require('moment');
var tools       = require('../tools');
var redisClient = tools.redisClient();
var ObjectID          = require('mongodb').ObjectID;
var excel = require('./excel');
/*
redisClient.select(0, function() {
    console.log('百条订单 database 0');
});
*/


function checkparam(req){
    var dbOption={};
    var order      = req.body.order;
    if(order){
        var prizeName  = order.name;
        var prizeType  = order.type;
        var orderState = order.state;
        var startTime  = order.startTime;
        var endTime    = order.endTime;

        if(prizeName){
            dbOption= _.extend(dbOption,{"prize.name":prizeName});
        }
        if(prizeType){
            if(prizeType==typeConfig.prizeType.wxred){ //红包分为两种 在prize下和在money下
                dbOption= _.extend(dbOption,{"$or":[{"prize.type":parseInt(prizeType)},
                    {"money.type":parseInt(prizeType)}]});
            }else{
                dbOption= _.extend(dbOption,{"prize.type":parseInt(prizeType)});
            }
        }
        if(orderState){
            dbOption= _.extend(dbOption,{"state":parseInt(orderState)});
        }
        if(startTime){
            dbOption= _.extend(dbOption,{"dateTime":{$gte: new Date(startTime)}});
        }
        if(endTime){
            dbOption= _.extend(dbOption,{"dateTime":{$lt: new Date(endTime)}});
        }
        if (startTime && endTime){
            dbOption= _.extend(dbOption,{"dateTime":{$gte: new Date(startTime), $lt: new Date(endTime)}});
        }
    }
    return  dbOption;
}

exports.getOrders=function(req,res){
    var tvmId      = req.tvmId;
    if(!tvmId){
        return res.send(400,"tvmId lost");
    }
    var dbOption=checkparam(req);
    dbOption= _.extend(dbOption,{"tvmId":tvmId});
    console.log(dbOption);
    //return res.send(200,option); ,skip:req.pageSpec.skip ,limit: req.pageSpec.limit
    console.log(req.pageSpec)
    ordersCollection.findNoCache(dbOption,{},
        {sort: {dateTime: -1},skip:req.pageSpec.skip ,limit: req.pageSpec.limit},
        function(err,doc){
        if(err){
            res.send(500,err);
        }else{
            _.each(doc,function(order){
                order.dateTime=moment(new Date(order.dateTime)).format("YYYY/MM/DD HH:mm:ss");
            });

            ordersCollection.countNoCache(dbOption,function(err,count){
                if(err){
                    res.send(200,{count:-1,arr:doc});
                }else{
                    res.send(200,{count:count,arr:doc});
                }
            });

           /* redisClient.get("tvmidorders"+tvmId,function(err,orderscount){
                if(err){
                    res.send(200,{count:-1,arr:doc});
                }else{
                    res.send(200,{count:orderscount,arr:doc});
                }
            })*/
        }
    });
}
/*
* 根据id删除订单
* */
exports.delOrders=function(req,res){

    var tvmId      = req.tvmId;
    if(!tvmId){
        return res.send(400,"tvmId lost");
    }
    var orderid=req.param("id");
    if(!orderid){
        return res.send(400,"orderid is required");
    }else{

        ordersCollection.removeById(orderid,function(err,doc){
            if(err){
                res.send(400,err);
            }else{
                if(_.isNumber(doc)){
                    //根据tvmid 存储订单总数
                    redisClient.INCRBY("tvmidorders"+tvmId,-doc,function(err,doc){

                    });
                }
                res.send(200,doc);
            }
        });
    }
}
/*
 * 根据ids删除订单
 * */
exports.delOrdersMulti=function(req,res){

    var tvmId      = req.tvmId;
    if(!tvmId){
        return res.send(400,"tvmId lost");
    }
    var orderids=req.body.ids;
    if(!orderids || orderids.length==0){
        return res.send(400,"orderids is required");
    }
    var _ids=[];
    var allValid=true;
    _.each(orderids,function(id){
        if(!ObjectID.isValid(id)){
            _ids.push(id);
            allValid=false;
        }
    })
    if(!allValid){
        return res.send(500, 'ids not Valid '+(_ids));
    }

    ordersCollection.remove({"_id":{$in:dbUtils.toId(orderids)}},function(err,doc){
        console.log(err);
        console.log(doc);
        return res.send(200,doc);
    })


}

/*
*
* */
exports.updateOrder=function(req,res){
    var orderId = req.body.orderId;
    if(!orderId){
        return res.send(500,"orderId is requied");
    }
    var courier = req.body.courier;
    if(!courier){
        return res.send(500,"courier is requied");
    }
    ordersCollection.updateById(orderId,{"$set":{state:typeConfig.orderType.Delivered,
        "courier":courier}},function(err,doc){
        if(err){
            return res.send(400,err);
        }else{
            return res.send(200,doc);
        }
    });
}

/*
* 订单完成
* */
exports.updateCompleteOrder=function(req,res){
    var orderId = req.body.orderId;
    if(!orderId){
        return res.send(500,"orderId is requied");
    }
    ordersCollection.updateById(orderId,{"$set":{state:typeConfig.orderType.Complete}}
        ,function(err,doc){
        if(err){
            return res.send(400,err);
        }else{
            return res.send(200,doc);
        }
    });
}


exports.createLottery=function(lottery,myOrder,cb){
    var prize=myOrder.prize;
    (function(prize,myOrder,lottery){
        prize._id=prize.id;
        mPrize.getPrizeLotteryInfo(prize,function(err, ext){
            if(err){
                console.log(err);
                console.log("getPrizeLotteryInfo ERR:"+JSON.stringify(prize));
                return cb(err);
            }else{
                //console.log("getPrizeLotteryInfo OKOK")
                var order = {
                    yyyappId: prize.yyyappId,
                    tvmId: prize.tvmId,
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
                        name:myOrder.user.name,
                        icon:myOrder.user.icon,
                        sex: myOrder.user.sex,
                        realIp: myOrder.user.realIp,
                        openId:myOrder.user.openId
                    },
                    dateTime: new Date().getTime(),
                    createTime: lottery.createTime, //抽奖的开拍时间
                    //crazyLotteryId: crazylottery._id.toString(),
                    sysLotteryID:lottery.key.toString(),
                    _id: new dbUtils.ObjectID(),
                    queueDataCollection: 'order'
                };
                order.prize = _.extend(order.prize, ext);
                prize = _.extend(prize, ext);
                //console.log("order.prize.type!=typeConfig.prizeType.link:"+(order.prize.type!=typeConfig.prizeType.link))
                //if(order.prize.type!=typeConfig.prizeType.link){//不存储链接
                    console.log(" queueUtil.push order ")
                    queueUtil.push(order);
                //}
                if (prize.type == typeConfig.prizeType.goods){
                    prize.orderId = order._id
                }
                cb(null,order);
            }
        });
    })(prize,myOrder,lottery)
}


exports.createSysLotteryMoneyOrder=function(lottery,user,cb){
    var order={
        tvmId: lottery.tvmId,
        yyyappId: lottery.yyyappId,
        state:typeConfig.orderType.Delivered,
        user:{
            name:user.name,
            icon:user.icon,
            openId:user.openId,
            sex:user.sex,
            realIp:user.realIp
        },
        money: user.money,
        prizeMoney: user.prize,
        dateTime: new Date().getTime(),
        createTime:lottery.createTime,//开拍时间
        sysLotteryID:lottery.key.toString(),
        sysLotteryType:lottery.type, //系统抽奖类型
        _id: new dbUtils.ObjectID(),
        queueDataCollection: 'order'
    }
    cb(null,order);
    console.log("to queueUtil push");
//    countWxredSumAndNum(order);   //将订单的统计转移到queuePop文件中
    queueUtil.push(order);

}

/*
 * open 如果是实物奖品 需要设置地址
 * */
exports.setAddress=function(req,res){
    var openId   = req.user.openId;
    if(!openId){
        return res.send(404,"openId is required")
    }
    var orderId  = req.body.orderId; //所属订单id
    if(!orderId || 'undefined'==orderId){
        return res.send(404,"orderId is required")
    }
    var receive  = req.body.receive;
    if(!receive){
        return res.send(404,"receive is required")
    }
    var receiveInfo={
        name     : receive.name,
        phoneNum : receive.phoneNum,
        address  : receive.address
    }

    //收集用户收货地址
    userinfoCollection.save(_.extend({
        openid:openId,
        datetime:new Date()
    },receive),function(err,result){
        console.log(err)
        console.log(result)
    });

    var updateinfo={
        queueDataCollection:"order",
        updateAction:{
            _id:orderId,
            action:{"$set":{"address":receive}}
        }
    }
    queueUtil.push(updateinfo);
    res.send(200,"ok");
}


/*
*
* */
exports.getLotteryRank = function(req,res){
    var yyyappid = req.param('yyyappid')
    if (!yyyappid){
        return res.send(400, 'param yyyappid is required!')
    }

    redisClient.LRANGE("lottery-rank-" + yyyappid, 0, 150, function(err, arr){
        if(err){
            res.send(500,err);
        }else{
            console.log(arr)
            var someOrders = [];
            _.each(arr, function(o){
                var order = JSON.parse(o)
                if(order.user){
                    var u = {
                        name: order.user.name,
                        icon: order.user.icon,
                        dateTime: Math.ceil(order.dateTime / 1000)
                    };
                    if (order.prize){
                        u.prize = order.prize.name
                        u.type = order.prize.type
                        if (u.type = typeConfig.prizeType.wxred){
                            u.money = order.prize.money?order.prize.money:1
                        }
                    } else if (order.money){
                        u.prize = order.money.name
                        u.money = order.money.money
                        u.type = typeConfig.prizeType.wxred
                    } else {
                        u.prize = '奖品'
                    }
                    if (u.type == typeConfig.prizeType.goods){
                        u.prizeInfo = '实物大奖'
                    } else if (u.type == typeConfig.prizeType.wxred){
                        u.prizeInfo = '红包'
                    } else {
                        u.prizeInfo = '大奖'
                    }
                    if(u.money){
                        u.money = parseFloat(u.money).toFixed(2)
                    }
                    if (order.dateTime < new Date().getTime() - 9000 && u.type == typeConfig.prizeType.wxred){
                        someOrders.push(u)
                    }
                }
            })
            res.send(someOrders);
        }
    });
}

/*
* 获取用户所有订单信息
* */
exports.getOrdersByUser=function(req,res){
    console.log("req.pageSpec "+JSON.stringify(req.pageSpec));

    var dbOption={"user.openId":req.openId};

    ordersCollection.find(dbOption,{},
        {sort: {dateTime: -1},
            skip:req.pageSpec.skip ,
            limit: req.pageSpec.limit
        },function(err,doc){
        if(err){
            res.send(500,err);
        }else{
            var prizes=[];
            _.each(doc,function(lottery){
                if(lottery.prize){ //一般奖品
                    /*delete lottery.prize.id; //删除奖品id*/
                    lottery.prize.orderId=lottery._id;
                    lottery.prize.receiveInfo=lottery.address;
                    if(lottery.courier){
                        lottery.prize.courier=lottery.courier; //物流信息
                        lottery.prize.state=typeConfig.orderType.Delivered;
                    }else{
                        lottery.prize.courier=-1;//没有物流信息
                        lottery.prize.state=typeConfig.orderType.NonDelivery;
                    }
                    //中奖时间
                    lottery.prize.datetime= moment(new Date(lottery.dateTime)).format("YYYY/MM/DD HH:mm:ss");
                    //设置实物的过期时间
                    if(lottery.prize.type==typeConfig.prizeType.goods && lottery.prize.expiredDay){
                        var et=lottery.prize.expiredDay*24*60*60*1000; //过期毫秒数
                        if((new Date()).getTime()- lottery.dateTime>et){
                            lottery.prize.expired=0; //过期
                        }else{
                            lottery.prize.expired=1; //未过期
                        }
                        lottery.prize.expiredTime=et; //过期毫秒
                    }

                    if(lottery.prize.type==typeConfig.prizeType.wxcard ||
                        lottery.prize.type==typeConfig.prizeType.wxred){

                        if(lottery.wxstate==1){
                            lottery.prize.wxstate=lottery.wxstate;//微信红包/微信卡券领取状态 0未领  1已领
                        }else{
                            lottery.prize.wxstate=0;
                        }
                    }
                    lottery.prize.orderId=lottery._id;
                    lottery.prize.createTime=lottery.createTime;//+"_"+lottery.sysLotteryID;
                    lottery.prize.sysLotteryID=lottery.sysLotteryID;
                    console.log("物品奖品信息"+JSON.stringify(lottery.prize));
                    prizes.push(lottery.prize);
                }
                else if(lottery.money){
                    lottery.money.orderId=lottery._id;
                    lottery.money.datetime= moment(new Date(lottery.dateTime)).format("YYYY/MM/DD HH:mm:ss");

                    var _prize={};
                    _prize.orderId=lottery._id;
                    _prize.name=lottery.money.name;
                    _prize.type=102;
                    _prize.pic=lottery.money.pic?lottery.money.pic:"http://q.cdn.mtq.tvm.cn/adsmall/hb.jpg";
                    _prize.rate=lottery.money.rate;
                    _prize.wxRedLotteryId=lottery.money.wxRedLotteryId;
                    _prize.datetime=lottery.money.datetime;
                    if(lottery.wxstate==undefined){
                        _prize.wxstate=0;
                    }else{
                        _prize.wxstate=lottery.wxstate; //微信红包/微信卡券领取状态 0未领  1已领
                    }
                    _prize.createTime=lottery.createTime;//+"_"+lottery.sysLotteryID;
                    _prize.sysLotteryID=lottery.sysLotteryID;
                    console.log("红包奖品信息"+JSON.stringify(_prize));
                    prizes.push(_prize);
                }
            });


            ordersCollection.countNoCache(dbOption,function(err,count){
                if(err){
                    res.send(200,{count:-1,arr:doc});
                }else{
                    var result={
                        pages:Math.ceil(count/req.pageSpec.limit),
                        count:count,
                        prizes:prizes
                    };
                    res.send(200,result);
                }
            });

        }
    });
}

/*
导出订单
* */
exports.exportorder = function(req, res) {
    var tvmId = req.tvmId;
    if(!tvmId){
        return res.send(400,"tvmId lost");
    }
    var args = req.param("args");
    console.log("******args: %j", args);
    if (!args) {
        return res.send(400,"args is null");
    }
    if ('string' == typeof args) {
        args = JSON.parse(args);
    }
    var temp = {body: args};

    var dbOption = checkparam(temp);
    dbOption =  _.extend(dbOption, {"tvmId" : tvmId});
    var idList = args.orderIdList;
    if (idList.length > 0) {    //存在过滤orderid单独处理
        var objectIdList = [];
        for (var index in idList) {
            var orderId= idList[index];
            objectIdList.push(new ObjectID(orderId));
        }
        dbOption = _.extend(dbOption, {"_id" : {"$in" : objectIdList}});
    }
    console.log(dbOption);
    ordersCollection.find(dbOption, {}, function(err, docs){
        if (!!err) {
         return res.send(500, err);
         }
        if (docs.length <= 0) {
            return res.send(500, "no orders");
        }
        var sheets = [];
        var nameMap = {};
        _.each(docs, function (o) {
            var prizeName = ""; //奖品名称
            var prizeType = ""; //奖品类型
            var nickName = "";  //中奖人昵称
            var userName = "";  //中奖姓名
            var phoneNum = "";  //手机号
            var address = "";   //家庭住址
            var openId = "";    //openid
            var orderId = o._id ? o._id.toString() : "";   //订单号
            var prizeTime = o.dateTime ? new Date(o.dateTime).toLocaleString() : ""; //中奖时间
            var orderState = o.state ? o.state : "";    //订单状态
            var money = "";      //微信红包的金额
            var shoppingCard = "";  //第三方消费码
            if (o.prize) {
                prizeName = o.prize.name;
                prizeType = o.prize.type;
                if (o.prize.money) {
                    money = o.prize.money;
                }
                if (o.prize.shoppingCard) {
                    shoppingCard = o.prize.shoppingCard;
                }
            }
            else if (o.money) {
                prizeName = o.money.name;
                prizeType = o.money.type;
                money     = o.money.money;
                if (o.money.shoppingCard) {
                    shoppingCard = o.money.shoppingCard;
                }
            }
            else if (o.prizeMoney) {
                prizeName = o.prizeMoney.name;
                prizeType = o.prizeMoney.type;
                money     = o.prizeMoney.money;
                if (o.prizeMoney.shoppingCard) {
                    shoppingCard = o.prizeMoney.shoppingCard;
                }
            }

            if (o.user) {
                nickName = o.user.name ? o.user.name : "";
                openId = o.user.openId ? o.user.openId : "";
            }

            var childFlag = false;
            var childName = "";
            var childSex = "";
            var childAge = "";
            if (o.prize && o.prize.fields) {
                childFlag = _.pluck(o.prize.fields, "key").indexOf("childName") > -1 ? 1 : 0;
            }
            if (o.address) {
                userName = o.address.name ? o.address.name : "";
                phoneNum = o.address.phoneNum ? o.address.phoneNum : "";
                address = o.address.address ? o.address.address : "";
                if (childFlag) {
                    childName = o.address.childName ? o.address.childName : "";
                    childSex = o.address.childSex ? o.address.childSex : "";
                    childAge = o.address.childAge ? o.address.childAge : "";
                }
            }

            //将奖品类型转换为真实值
            var tempType = prizeType;   //下边代码会将类型转换成文字，提前存储类型
            prizeType = (prizeType == 1 ? "实物" : (prizeType == 2 ? "消费码" : (prizeType == 3 ? "第三方卡券" :
                            (prizeType == 101 ? "微信卡券" : (prizeType == 102 ? "微信红包" : "")))));

            //将订单状态转换为真实值
            orderState = (orderState == 1 ? "已发货" : (orderState == 2 ? "未发货" : (orderState == 3 ? "已完成" : "")));

            if (!nameMap[prizeName]) {
                nameMap[prizeName] = {name: prizeName, data: []};
                if (tempType == typeConfig.prizeType.wxred) {  //微信红包
                    nameMap[prizeName].data.push(["奖品名称", "奖品类型", "红包金额", "中奖人昵称", "openid", "订单号",
                        "中奖时间", "订单状态"]);
                }
                else if (tempType == typeConfig.prizeType.card) {
                    nameMap[prizeName].data.push(["奖品名称", "奖品类型", "第三方消费码", "中奖人昵称", "中奖姓名", "手机号", "家庭住址",
                        "openid", "订单号", "中奖时间", "订单状态"]);
                }
                else {
                    if (childFlag) {
                        nameMap[prizeName].data.push(["奖品名称", "奖品类型", "中奖人昵称", "中奖姓名", "手机号", "家庭住址",
                            "孩子姓名", "孩子性别", "孩子年龄", "openid", "订单号", "中奖时间", "订单状态"]);
                    }
                    else {
                        nameMap[prizeName].data.push(["奖品名称", "奖品类型", "中奖人昵称", "中奖姓名", "手机号", "家庭住址",
                            "openid", "订单号", "中奖时间", "订单状态"]);
                    }
                }
            }
            var rows = [];
            rows.push(prizeName);   rows.push(prizeType);
            if (tempType == typeConfig.prizeType.wxred) {  //微信红包
                rows.push(money);
            }
            if (tempType == typeConfig.prizeType.card) {  //card
                rows.push(shoppingCard);
            }
            rows.push(nickName);
            if (tempType != typeConfig.prizeType.wxred) {   //非微信红包才显示用户名、手机号、地址字段
                rows.push(userName);    rows.push(phoneNum);    rows.push(address);
            }

            if (childFlag) {    //填充孩子信息
                rows.push(childName);    rows.push(childSex);   rows.push(childAge);
            }
            rows.push(openId);      rows.push(orderId);
            rows.push(new Date(prizeTime).toLocaleString());
            rows.push(orderState);
            nameMap[prizeName].data.push(rows);
        });
        _.each(nameMap, function(val){
            sheets.push(val);
        });
        excel.exportFile(sheets, function(err, buffer) {
            res.set('Date', new Date().toUTCString());
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', 'attachment; filename="' + encodeURIComponent('订单列表.xlsx') + '"');
            res.set('Content-Length', buffer.length);
            res.end(buffer);
        });
    });
};

/*
* 设置红包或者卡券的状态信息
 *调用了 就算更新状态未已领
 * 未领0 已领1
* */
exports.setWxInfoState=function(req,res){
    var openId   = req.user.openId;
    if(!openId){
        return res.send(404,"openId is required")
    }
    var orderId  = req.body.orderId; //所属订单id
    if(!orderId || 'undefined'==orderId){
        return res.send(404,"orderId is required")
    }

    var updateinfo={
        queueDataCollection:"order",
        updateAction:{
            _id:orderId,
            action:{"$set":{"wxstate":1}}
        }
    }
    queueUtil.push(updateinfo);
    res.send(200,"ok");
}

exports.midOrderLoader = function(param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next) {
        var id = req.param(param);
        ordersCollection.findById(id, function (err, doc) {
            req.order = doc;
            next()
        })
    }
};

exports.getTopExcel = function (req, res) {
    var exportDate = req.param('data');     //导出订单的日期
    var option = [
        {
            $match: {
                dateTime: {
                    $gte: new Date(exportDate + " 00:00:00"),
                    $lt: new Date(new Date(exportDate + " 23:59:59").getTime() + 1000)  //边界值处理
                }
            }
        },
        {
            $group: {
                _id: {
                    openId: "$user.openId",
                    date: {
                        year: {$year: '$dateTime'},
                        month: {$month: '$dateTime'},
                        day: {$dayOfMonth: '$dateTime'}
                    }
                },
                count: {$sum: 1},
                userName: {$addToSet: "$user.name"},
                prizeNameList: {$addToSet: "$prize.name"},
                prizeNameList2: {$addToSet: "$money.name"}
            }
        },
        {$sort: {count: -1}},
        {$limit: 20}
    ];

    countCollection.aggregate(option, function (err, datas) {
//        console.log("****** option: %j", JSON.stringify(option));
        if (!!err) {
            console.error("db err: %j", err);
            return res.send(500, err);
        }
        var sheets = [];
        var nameMap = {name: "top20统计", data: []};
        nameMap.data.push(["日期","openID","用户名","中奖次数","奖品名称"]);
        _.each(datas, function(o) {
            var dateStr = exportDate;
            var openId = o._id.openId ? o._id.openId : "";
            var userName = o.userName[0] ? o.userName[0] : "";
            var prizeCount = o.count ? o.count : 0;
            var prizeNameList = o.prizeNameList.concat(o.prizeNameList2);   //数组
            var rows = [];
            rows.push(dateStr);     rows.push(openId);
            rows.push(userName);    rows.push(prizeCount);
            rows = rows.concat(prizeNameList);
            nameMap.data.push(rows);
        });
        sheets.push(nameMap);
        excel.exportFile(sheets, function(err, buffer) {
            res.set('Date', new Date().toUTCString());
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', 'attachment; filename="' + encodeURIComponent('抽奖统计报表.xlsx') + '"');
            res.set('Content-Length', buffer.length);
            res.end(buffer);
        });
    });
};

//获取某天的前十名的数据
exports.getTopDataInfo = function (req, res) {
    var exportDate = req.param('data');     //导出订单的日期
    var option = [
        {
            $match: {
                dateTime: {
                    $gte: new Date(exportDate + " 00:00:00"),
                    $lt: new Date(new Date(exportDate + " 23:59:59").getTime() + 1000)  //边界值处理
                }
            }
        },
        {
            $group: {
                _id: {
                    openId: "$user.openId",
                    date: {
                        year: {$year: '$dateTime'},
                        month: {$month: '$dateTime'},
                        day: {$dayOfMonth: '$dateTime'}
                    }
                },
                count: {$sum: 1},
                icon: {$addToSet: "$user.icon"},
                prizeNameList: {$addToSet: "$prize.name"},
                prizeNameList2: {$addToSet: "$money.name"}
            }
        },
        {$sort: {count: -1}},
        {$limit: 10}
    ];

    countCollection.aggregate(option, function (err, datas) {
//        console.log("****** option: %j", JSON.stringify(option));
        if (!!err) {
            console.error("db err: %j", err);
            return res.send(500, err);
        }
        var sheets = [];
        _.each(datas, function(o) {
            var nameMap = {};
            nameMap['openId'] = o._id.openId ? o._id.openId : "";
            nameMap['icon'] = o.icon[0] ? o.icon[0] : "";
            nameMap['times'] = o.count ? o.count : 0;
            nameMap['prizeList'] = o.prizeNameList.concat(o.prizeNameList2);   //数组
            sheets.push(nameMap);
        });
        res.send(200, sheets);
    });
};

//汇总统计
exports.getSummaryInfo = function (req, res) {
    var condition = {"money.type": 102};    //统计红包的数量
    countCollection.countNoCache(condition, function(err, num) {
        if (!!err) {
            console.error("get wxred count err: %j", err);
            return res.send(500, err);
        }
        var wxRedNum = num;
        condition = {"$or": [{"prize.rate": 1}, {"money.rate": 1}]};    //大奖
        countCollection.find(condition, {'user.name': 1, 'prize.name': 1, 'money.name': 1, '_id': 0}, function(err, datas) {    //获取获大奖的
            if (!!err) {
                console.error("get rate 1 prize info err: %j", err);
                return res.send(500, err);
            }
            var sheets = [];
            var nameMap = {name: "汇总统计", data: []};
            nameMap.data.push(["信息汇总表"]);
            nameMap.data.push(["项目", "数据", "说明"]);
            nameMap.data.push(["红包发放人数", wxRedNum, ""]);
            nameMap.data.push([]);
            nameMap.data.push(["大奖汇总表"]);
            nameMap.data.push(["奖品名称", "中奖人", "说明"]);
            _.each(datas, function(o) {
                var prizeName = "";
                var userName = "";
                if (o.prize) {
                    prizeName = o.prize.name ? o.prize.name : '';
                }
                if (o.money) {
                    prizeName = o.money.name ? o.money.name : '';
                }
                userName = o.user.name ? o.user.name : '';
                nameMap.data.push([prizeName, userName, ""]);
            });
            sheets.push(nameMap);
            excel.exportFile(sheets, function(err, buffer) {
                res.set('Date', new Date().toUTCString());
                res.set('Content-Type', 'application/octet-stream');
                res.set('Content-Disposition', 'attachment; filename="' + encodeURIComponent('汇总统计表.xlsx') + '"');
                res.set('Content-Length', buffer.length);
                res.end(buffer);
            });
        })
    });
};

//统计用户的微信红包中奖次数和总金额
/*var countWxredSumAndNum = function(order) { //将订单的统计转移到queuePop文件中
    if (!order) {
        console.error("order is null");
        return;
    }
    if ('string' == typeof(order)) {
        order = JSON.parse(order);
    }
    var openId = order.user.openId ? order.user.openId : "";       //用户openID
    var userInfo = JSON.stringify(order.user);  //用户信息
    var type = order.money.type ? +(order.money.type) : 0;      //奖品类型
    var money = order.money.money ? +(order.money.money) : 0;   //红包金额
    if (type != typeConfig.prizeType.wxred) {
        return;
    }
    var countWxredSumInfo = "countWxredSumInfo";        //微信红包总金额key
    var countWxredNumInfo = "countWxredNumInfo";        //微信红包总数量key
    var countWxredUserInfo = "countWxredUserInfo";      //用户信息key
    redisClient.ZINCRBY(countWxredSumInfo, money, openId, function(err, res) {  //将总金额增加到对用openid的redis中
        if (!!err) {
            console.error("save countWxredSumInfo into redis err, openid: %j, money: %j, err: %j", openId, money, err);
        }
    });

    redisClient.ZINCRBY(countWxredNumInfo, 1, openId, function(err, res) {  //将为对应的openid红包数量加1
        if (!!err) {
            console.error("save countWxredNumInfo into redis err, openid: %j, err: %j", openId, err);
        }
    });

    redisClient.HSETNX(countWxredUserInfo, openId, userInfo, function(err, res) {   //根据openid设置userInfo
        if (!!err) {
            console.error("save countWxredUserInfo into redis err, openid: %j, userInfo: %j, err: %j", openId, userInfo, err);
        }
    });
};
*/
//每天中奖次数最多的用户TOP10	（提供微信名、头像、中奖次数和中奖信息）
exports.getTop10DataInfo = function (req, res) {
    var exportDate = req.param('data');     //导出订单的日期
    var option = [
        {
            $match: {
                dateTime: {
                    $gte: new Date(exportDate + " 00:00:00"),
                    $lt: new Date(new Date(exportDate + " 23:59:59").getTime() + 1000)  //边界值处理
                }
            }
        },
        {
            $group: {
                _id: {
                    openId: "$user.openId",
                    date: {
                        year: {$year: '$dateTime'},
                        month: {$month: '$dateTime'},
                        day: {$dayOfMonth: '$dateTime'}
                    }
                },
                count: {$sum: 1},
                userName: {$addToSet: "$user.name"},
                userIcon: {$addToSet: "$user.icon"},
                prizeNameList: {$addToSet: "$prize.name"},
                prizeNameList2: {$addToSet: "$money.name"}
            }
        },
        {$sort: {count: -1}},
        {$limit: 10}
    ];

    countCollection.aggregate(option, function (err, datas) {
//        console.log("****** option: %j", JSON.stringify(option));
        if (!!err) {
            console.error("db err: %j", err);
            return res.send(500, err);
        }
        var sheets = [];
        var nameMap = {name: "top10统计", data: []};
        nameMap.data.push(["日期","openID","用户名","用户ICON", "中奖次数","奖品名称"]);
        _.each(datas, function(o) {
            var dateStr = exportDate;
            var openId = o._id.openId ? o._id.openId : "";
            var userName = o.userName[0] ? o.userName[0] : "";
            var userIcon = o.userIcon[0] ? o.userIcon[0] : "";
            var prizeCount = o.count ? o.count : 0;
            var prizeNameList = o.prizeNameList.concat(o.prizeNameList2);   //数组
            var rows = [];
            rows.push(dateStr);     rows.push(openId);
            rows.push(userName);    rows.push(userIcon);
            rows.push(prizeCount);
            rows = rows.concat(prizeNameList);
            nameMap.data.push(rows);
        });
        sheets.push(nameMap);
        excel.exportFile(sheets, function(err, buffer) {
            res.set('Date', new Date().toUTCString());
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', 'attachment; filename="' + encodeURIComponent('每天中奖次数最多的用户TOP10.xlsx') + '"');
            res.set('Content-Length', buffer.length);
            res.end(buffer);
        });
    });
};
