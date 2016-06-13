/**
 * Created by wyq on 2015/8/18.
 */
var mongoskin = require('mongoskin');
var async = require("async");
var _ = require("underscore");
var args = process.argv;
var preReadCount = 997;    //每次读取存储的数据条数
if (args.length < 3) {
    console.log("请输入类似下面的命令行参数(token): node copyDatabase.js tvmty");
    return;
}
var token = args[2];
var isUnion = args[3];
if (isUnion == "true") {
    isUnion = true;
}
else {
    isUnion = false;
}
var sourceConf = "mongodb://integral:integral@10.10.42.25:27017/pointMall";    //源数据库
var destConf = "mongodb://point:point@10.10.42.25:27017/pointMall_test";    //目标数据库

var sourceDb = mongoskin.db(sourceConf, {server: { poolSize: 20 }, mongos: true, replset: {strategy: 'ping', rs_name: 'source'}});
var destDb = mongoskin.db(destConf, {server: { poolSize: 20 }, mongos: true, replset: {strategy: 'ping', rs_name: 'dest'}});

var scrConnList = [];   //源表名列表
var destConnList = [];  //目标表名列表
var connList = [];  //表名列表
var copySize = {};  //每个表复制的数据数量
console.time("totaltime");
async.auto({
    getSrcAllConn: function (cb) {
        sourceDb.bind('system.indexes');    //系统表名
        sourceDb['system.indexes'].distinct("ns", function (err, data) {
            if (!!err) {
                return cb(err, null);
            }
            var dbName = "";
            if (data.length > 0) {
                var tempData = data[0];
                dbName = tempData.substring(0, tempData.indexOf('.'));
                console.log("tempData: %j, db name: %j", tempData, dbName);
            }
            data = _.without(data, dbName + '.system.users', dbName + '.fs.files', dbName + '.fs.chunks');
            _.each(data, function (val) {   //截取表名
                scrConnList.push(val.substring(val.indexOf('.') + 1));
            });
            console.log("[%j] %j: getSrcAllConn ok, %j", new Date().toLocaleString(), __filename, scrConnList);
            cb(err, "OK");
        });
    },
    getDestAllConn: function (cb) {
        destDb.bind('system.indexes');    //系统表名
        destDb['system.indexes'].distinct("ns", function (err, data) {
            if (!!err) {
                return cb(err, null);
            }
            var dbName = "";
            if (data.length > 0) {
                var tempData = data[0];
                dbName = tempData.substring(0, tempData.indexOf('.'));
                console.log("tempData: %j, db name: %j", tempData, dbName);
            }
            data = _.without(data, dbName + '.system.users', dbName + '.fs.files', dbName + '.fs.chunks');
            _.each(data, function (val) {   //截取表名
                destConnList.push(val.substring(val.indexOf('.') + 1));
            });
            console.log("[%j] %j: getDestAllConn ok, %j", new Date().toLocaleString(), __filename, destConnList);
            cb(err, "OK");
        });
    },
    getIntersection: ["getSrcAllConn", "getDestAllConn", function (cb) {   //获取两个库的表的交集
        if (!isUnion) { //如果没有第四个参数或不为true取两个库的交集
            connList = _.intersection(scrConnList, destConnList);
        }
        else {  //否则取并集
            connList = _.union(scrConnList, destConnList);
        }
        console.log("[%j] %j: intersection ok, %j", new Date().toLocaleString(), __filename, connList);
        cb(null, "OK");
    }],
    dbBind: ['getIntersection', function (cb) {
        _.each(connList, function (val) {
            sourceDb.bind(val);
            destDb.bind(val);
        });
        console.log("[%j] %j: bind Success, %j", new Date().toLocaleString(), __filename, connList.length);
        cb(null, "OK");
    }],
    findAndSave: ['dbBind', function (cb) {
        var index = 0;
        async.whilst(   //循环处理所有表
            function () {
                return index < connList.length;
            },
            function (cb) {
                var collName = connList[index++];
                if (!copySize.collName) {
                    copySize[collName] = 0;
                }
                console.log("collName == %j 读取中", collName);
                var condition = {};
                var wxTokenList = ["users"];  //使用wxToken的表
                if (-1 != wxTokenList.indexOf(collName)) {  //只有users表中为 wxToken，其余均为token
                    condition.wxToken = token;
                }
                else {
                    condition.token = token;
                }
                var bIndex = 0;
                var readFlag = true;
                destDb[collName].remove(condition, function (err, o) { //插入之前首先清空
                    if (!!err) {
                        console.warn("清空表: %j 出错, errInfo: %j, 程序已经自动回滚，再次清空该表", collName, err);
                        --index;    //对index减一操作，保证回滚后的循环继续操作出错的表
                        return cb(null);
                    }
                    console.log("%j 表历史数据清除完成.....", collName);
                    async.whilst(   //这个循环是处理一个表中的多个数据
                        function () {
                            return readFlag;
                        },
                        function (cb) {
                            console.time("useTime");
                            sourceDb[collName].findItems(condition, {}, {skip: bIndex * preReadCount, limit: preReadCount}, function (err, datas) {
                                if (!!err) {
                                    console.warn("读取表: %j 数据出错, errInfo: %j, 程序已经自动回滚，再次读取该表数据", collName, err);
                                    --index;    //对index减一操作，保证回滚后的循环继续操作出错的表
                                    return cb(err);
                                }
                                ++bIndex;
                                if (datas.length <= 0) {
                                    readFlag = false;
                                    return cb(err);
                                }
                                destDb[collName].insert(datas, function (err, doc) {
                                    if (!!err) {
                                        console.warn("出入表: %j 数据出错, errInfo: %j, 程序已经自动回滚，再次将数据插入该表", collName, err);
                                        --index;    //对index减一操作，保证回滚后的循环继续操作出错的表
                                        return cb(err);
                                    }
                                    console.timeEnd("useTime");
                                    console.log("collName == %j 读取中, 已读数量: %j", collName, (bIndex - 1) * preReadCount + datas.length);
                                    copySize[collName] = (bIndex - 1) * preReadCount + datas.length;
                                    return cb(err);
                                })
                            })
                        },
                        function (err) {
                            if (!!err) {    //内部循环中途出错要回滚再次尝试
                                return cb(null);
                            }
                            console.log("******** %j insert ok", collName);
                            cb(err);
                        }
                    );
                });
            },
            function (err) {
                if (!!err) {
                    console.error("err info: %j", err);
                    return cb(err, null);
                }
                return cb(err, "OK");
            }
        );
    }]
}, function (err, result) {
    if (!!err) {
        return console.error("err: %j", err);
    }
    console.timeEnd("totaltime");
    console.log("******success****** result: %j", result);
    console.log("****** copySize: %j", copySize);
    console.log("\n\n***************************** SUCCESS *****************************\n\n");
    return;
    /*  不能操作系统表
     //最后复制索引表
     var collName = 'system.indexes';
     sourceDb.bind(collName);
     destDb.bind(collName);
     destDb[collName].remove({}, function (err, o) { //插入之前首先清空
     if (!!err) {
     return console.error("数据迁移已完成，最后索引表清空失败: %j", err);
     }
     sourceDb[collName].findItems({}, {}, {}, function (err, datas) {
     if (!!err) {
     return console.error("读取源数据库索引信息出错: %j", err);
     }
     if (datas.length <= 0) {
     console.timeEnd("totaltime");
     console.log("******success****** result: %j", result);
     console.log("****** copySize: %j", copySize);
     return;
     }
     destDb[collName].insert(datas, function (err, docs) {
     if (!!err) {
     return console.error("目标数据库插入索引出错: %j", err);
     }
     console.timeEnd("totaltime");
     console.log("******success****** result: %j", result);
     console.log("****** copySize: %j", copySize);
     });
     });
     });
     */
});
















