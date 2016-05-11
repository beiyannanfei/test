/**
 * Created by wyq on 2015/8/20.
 */
var mongoskin = require('mongoskin');

//var destConf = "mongodb://point:point@10.10.42.25:27017/pointMall_test";    //目标数据库
var destConf = "mongodb://prize:prize@10.10.42.25:27017/prize";
console.time("test");
var destDb = mongoskin.db(destConf, {server: { poolSize: 20 }, mongos: true, replset: {strategy: 'ping', rs_name: 'dest'}});    //建立连接

var collName = "order";

destDb.bind(collName);  //绑定collection
/*
destDb[collName].findOne({}, {"_id": 1}, function (err, datas) {  //执行查询语句
    console.log("err: %j, datas: %j", err, datas);
    process.exit(0);
});
*/
/*
destDb[collName].findItems({"tvmId": "13810153028", "prize.type": {$in: [1, 2, 3, 101]}, "state": {$ne: -1}}, {}, function (err, datas) {
    console.timeEnd("test");
    console.log("******** err: %j, datas.length: %j", err, datas.length);
});
*/
console.log('asdf');
destDb[collName].update({"state": 11111}, {$set: {"state": 111112}}, {multi: true}, function (err, data) {
    console.log("err: %j, data: %j", err, data);
});





