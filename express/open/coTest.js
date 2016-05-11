/**
 * Created by wyq on 2016/5/6.
 */

var co = require("co");
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);
var makeRedis = require("../globle/redis/makeRedis.js");
var redisClient = require("../globle/redis/redisClient.js");
var rc = new redisClient(makeRedis.redisClient());
var Q = require("q");
var mongoUtils = require("../globle/mongo/mongoUtils.js");
var mongoClient = require("../globle/mongo/mongoClient.js");
var testCollection = new mongoUtils("test");            //回调方式调用
var dbTestClient = new mongoClient(testCollection);     //es形式


exports.coSeries = function (req, res) {    //顺序执行
	var key = req.query.key;
	var val = req.query.val;
	if (!key || !val) {
		return res.send(400, "param incomplete");
	}
	co(function *() {
		var v1 = yield rc.set(key, val);
		var v2 = yield rc.SET(val, key);
		return [v1, v2];
	}).then(v => {
		logger.info("coSeries set redis success result: %j", v);
		return res.send(200, v);
	}).catch(err => {
		logger.error("coSeries set redis fiald err: %j", err)
		return res.send(500, err);
	});
};

exports.coSeriesErrAndRoll = function (req, res) {      //顺序执行中途出错回滚之前操作
	var key = req.query.key;
	var val = req.query.val;
	if (!key || !val) {
		return res.send(400, "param incomplete");
	}

	co(function *() {
		var v1 = yield rc.SET(key, val);
		var v2 = yield rc.SET(val, key);
		var v3 = yield rc.LPUSH(key, val).catch(e => {      //因为key不是list类型，所以这段代码会报错
			logger.error("coSeriesErrAndRoll v3 err: %j", e.message);
			rc.DEL(key, val).then(v => {    //回滚
				logger.info("coSeriesErrAndRoll rollback success v: %j", v);
			}).catch(e => {
				logger.info("coSeriesErrAndRoll rollback fisld e: %j", e.message);
			});
			throw e;    //如果不继续抛出的话下边的catch就不会执行，而是执行then，因为try已经消化了
		});
		return [v1, v2, v3];
	}).then(v => {
		logger.info("coSeriesErrAndRoll set redis success result: %j", v);
		return res.send(200, v);
	}).catch(err => {
		logger.error("coSeriesErrAndRoll set redis fiald err: %j", JSON.stringify(err));
		return res.send(500, err.message);
	});
};

exports.dbSeries = function (req, res) {
	var key = req.query.key;
	var val = req.query.val;
	if (!key || !val) {
		return res.send(400, "param incomplete");
	}

	var UPDOC = {};
	UPDOC[key] = val;
	co(function *() {
		var v1 = yield dbTestClient.save({a: 10});
		logger.info("dbSeries v1: %j", v1);
		var v2 = yield dbTestClient.findById(v1._id);
		logger.info("dbSeries v2: %j", v2);
		var v3 = yield dbTestClient.updateById(v2._id, {$set: UPDOC});
		logger.info("dbSeries v3: %j", v3);
		return res.send({v1: v1, v2: v2, v3: v3});
	}).catch(e => {
		logger.error("dbSeries e: %j", e.message);
		return res.send(500, e.message);
	});
};

exports.coParallel = function (req, res) {    //并行执行
	var key = req.query.key;
	var val = req.query.val;
	if (!key || !val) {
		return res.send(400, "param incomplete");
	}

	co(function *() {
		var v1 = rc.set(key, val);
		var v2 = rc.set(val, key);
		var rVal = yield [v1, v2];
		logger.info("coParallel rVal: %j", rVal);
		return res.send(rVal);
	}).catch(e => {
		logger.error("coParallel err: %j", e.message);
		return res.send(500, e.message);
	});
};

exports.coParallelErr = function (req, res) {    //并行执行
	var key = req.query.key;
	var val = req.query.val;
	if (!key || !val) {
		return res.send(400, "param incomplete");
	}

	co(function *() {
		var rVal = yield [
			rc.set(key, val),
			rc.lpush(key, val),        //由于key的类型不是list所以这里会出错
			rc.set(val, key)
		];
		logger.info("coParallelErr rVal: %j", rVal);
		return res.send(rVal);
	}).catch(e => {
		logger.error("coParallelErr err: %j", e.message);
		return res.send(500, e.message);
	});
};

exports.coAuto = function (req, res) {
};
