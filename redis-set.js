/**
 * Created by wyq on 2016/7/6.
 * Set（集合）
 */

var rc = require("redis").createClient();
var async = require("async");
var _ = require("underscore");
var uuid = require("uuid");

var GetUuid = function () {
	var buffer = new Array(32);
	uuid.v4(null, buffer, 0);
	var string = uuid.unparse(buffer);
	string = string.replace(/-/g, "");
	return string;
};

var key = "set-test";
var sadd = function () {    //添加元素
	var members = [30, 20, 50, 10, 40, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200];
	rc.SADD(key, members, function (err, addNum) {
		console.log("addNum: %j", addNum);
	});
};

var scard = function () {   //获取集合数量
	rc.SCARD(key, function (err, count) {
		console.log("count: %j", count);
	});
};

var sdiff = function () {   //获取两个集合差集，也可以获取一个集合的全部成员
	rc.SDIFF(key, function (err, mems) {
		console.log("mems: %j", mems);
	});
};

var sdiffstore = function () {  //这个命令的作用和 SDIFF 类似，但它将结果保存到 destination 集合，而不是简单地返回结果集。如果 destination 集合已经存在，则将其覆盖。destination 可以是 key 本身。
	rc.SDIFFSTORE("new-set-test", key, function (err, newNum) {
		console.log("newNum: %j", newNum);
	});
};

var sinter = function () {  //返回指定集合的交集
	rc.SINTER(key, "new-set-test", function (err, mems) {
		console.log("mems: %j", mems);
	});
};

var sinterstore = function () { //这个命令类似于 SINTER 命令，但它将结果保存到 destination 集合，而不是简单地返回结果集。如果 destination 集合已经存在，则将其覆盖。destination 可以是 key 本身。
	rc.SINTERSTORE("set-jiaoji", key, "new-set-test", function (err, count) {
		console.log("count: %j", count);
	});
};

var sismember = function () {   //判断一个元素是不是key的成员
	rc.SISMEMBER(key, 50, function (err, o1) {
		console.log("o1: %j", o1);
	});
	rc.SISMEMBER(key, 500, function (err, o2) {
		console.log("o2: %j", o2);
	});
};

var smembers = function () {    //返回集合 key 中的所有成员。
	rc.SMEMBERS(key, function (err, mems) {
		console.log("mems: %j", mems);
	});
};

var smove = function () {   //将 member 元素从 source 集合移动到 destination 集合。
	rc.SMOVE("set-jiaoji", "set-smove", 20, function (err, move) {
		console.log("move: %j", move);
	});
};

var spop = function () {    //移除并返回集合中的一个随机元素。
	rc.SPOP("set-jiaoji", function (err, member) {
		console.log("member: %j", member);
	});
};

var srandmember = function () { //如果命令执行时，只提供了 key 参数，那么返回集合中的一个随机元素。
	rc.SRANDMEMBER(key, function (err, randomMem) { //获取一个随机元素
		console.log("randomMem: %j", randomMem);
	});

	rc.SRANDMEMBER(key, 3, function (err, rand3Mem) {   //获取不重复的3个随机元素
		console.log("rand3Mem: %j", rand3Mem);
	});

	rc.SRANDMEMBER(key, -10, function (err, reMems) {    //获取10个可以重复的元素
		console.log("reMems: %j", reMems);
	});
};

var srem = function () {    //移除集合 key 中的一个或多个 member 元素
	rc.SREM("set-jiaoji", 30, 10, function (err, remNum) {
		console.log("remNum: %j", remNum);
	});
};

var sunion = function () {  //返回多个集合的并集或一个集合的全集
	rc.SUNION(key, "new-set-test", function (err, unionMems) {
		console.log("unionMems: %j", unionMems);
	});
};

var sunionstore = function () {
	rc.SUNIONSTORE("set-union", key, "new-set-test", function (err, newMems) {
		console.log("newMems: %j", newMems);
	});
};

var sscan = function () {       //增量迭代集合中的元素
	//        key   游标 匹配a开头的mem   匹配数量
	rc.SSCAN("test", 0, "MATCH", "a*", "COUNT", 500, function (err, datas) {
		console.log("err: %j, datas: %j", err, datas);
	});
};


