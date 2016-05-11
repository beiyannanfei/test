/**
 * Created by wyq on 2015/11/30.
 */
var fs = require("fs");
var http = require("http");
var when = require("when");
var redis = require("redis");
var redisClient = redis.createClient(6379, "127.0.0.1");
/*
 var getRssAddress = function (path, callback) {
 fs.readFile(path, {encoding: 'utf8'}, function (err, data) {
 callback(err, data);
 });
 };

 var getRss = function (url, callback) {
 var data = '';
 http.get(url, function (res) {
 res.on('data', function (chrunk) {
 data += chrunk;
 });

 res.on('end', function () {
 callback(null, data);
 });
 }).on('error', function (err) {
 callback(err, null);
 });
 };

 var saveRss = function (data, callback) {
 fs.writeFile('rss.txt', data, 'utf8', function (err) {
 callback(err);
 });
 };

 var test = function () {
 getRssAddress("./address.txt", function (err, data) {
 console.log("err: %j, data: %j", err, data);
 getRss(data, function (err, data) {
 console.log("err: %j, data: %j", err, data);
 saveRss(data, function (err, data) {
 console.log("err: %j, data: %j", err, data);
 });
 });
 });
 };
 */


var getRssAddress = function (path) {
	var deferred = when.defer();
	fs.readFile(path, {encoding: 'utf8'}, function (err, data) {
		if (err) {
			return deferred.reject(err);
		}
		console.log("*********** getRssAddress readFile ***********");
		return deferred.resolve(data);
	});
	console.log("*********** getRssAddress ***********");
	return deferred.promise;
};

var getRss = function (url) {
	var deferred = when.defer();
	var data = '';
	http.get(url, function (res) {
		res.on('data', function (chrunk) {
			data += chrunk;
		});
		res.on('end', function () {
			console.log("*********** getRss get ***********");
			return deferred.resolve(data);
		});
	}).on('error', function (err) {
		return deferred.reject(err);
	});
	console.log("*********** getRss ***********");
	return deferred.promise;
};

var saveRss = function (data) {
	var deferred = when.defer();
	fs.writeFile('rss.txt', data, 'utf8', function (err) {
		if (err) {
			return deferred.reject(err);
		}
		console.log("*********** saveRss saveRss ***********");
		return deferred.resolve();
	});
	console.log("*********** saveRss ***********");
	return deferred.promise;
};

/*
 getRssAddress('address.txt')
 .then(getRss)
 .then(saveRss)
 .catch(function (err) {
 console.log(err);
 });
 */


var test = function () {
	getRssAddress('address.txt')
		.then(function (data) {
			console.log("******0***** data: %j", data);
			return getRss(data);
		})
		.then(function (data) {
			console.log("******1***** data: %j", data);
			return saveRss(data);
		})
		.catch(function (err) {
			console.log("******** err: %j", err);
		});
};

test();




