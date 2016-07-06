/**
 * Created by wyq on 2016/7/6.
 * SortedSet（有序集合）
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

var key1 = "sortedset-test1";
var key2 = "sortedset-test2";
var key3 = "sortedset-test3";
var key4 = "sortedset-test4";
var key5 = "sortedset-test5";


var zadd = function () {        //将一个或多个 member 元素及其 score 值加入到有序集 key 当中。
	var scoreMemberList = [1, "a", 2, "b", 3, "c", 4, "d", 5, "f", 6, "g", 7, "h", 8, "i", 9, "j", 10, "k", 11, "l", 12, "m", 13, "n"];
	rc.ZADD(key1, scoreMemberList, function (err, count) {
		console.log("count: %j", count);
	});
};

var zcard = function () {   //返回有序集 key 的基数。
	rc.ZCARD(key1, function (err, count) {
		console.log("count: %j", count);
	});
};

var zcount = function () {  //返回有序集 key 中， score 值在 min 和 max 之间(默认包括 score 值等于 min 或 max )的成员的数量
	rc.ZCOUNT(key1, 5, 10, function (err, count) {
		console.log("count: %j", count);
	});
};

var zincrby = function () {     //为有序集 key 的成员 member 的 score 值加上增量 increment 。
	rc.ZINCRBY(key1, 100, "n", function (err, newVal) {
		console.log("newVal: %j", newVal);
	});
};

var zrange = function () {  //返回有序集 key 中，指定区间内的成员。其中成员的位置按 score 值递增(从小到大)来排序。
	rc.ZRANGE(key1, 0, -1, function (err, datas) {
		console.log("datas: %j", datas);    //datas: ["a","b","c","d","f","g","h","i","j","k","l","m","n"]
	});

	rc.ZRANGE(key1, 0, -1, "WITHSCORES", function (err, values) {
		console.log("values: %j", values);  //values: ["a","1","b","2","c","3","d","4","f","5","g","6","h","7","i","8","j","9","k","10","l","11","m","12","n","113"]
	});
};

var zrevrange = function () {       //返回有序集 key 中，指定区间内的成员。其中成员的位置按 score 值递减(从大到小)来排列。
	rc.ZREVRANGE(key1, 0, -1, function (err, datas) {
		console.log("datas: %j", datas);    //datas: ["n","m","l","k","j","i","h","g","f","d","c","b","a"]
	});

	rc.ZREVRANGE(key1, 0, -1, "WITHSCORES", function (err, values) {
		console.log("values: %j", values);  //values: ["n","13","m","12","l","11","k","10","j","9","i","8","h","7","g","6","f","5","d","4","c","3","b","2","a","1"]
	});
};

var zrangebyscore = function () {   //返回有序集 key 中，所有 score 值介于 min 和 max 之间(包括等于 min 或 max )的成员。有序集成员按 score 值递增(从小到大)次序排列。
	rc.ZRANGEBYSCORE(key1, 5, 10, function (err, datas) {
		console.log("datas: %j", datas);    //datas: ["f","g","h","i","j","k"]
	});

	rc.ZRANGEBYSCORE(key1, 5, 10, "WITHSCORES", function (err, datas) {
		console.log("datas: %j", datas);    //datas: ["f","5","g","6","h","7","i","8","j","9","k","10"]
	});

	rc.ZRANGEBYSCORE(key1, "-inf", "+inf", "WITHSCORES", function (err, datas) { //所有成员
		console.log("datas: %j", datas);    //datas: ["a","1","b","2","c","3","d","4","f","5","g","6","h","7","i","8","j","9","k","10","l","11","m","12","n","113"]
	});
	//offset count
	rc.ZRANGEBYSCORE(key1, "-inf", "+inf", "WITHSCORES", "LIMIT", 2, 5, function (err, datas) {
		console.log("datas: %j", datas);    //datas: ["c","3","d","4","f","5","g","6","h","7"]
	});
};

var zrevrangebyscore = function () {    //返回有序集 key 中， score 值介于 max 和 min 之间(默认包括等于 max 或 min )的所有的成员。有序集成员按 score 值递减(从大到小)的次序排列。
	rc.ZREVRANGEBYSCORE(key1, 10, 5, "WITHSCORES", function (err, datas) {
		console.log("datas: %j", datas);    //datas: ["k","10","j","9","i","8","h","7","g","6","f","5"]
	});
};

var zrank = function () {       //返回有序集 key 中成员 member 的排名(0开始)。其中有序集成员按 score 值递增(从小到大)顺序排列。
	rc.ZRANK(key1, "m", function (err, rank) {
		console.log("rank: %j", rank);
	});
};

var zrevrank = function () {    //返回有序集 key 中成员 member 的排名(0开始)。其中有序集成员按 score 值递减(从大到小)排序。
	rc.ZREVRANK(key1, "m", function (err, rank) {
		console.log("rank: %j", rank);
	});
};

var zrem = function () {        //移除有序集 key 中的一个或多个成员，不存在的成员将被忽略。
	rc.ZREM(key1, 'z', function (err, rmCount) {
		console.log("rmCount: %j", rmCount);
	});
};

var zremrangebyrank = function () {     //移除有序集 key 中，指定排名(rank)区间内的所有成员。
	rc.ZREMRANGEBYRANK(key1, 0, 0, function (err, rmCount) {
		console.log("rmCount: %j", rmCount);
	});
};

var zremrangebyscore = function () {    //移除有序集 key 中，所有 score 值介于 min 和 max 之间(包括等于 min 或 max )的成员。
	rc.ZREMRANGEBYSCORE(key1, 3, 6, function (err, rmCount) {
		console.log("rmCount: %j", rmCount);
	});
};

var zscore = function () {      //返回有序集 key 中，成员 member 的 score 值。
	rc.ZSCORE(key1, 'f', function (err, score) {
		console.log("score: %j", score);
	});
};

//以下命令不常用，不再尝试
//ZUNIONSTORE
//ZINTERSTORE
//ZSCAN
//ZRANGEBYLEX
//ZLEXCOUNT
//ZREMRANGEBYLEX

