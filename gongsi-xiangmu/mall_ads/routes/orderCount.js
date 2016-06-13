/**
 * Created by yanqiangWang on 2015/7/17.
 */

var _ = require('underscore');
var dbUtils = require('../mongoSkin/mongoUtils.js');
var ordersCollection = new dbUtils('countorder');
var anaApi = require('../interface/anaApi.js');
var yaoTVApi = require('../interface/yaoTVApi.js');
var ut = require('./utils.js');
var sysLotteriesCollection = new dbUtils('syslotteries');
var tools = require('../tools');
var queueClient = tools.queueRedis();
var redisClient = tools.redisClient();
var async = require('async');
var typeConfig = require('./typeConfig.js');
var excel = require('./excel');


exports.getTimeList = function (req, res) {   //获取时间段列表
    var tvmId = req.tvmId;
    if (!tvmId) {
        return res.send(400, "tvmId lost");
    }
    var day = req.param("day");
    console.log("******day: %j", day);
    if (!day) {
        return res.send(400, "day is null");
    }
    ordersCollection.find({"day": '' + day, tvmId: tvmId}, {"day": 1, "startTime": 1, "endTime": 1}, function (err, docs) {
        if (!!err) {
            console.error("***mongo db err : %j", err);
            return res.send(500, err);
        }
        if (docs.length <= 0) {
            return res.send(200, {info: []});
        }
        var timeMap = {};
        _.each(docs, function (doc) {
            var day = doc.day;
            var startTime = doc.startTime;
            var endTime = doc.endTime;
            if (!timeMap[day]) {
                timeMap[day] = {day: day, time: []};
            }
            timeMap[day].time.push({startTime: startTime, endTime: endTime, _id: doc._id});
        });
        console.log("************ timeMap: %j", JSON.stringify(timeMap));
        console.log("************timeMap[day].time : %j", timeMap[day].time);
        res.send(200, {info: timeMap[day].time});
    });
};


exports.getPrizeList = function (req, res) {
    var tvmId = req.tvmId;
    if (!tvmId) {
        return res.send(400, "tvmId lost");
    }
    var args = req.param("args");
    console.log("******args: %j", args);
    if (!args) {
        return res.send(400, "args is null");
    }
    ordersCollection.findById(args, function (err, docs) {
        if (!!err) {
            console.error("** db err: %j", err);
            return res.send(500, err);
        }
        if (!docs) {
            console.warn("can not find data, args: %j", args);
            return res.send(500, "can not find data");
        }
        console.log("****** docs: %j", docs);
        res.send(200, {info: docs});
    });
};

