/**
 * Created by wyq on 17/1/6.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t14Schema = new Schema({
	time: {type: Date, default: Date.now},
	list: {type: Array},
	uid: {type: String}
});

let t14Model = mongoose.model("t14", t14Schema);

function create() {
	var doc = {
		time: new Date(),
		list: ["A"],
		uid: "a1"
	};
	t14Model.create(doc, (err, response) => {
		console.log(response);
	});
}

function update() {
	var conditon = {
		uid: "a1"
	};
	var upDoc = {$addToSet: {list: "B"}};
	t14Model.update(conditon, upDoc, {upsert: true, setDefaultsOnInsert: true}, (err, response) => {
		console.log(response);
		//没有数据插入数据 { ok: 1,	nModified: 0,	n: 1,	upserted: [ { index: 0, _id: 586f01de6129cefc3f5274c9 } ] }
		//有数据,列表插入新元素 { ok: 1, nModified: 1, n: 1 }
		//插入重复数据 { ok: 1, nModified: 0, n: 1 }
	});
}

function findAndUpdate() {
	var conditon = {
		uid: "a3",
		time: {$lte: new Date()}
	};
	var upDoc = {
		$addToSet: {list: "B"},
		$set: {time: new Date()}
	};
	var options = {upsert: true};
	t14Model.findOneAndUpdate(conditon, upDoc, options, (err, response) => {
		console.log(response);
		//没有数据  => null
		//插入成功 但是时间也随之改变
		//插入重复 时间也改变
	});
}


