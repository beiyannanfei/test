/**
 * Created by wyq on 16/12/26.
 * 大量数量分页
 */

"use strict";
const uuid = require("uuid");
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
const async = require("async");

let t11Schema = new Schema({
	uuid: {type: String},
	timeStamp: {type: String}
}, {versionKey: false});

let t11Model = mongoose.model("t11", t11Schema);

var GetUuid = function () {
	var buffer = new Array(32);
	uuid.v4(null, buffer, 0);
	var string = uuid.unparse(buffer);
	string = string.replace(/-/g, "");
	return string;
};

let i = 1;

function create100w() {   //创建100w条数据
	async.whilst(function () {
		return i < 1000000;
	}, function (cb) {
		++i;
		let doc = {
			uuid: GetUuid(),
			timeStamp: +new Date() + ""
		};
		t11Model.create(doc, function (err, response) {
			if (!(i % 100)) {
				console.log("*********************** i: %j, err: %j, response: %j", i, err, response);
			}
			return cb(err);
		});
	}, function (err) {
		console.log("========== finish err: %j", err);
	});
}

// create100w();

function create100wPer100() { //每次创建100条,创建100w条数据
	let index = 0;
	async.whilst(function () {
		return index < 5000;
	}, function (cb) {
		++index;
		let funcList = [];
		for (let i = 0; i < 200; ++i) {
			let doc = {
				uuid: GetUuid(),
				timeStamp: +new Date() + ""
			};
			funcList.push(cb => t11Model.create(doc, cb));
		}
		async.parallel(funcList, function (err, response) {
			console.log("[%j] ============== index: %j, err: %j, response: %j", new Date().toLocaleString(), index, err, response);
			return cb(err);
		});
	}, function (err) {
		console.log("========== finish err: %j", err);
	});
}


function getPageData(page) {
	let options = {sort: {uuid: -1}, limit: 10, skip: (page - 1) * 10};
	console.time("paging");
	t11Model.find({}, {}, options, function (err, response) {
		console.log(err, response);
		console.timeEnd("paging");
	});
}

getPageData(220000);