exports.statistics = function (req, res) {
    var date = req.param('date');
    yaoTVApi.loadDayStatistics(date, function (err, data) {
        if (err) {
            return res.send(500, '获取z接口失败:' + JSON.stringify(err))
        }
        if (data.status != 'ok') {
            return res.send(500, '获取z接口失败:' + JSON.stringify(data))
        }
        data = data.data;
        var pvParameters = [];
        _.each(data, function (o) {
            o.tvmId = o.ad_content[0].tvm_id;
            o.lottery_id = o.ad_content[0].lottery_id;
            o.timeId = new Date(o.createTime).getTime();
            if (o.timeId < 1437663982000) {
                o.timeId = o.time_interval_id;
            }
            pvParameters.push({tvmId: o.tvmId, timeId: o.timeId});
            delete o.ad_content
        });
        var lotteryIds = _.pluck(data, 'lottery_id');
        var createTimes = _.pluck(data, 'createTime');
        var condition = {
            createTime: {$in: createTimes}
        };
        ordersCollection.find(condition, {'prize.users': 0}, function (err, docs) {
            if (err) {
                return res.send(500, '获取订单统计失败:' + JSON.stringify(err));
            }
            var param = {
                date: date,
                parameters: pvParameters
            };
            console.log(param);
            anaApi.getPvUv(param, function (err, pvUv) {
                console.log('pvUv: %j', pvUv);
                if (err) {
                    pvUv = {
                        status: 'success',
                        total: {
                            uv: 0,
                            pv: 0
                        },
                        filter: {
                            uv: 0,
                            pv: 0
                        },
                        data: []
                    };
                    err = null
                }
                if (err) {
                    return res.send(500, '获取PVUV统计接口失败err:' + JSON.stringify(err));
                }
                if (pvUv.status != 'success') {
                    return  res.send(500, '获取PVUV统计接口失败json:' + JSON.stringify(pvUv));
                }
                var pvuvMap = ut.arrToMap(pvUv.data, 'timeId');
                var lotteryMap = ut.arrToMap(docs, 'createTime');
                var lotteryIdMap = ut.arrToMap(docs, 'lottery_id');
                //console.log(pvuvMap.total)
                var result = {
                    uv: pvUv.total.uv,
                    pv: pvUv.total.pv,
                    qcuv: pvUv.filter.uv,
                    qcpv: pvUv.filter.pv,
                    totalMoney: 0,
                    totalPrize: 0
                };
                var noLotteryInfoIds = [];
                _.each(data, function (o) {
                    //console.log(o.time_interval_id)
                    //console.log(pvuvMap[o.time_interval_id])
                    if (pvuvMap[o.timeId]) {
                        o.pv = pvuvMap[o.timeId].pv;
                        o.uv = pvuvMap[o.timeId].uv;
                        o.dati = pvuvMap[o.timeId].dati;
                        o.ad_uv = pvuvMap[o.timeId].ad_uv;
                    }
                    else {
                        o.pv = 0;
                        o.uv = 0;
                        o.dati = 0;
                        o.ad_uv = 0;
                    }
                    o.totalPeople = o.dati;
                    o.totalMoney = 0;
                    o.rate = {};
                    o.plan = '没有查到抽奖统计:' + o.lottery_id;

                    //console.log(lotteryMap)
                    if (lotteryMap[o.createTime]) {
                        console.log("lotteryMap[o.createTime]");
                        console.log(lotteryMap[o.createTime]);
                        o.plan = '开奖模式';
                        o.planInfo = lotteryMap[o.createTime].lotteryInfo;
                        if (!o.planInfo) {
                            noLotteryInfoIds.push(o.lottery_id);
                        }
                        o.totalMoney = lotteryMap[o.createTime].totalMoney;
                        if (lotteryMap[o.createTime].totalPeople) {
                            o.totalPeople = lotteryMap[o.createTime].totalPeople
                        }
                        result.totalMoney += o.totalMoney;
                        o.rate = {};
                        if (lotteryMap[o.createTime].prize && lotteryMap[o.createTime].prize.length > 0) {
                            _.each(lotteryMap[o.createTime].prize, function (prize) {
                                if (prize.type == 102) {
                                    console.log("parseFloat");
                                    var showmoney = parseFloat(prize.money).toFixed(2);
                                    console.log("parseFloat");
                                    o.rate[prize.rate] = {name: showmoney + '元' + '(' + prize.num + '个' + prize.name + ')', type: 102, id: prize.id}
                                }
                                else {
                                    result.totalPrize += prize.num;
                                    o.rate[prize.rate] = {name: prize.name + '(' + prize.num + ')' + '个', type: prize.type, id: prize.id}
                                }
                            })
                        }
                    }
                    else if (lotteryIdMap[o.lottery_id]) {
                        console.log("lotteryMap[o.lottery_id]");
                        console.log(lotteryIdMap[o.lottery_id]);
                        o.plan = '开奖模式';
                        o.planInfo = lotteryIdMap[o.lottery_id].lotteryInfo;
                        if (!o.planInfo) {
                            noLotteryInfoIds.push(o.lottery_id);
                        }
                        o.totalMoney = lotteryIdMap[o.lottery_id].totalMoney;
                        if (lotteryIdMap[o.lottery_id].totalPeople) {
                            o.totalPeople = lotteryIdMap[o.lottery_id].totalPeople
                        }
                        result.totalMoney += o.totalMoney;
                        o.rate = {};
                        if (lotteryIdMap[o.lottery_id].prize && lotteryIdMap[o.lottery_id].prize.length > 0) {
                            _.each(lotteryIdMap[o.lottery_id].prize, function (prize) {
                                if (prize.type == 102) {
                                    console.log("parseFloat");
                                    var showmoney = parseFloat(prize.money).toFixed(2);
                                    console.log("parseFloat");
                                    o.rate[prize.rate] = {name: showmoney + '元' + '(' + prize.num + '个' + prize.name + ')', type: 102, id: prize.id}
                                }
                                else {
                                    result.totalPrize += prize.num;
                                    o.rate[prize.rate] = {name: prize.name + '(' + prize.num + ')' + '个', type: prize.type, id: prize.id}
                                }
                            })
                        }
                    }
                });
                //createTime 时间排序
                data = _.sortBy(data, function (a) {
                    return -a.createTime
                });
                result.listInfo = data;
                result.totalMoney = result.totalMoney.toFixed(2);
                if (noLotteryInfoIds.length > 0) {
                    sysLotteriesCollection.find({"_id": {$in: dbUtils.toId(noLotteryInfoIds)}},
                        function (err, _sysLotterys) {
                            if (err) {
                                return res.send(500, "sysLotteriesCollection.find " + err);
                            }
                            _.each(data, function (o) {
                                //_sysLotterys o.lottery_id
                                var lObj = _.find(_sysLotterys, function (lott) {
                                    return lott._id == o.lottery_id
                                });
                                if (lObj) {
                                    o.planInfo = lObj;
                                }
                            });
                            return res.send(result)
                        }
                    );
                }
                else {
                    return res.send(result)
                }
            })
        })
    })
};

