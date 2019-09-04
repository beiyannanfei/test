/**
 * Created by userName on 2015/7/17.
 * 统计订单数量，金额等
 */

var _ = require('underscore');
var tools = require('../../tools');
var sysLotteryRedis = tools.sysLotteryRedis();
var crazyLotteryRedis = tools.queueRedis();
var dbUtils = require('../../mongoSkin/mongoUtils.js');
var countCollection = new dbUtils('countorder');
var typeConfig = require('../../routes/typeConfig.js');
var sysLotteriesCollection = new dbUtils('syslotteries');
var config = require('../../config.js');
var httpUtils = require('../../interface/http-utils.js');
var self = this;
var anaApi = require('../../interface/anaApi.js');
var moment = require('moment');

process.on('uncaughtException', function (err) {
    console.log("[%j]: file: %j * uncaughtException * err: %j", new Date().toLocaleString(), __filename, err);
    countOrder();
});

function countOrder() {
    console.log("******countOrder start******");
    sysLotteryRedis.BRPOP("countSysLottery", 0, function (err, data) {
        var doc = {};
        console.log("***countSysLottery arguments: %j", arguments);
        if (!!err) {
            console.error("redis pop err: %j", err);
            return setTimeout(countOrder, 30000);   //查询redis出错后30s恢复
        }
        if (data && _.isArray(data) && data.length > 1) {

            var sysLottery = JSON.parse(data[1]);
            var keys = '' + sysLottery.key;
            var newkeys = keys + 'wins';
        }
        if (!keys) {
            return countOrder();
        }
        reportLotteryPlan(sysLottery);
        doc = _.extend(doc, {lottery_id: keys});
        doc = _.extend(doc, {totalPeople: sysLottery.allUsersLength});
        doc = _.extend(doc, {lotteryInfo: sysLottery});
        doc = _.extend(doc, {createTime: sysLottery.createTime});
        doc = _.extend(doc, {lottery_type: "system"});
        sysLotteriesCollection.findById(keys, function (err, lotteryDoc) {  //从数据库中获取tvmid
            var tvmId = "";
            if (!!err) {
                console.error("get tvmId err: %j", err);
                return countOrder();
            }
            if (!lotteryDoc) {
                console.error("can not get doc by id: %j", keys);
                return countOrder();
            }
            else {
                tvmId = lotteryDoc.tvmId;
                console.log("********** tvmId: %j", tvmId);
            }
            doc = _.extend(doc, {tvmId: tvmId});
            doc = _.extend(doc, {repeat: 0});   //添加是否是重复统计字段,非重复统计标记为0
            sysLotteryRedis.HGETALL(newkeys, function (err, datas) {
                if (!!err) {
                    console.error("get keys prize info err: %j", err);
                    return setTimeout(countOrder, 30000);   //查询redis出错后30s恢复
                }
//                                    console.log("******* datas: %j, type: %j", JSON.stringify(datas), typeof(datas));
                var wxRed = {}; //微信红包(统计方法：每个金额段统计，总金额，总个数也统计)
                var other = {}; //除"微信红包"外的其他类型只统计个数
                var totalPrize = 0; //总中奖数
                var totalMoney = 0; //总中奖金额
                _.each(datas, function (val) {
                    if ("string" == typeof val) {
                        val = JSON.parse(val);
                    }
                    var temp;
                    if (val.openId) {   //当有openid属性时，使用money字段
                        temp = val.money;
                    }
                    else {
                        temp = val.user.prize;
                    }
                    ++totalPrize;
                    var type = +temp.type;   //奖品类型
                    var rate = temp.rate ? temp.rate : '';   //微信红包等级
                    var money = temp.money ? temp.money : 0; //微信红包金额
                    var name = temp.name ? temp.name : "";  //微信红包名称
                    totalMoney += +money;
                    var userName = "";
                    var icon = "";
                    var openId = "";
                    var prizeId = "";
                    if (temp.id) {
                        prizeId = temp.id;
                    }
                    if (val.openId) {   //当有openid属性
                        userName = val.name ? val.name : "";
                        icon = val.icon ? val.icon : "";
                        openId = val.openId ? val.openId : "";
                    }
                    else {
                        userName = val.user.name ? val.user.name : "";
                        icon = val.user.icon ? val.user.icon : "";
                        openId = val.user.openId ? val.user.openId : "";
                    }
                    if (type == typeConfig.prizeType.wxred) {   //微信红包
                        if (!wxRed[rate]) {
                            wxRed[rate] = {name: name, num: 0, money: 0, type: type, rate: rate, prizeId: prizeId, users: []};
                        }
                        wxRed[rate].users.push({name: userName, icon: icon, openId: openId});
                        wxRed[rate].num = wxRed[rate].num + 1;  //该类型的数量加1
                        wxRed[rate].money = wxRed[rate].money + (+money);
                    }
                    else {  //奖品非红包
                        if (!other[rate]) {
                            other[rate] = {name: name, num: 0, money: 0, type: type, rate: rate, prizeId: prizeId, users: []};
                        }
                        other[rate].users.push({name: userName, icon: icon, openId: openId});
                        other[rate].num = other[rate].num + 1;
                    }
                });
                var prize = [];
                _.each(wxRed, function (val) {
                    prize.push(val);
                });
                _.each(other, function (val) {
                    prize.push(val);
                });
                doc = _.extend(doc, {totalPrize: totalPrize, totalMoney: totalMoney, prize: prize});

                countCollection.save(doc, function (err, res) {
                    if (!!err) {
                        console.error("save data to db err: %j", err);
                        return countOrder();
                    }
                    return countOrder();
                });
//                                    console.log("***** doc = %j", JSON.stringify(doc));
                //使用同一个key在同一天的同一时间段开奖需要将统计信息做叠加处理
                /*var condition = {"tvmId": '' + tvmId, "day": '' + play_date, "startTime": '' + start_time,
                 "endTime": '' + end_time, "lottery_type": '' + doc.lottery_type}; //查重条件
                 countCollection.findNoCache(condition, {}, function (err, data) {
                 console.log("***** select condition : %j", condition);
                 if (!!err) {
                 console.error("*** find data from db err: %j", err);
                 countCollection.save(doc, function (err, res) {
                 if (!!err) {
                 console.error("save data to db err: %j", err);
                 return countOrder();
                 }
                 return countOrder();
                 });
                 }
                 if (data.length <= 0) {  //无相同数据
                 console.log("***db no data");
                 countCollection.save(doc, function (err, res) {
                 if (!!err) {
                 console.error("save data to db err: %j", err);
                 return countOrder();
                 }
                 return countOrder();
                 });
                 }
                 else {
                 //存在相同数据时对两次数据做整合
                 console.log("****存在相同数据时对两次数据做整合");
                 for (var aindex in data[0].prize) {    //遍历数据库中的奖品信息
                 var databaseInfo = data[0].prize[aindex];  //数据库中的数据
                 var isInFlag = false;   //该奖品名称是否在源奖品中存在标志位
                 for (var bindex = 0; bindex < doc.prize.length; ++bindex) {   //遍历最新生成的数据
                 var tempDataInfo = doc.prize[bindex];   //最新生成的数据
                 if (databaseInfo.name == tempDataInfo.name) {   //如果奖品名称相同
                 isInFlag = true;
                 tempDataInfo.num += databaseInfo.num;   //数量相加
                 if (tempDataInfo.type == typeConfig.prizeType.wxred) { //只有红包才有money字段
                 tempDataInfo.money += databaseInfo.money;   //金额相加
                 }
                 //将中奖用户做叠加
                 tempDataInfo.users = tempDataInfo.users.concat(databaseInfo.users);
                 }
                 }
                 //当数据库中数据不在最新生成的数据中时将该类型的奖品插入
                 if (!isInFlag) {
                 doc.prize.push(data[0].prize[aindex]);
                 }
                 }
                 //总金额和总数量同样需要叠加
                 doc.totalPrize += data[0].totalPrize;
                 doc.totalMoney += data[0].totalMoney;
                 doc.repeat = 1; //重复统计同一开奖信息将repeat字段设置为1
                 doc.totalPeople += +(data[0].totalPeople ? data[0].totalPeople : 0);     //参与抽奖人数也要叠加
                 doc = _.extend(doc, {"_id": data[0]._id}); //将_id也整合到最新生成的数据中，以便存储时覆盖存储
                 countCollection.save(doc, function (err, res) {
                 console.log("save  data to db doc is %j", JSON.stringify(doc));
                 if (!!err) {
                 console.error("save data to db err: %j", err);
                 return countOrder();
                 }
                 countOrder();
                 });
                 }
                 });*/
            });
            /*var url = config.countHost + '/Api/getTimeInfo/lottery_id/' + keys;
             //            url = "http://ads.dev.tvm.cn/Api/getTimeInfo/lottery_id/55a0f25998570dcf2f464192"; keys = "55a0f25998570dcf2f464192";
             console.log("********* url: %j", url);
             httpUtils.httpGet(url, function (err, response) {   //获取开始日期，开始时间，结束时间
             var play_date = "1991-01-01";
             var start_time = "00:10";
             var end_time = "00:20";
             if (!!err) {
             console.error("get timeinfo err: %j", err);
             return countOrder();
             }
             else if (response.list && response.list[keys]) {
             console.log("***** response: %j", JSON.stringify(response));
             play_date = response.list[keys].play_date;
             start_time = response.list[keys].start_time;
             end_time = response.list[keys].end_time;
             }
             console.log("****** play_date: %j, start_time: %j, end_time: %j", play_date, start_time, end_time);
             doc = _.extend(doc, {day: play_date, startTime: start_time, endTime: end_time,
             startDateTime: new Date(play_date + ' ' + start_time),
             endDateTime: new Date(play_date + ' ' + end_time),
             insertDate: new Date().toLocaleDateString()});  //增加插入日期字段


             });*/
        });
    });
}
countOrder();

var reportLotteryPlan = function(sysLottery) {    //上报开奖方案
    if (!sysLottery) {
        return console.error("[%j] fileName: %j reportLotteryPlan sysLottery is null", new Date().toLocaleString(), __filename);
    }
    var host = config.DS_HOST;
    host += "/php/index.php?c=Channel&a=save";
    var param = {
        token: "354e6b14b65b79ad",
        channel_id: 1782,
        number: sysLottery.allUsersLength || 0,
        ptime: new Date(sysLottery.createTime).getTime(),
        contents: new Buffer(JSON.stringify(sysLottery)).toString('base64'),
        ctime: moment(new Date(sysLottery.createTime)).format("YYYY-MM-DD")//new Date(sysLottery.createTime).toLocaleDateString()
    };
    console.log("[%j] fileName: %j reportLotteryPlan", new Date().toLocaleString(), __filename);
    anaApi.postLotteryPlan(host, param, function(err, result) {
        if (!!err) {
            sysLotteryRedis.lpush("reportlotteryplanbackup", JSON.stringify(param));
            console.error("*** err: %j", err);
        }
    })
};








