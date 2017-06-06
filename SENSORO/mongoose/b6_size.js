/**
 * Created by wyq on 17/6/6.
 */
"use strict";
const mongoose = require('mongoose');
const Bluebird = require("bluebird");
mongoose.Promise = Bluebird;
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
const moment = require("moment");
const _ = require("underscore");

let t1Schema = new Schema({
	name: String,
	arr: [Number],
	dateTime: {type: Date, default: Date.now}
});
let t1Model = mongoose.model("size_test", t1Schema);

function toSave() {
	let doc = [
		{
			name: "AA",
			arr: [1]
		},
		{
			name: "BB",
			arr: [1, 2]
		},
		{
			name: "CC",
			arr: [1, 2, 3]
		}
	];
	t1Model.create(doc).then(val => {
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function toSize() {
	//但条件操作符"$size"不能和其他操作符连用如“$gt”等，这是这个操作符的一个缺陷。使用这个操作符我们只能精确查询某个长度的数组。
	t1Model.find({arr: {$size: 2}}).then(val=> {
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

toSize();