exports.getCountInfo = function (req, res) {
    var createTimelist = req.body.createTimelist;
    if (!createTimelist) {
        return res.send(400, "args lotteryIdList lost");
    }
    if ('string' == typeof(createTimelist)) {
        createTimelist = JSON.parse(createTimelist);
    }
    var condition = {
        createTime: {$in: createTimelist}
    };
    console.log("***** condition: %j", JSON.stringify(condition));
    ordersCollection.find(condition, {}, function (err, docs) {
        if (!!err) {
            return res.send(500, '获取订单统计失败:' + JSON.stringify(err))
        }
        res.send(200, {info: docs});
    });
};

exports.getPrizeCount = function (req, res) {
    var args = req.param("args");
    console.log("******args: %j", args);
    if (!args) {
        return res.send(400, "args is null");
    }
    if ('string' == typeof(args)) {
        args = JSON.parse(args);
    }
    var lotteryId = args.lotteryId; //抽奖id
    var prizeId = args.prizeId;     //奖品id
    var keys = lotteryId + prizeId + 'reportinfo';
    queueClient.HLEN(keys, function (err, count) {
        if (!!err) {
            return res.send(500, "get length from redis err: %j, keys: %j", err, keys);
        }
        res.send(200, {count: count});
    });
};

exports.countWxredPrize = function (req, res) {
    var topSum = 20;
    var topNum = 20;
    try {
        topSum = +req.param("topSum");     //总金额前n名
        topNum = +req.param("topNum");     //总数量前n名
    }
    catch (e) {
        console.log("get params err: %j", e);
    }

    var countWxredSumInfo = "countWxredSumInfo";        //微信红包总金额key
    var countWxredNumInfo = "countWxredNumInfo";        //微信红包总数量key
    var countWxredUserInfo = "countWxredUserInfo";      //用户信息key
    async.parallel([
        function (cb) {
            redisClient.ZREVRANGE(countWxredSumInfo, 0, 20, 'WITHSCORES', function (err, datas) {
                cb(err, datas);
            });
        },
        function (cb) {
            redisClient.ZREVRANGE(countWxredNumInfo, 0, 20, 'WITHSCORES', function (err, datas) {
                cb(err, datas);
            });
        }
    ], function (err, results) {
        if (!!err) {
            return res.send(400, err);
        }
        console.log("*******paiming results: %j", results);
        var sumInfoList = results[0];
        var sumOpenIdList = [];     //总金额openid
        var sumList = [];           //总金额
        for (var index = 0; index < sumInfoList.length; ++index) {  //分离openid和总金额到不同的数组
            var temp = sumInfoList[index];
            if (index % 2 == 0) {
                sumOpenIdList.push(temp);
            }
            else {
                sumList.push(temp);
            }
        }

        var numInfoList = results[1];
        var numOpenIdList = [];     //总数量openid
        var numList = [];           //总数量
        for (var bindex = 0; bindex < numInfoList.length; ++bindex) {  //分离openid和总数量到不同的数组
            var t = numInfoList[bindex];
            if (bindex % 2 == 0) {
                numOpenIdList.push(t);
            }
            else {
                numList.push(t);
            }
        }

        async.parallel([
            function (cb) {
                redisClient.HMGET(countWxredUserInfo, sumOpenIdList, function (err, datas) {  //获取总金额对应的用户信息
                    cb(err, datas);
                });
            },
            function (cb) {
                redisClient.HMGET(countWxredUserInfo, numOpenIdList, function (err, datas) {  //获取总数量对应的用户信息
                    cb(err, datas);
                });
            }
        ], function (err, results) {
            if (!!err) {
                return res.send(400, err);
            }
            console.log("*****search user info results: %j", results);
            var sumUserInfoList = results[0];   //总金额用户信息列表
            var sumInfo = [];   //最终总金额信息列表
            for (var i = 0; i < sumUserInfoList.length; ++i) {
                var sumMap = {};
                sumMap['rank'] = i + 1;         //排名
                sumMap['count'] = sumList[i];   //总金额
                sumMap['openId'] = JSON.parse(sumUserInfoList[i]).openId;   //openid
                sumMap['userName'] = JSON.parse(sumUserInfoList[i]).name;   //name
                sumMap['icon'] = JSON.parse(sumUserInfoList[i]).icon;       //icon
                sumInfo.push(sumMap);
            }

            var numUserInfoList = results[1];   //总数量用户信息列表
            var numInfo = [];   //最终总数量信息列表
            for (var j = 0; j < numUserInfoList.length; ++j) {
                var numMap = {};
                numMap['rank'] = j + 1;         //排名
                numMap['count'] = numList[j];   //总数量
                numMap['openId'] = JSON.parse(numUserInfoList[j]).openId;   //openid
                numMap['userName'] = JSON.parse(numUserInfoList[j]).name;   //name
                numMap['icon'] = JSON.parse(numUserInfoList[j]).icon;       //icon
                numInfo.push(numMap);
            }
            console.log('********最终总金额信息sumInfo: %j', JSON.stringify(sumInfo));
            console.log('********最终总数量信息numInfo: %j', JSON.stringify(numInfo));
            res.send(200, {sumInfo: sumInfo, numInfo: numInfo});
        });
    });
};

