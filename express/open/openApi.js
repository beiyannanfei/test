/**
 * Created by wyq on 2016/5/6.
 */

var co = require("co");
var express = require('express');
var app = express();
module.exports = app;
var middleware = require('../globle/middleware.js')
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);
var makeRedis = require("../globle/redis/makeRedis.js");
var redisClient = require("../globle/redis/redisClient.js");
var rc = new redisClient(makeRedis.redisClient());
var mCoTest = require("./coTest.js");

//框架压测          ab -c 100 -n 10000 "127.0.0.1:9001/open/test/hello/world"
app.get("/test/hello/world", function (req, res) {
	return res.send("Hello World");
});
//利用co库解决异步问题
//顺序执行异步相当于 async.series      curl "127.0.0.1:9001/open/co/series?key=a1&val=b1"
app.get("/co/series", mCoTest.coSeries);
//顺序执行异步中途出错然后回滚      curl "127.0.0.1:9001/open/co/series/error?key=a2&val=b2"
app.get("/co/series/error", mCoTest.coSeriesErrAndRoll);
//数据库的顺序调用               curl "127.0.0.1:9001/open/co/db/series?key=a3&val=b3"
app.get("/co/db/series", mCoTest.dbSeries);
//并行执行异步相当于 async.parallel  curl "127.0.0.1:9001/open/co/parallel?key=a4&val=b4"
app.get("/co/parallel", mCoTest.coParallel);
//并行执行异步出错    curl "127.0.0.1:9001/open/co/parallel/err?key=a5&val=b5"
app.get("/co/parallel/err", mCoTest.coParallelErr);
//串并结合      curl "127.0.0.1:9001/open/co/auto?key=a6&val=b6"
app.get("/co/auto", mCoTest.coAuto);