//最早参与奖   （每天早上6点开播后，第一轮参与中红包大奖的用户的微信名、头像、中奖金额）
exports.getEarliestIn = function (req, res) {
    var exportDate = req.param('data');     //导出订单的日期
    var condition = {
        createTime: {
            $gte: exportDate + " 04:00:00",
            $lt: new Date(new Date(exportDate + " 04:00:00").getTime() + 24 * 3600 * 1000).toLocaleString()
        }
    };
    ordersCollection.findNoCache(condition, {}, {sort: {createTime: 1}, limit: 1}, function (err, datas) {
        if (!!err) {
            console.error("db err: %j", err);
            return datas.send(400, 'db err：' + err);
        }
        if (datas.length <= 0) {
            return datas.send(400, 'no data');
        }
        datas = datas[0];
        var rate1Info = {}; //一等奖信息
        var rate2Info = {}; //二等级信息
        var prizeList = datas.prize ? datas.prize : [];
        for (var index in prizeList) {
            var temp = prizeList[index];
            var type = +(temp.type ? temp.type : 0);
            if (type != typeConfig.prizeType.wxred) {   //非红包
                continue;
            }
            var rate = +(temp.rate ? temp.rate : 0);
            if (1 == rate) {        //1等奖
                rate1Info = temp;
            }
            if (2 == rate) {        //2等奖
                rate2Info = temp;
            }
        }
        var money = rate1Info.money;
        var userName = rate1Info.users[0].name;
        var icon = rate1Info.users[0].icon;
        var openId = rate1Info.users[0].openId;

        var sheets = [];
        var nameMap = {name: "最早参与奖", data: []};
        nameMap.data.push(["微信名", "openID", "用户ICON", "中奖金额"]);
        nameMap.data.push([userName, openId, icon, money]);

        sheets.push(nameMap);
        excel.exportFile(sheets, function (err, buffer) {
            res.set('Date', new Date().toUTCString());
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', 'attachment; filename="' + encodeURIComponent('最早参与奖.xlsx') + '"');
            res.set('Content-Length', buffer.length);
            res.end(buffer);
        });
    });
};

//最晚陪伴奖  （每天晚上近凌晨2点，伴随最后一次互动的中奖用户微信名、头像、中奖金额）
exports.getLatestIn = function (req, res) {
    var exportDate = req.param('data');     //导出订单的日期
    var condition = {
        createTime: {
            $gte: exportDate + " 04:00:00",
            $lt: new Date(new Date(exportDate + " 04:00:00").getTime() + 24 * 3600 * 1000).toLocaleString()
        }
    };
    ordersCollection.findNoCache(condition, {}, {sort: {createTime: -1}, limit: 1}, function (err, datas) {
        if (!!err) {
            console.error("db err: %j", err);
            return datas.send(400, 'db err：' + err);
        }
        if (datas.length <= 0) {
            return datas.send(400, 'no data');
        }
        datas = datas[0];
        var rate1Info = {}; //一等奖信息
        var rate2Info = {}; //二等级信息
        var prizeList = datas.prize ? datas.prize : [];
        for (var index in prizeList) {
            var temp = prizeList[index];
            var type = +(temp.type ? temp.type : 0);
            if (type != typeConfig.prizeType.wxred) {   //非红包
                continue;
            }
            var rate = +(temp.rate ? temp.rate : 0);
            if (1 == rate) {        //1等奖
                rate1Info = temp;
            }
            if (2 == rate) {        //2等奖
                rate2Info = temp;
            }
        }
        var money = rate1Info.money;
        var userName = rate1Info.users[0].name;
        var icon = rate1Info.users[0].icon;
        var openId = rate1Info.users[0].openId;

        var sheets = [];
        var nameMap = {name: "最晚陪伴奖", data: []};
        nameMap.data.push(["微信名", "openID", "用户ICON", "中奖金额"]);
        nameMap.data.push([userName, openId, icon, money]);

        sheets.push(nameMap);
        excel.exportFile(sheets, function (err, buffer) {
            res.set('Date', new Date().toUTCString());
            res.set('Content-Type', 'application/octet-stream');
            res.set('Content-Disposition', 'attachment; filename="' + encodeURIComponent('最晚陪伴奖.xlsx') + '"');
            res.set('Content-Length', buffer.length);
            res.end(buffer);
        });
    });
};






