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
	age: Number,
	tags: [String],
	dateTime: {type: Date, default: Date.now}
});
let t1Model = mongoose.model("unwind_test", t1Schema);

function toSave() {
	let doc = [
		{
			name: "AA",
			age: 20,
			tags: ["T1", "T2"]
		},
		{
			name: "BB",
			age: 30,
			tags: ["T1", "T4"]
		}
	];
	t1Model.create(doc).then(val => {
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function toUnwind() {
	t1Model.aggregate([
		{$unwind: "$tags"}
	], function (err, results) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("results: %j", results);
		return process.exit(0);
	});
}

function toUnwindAndAgg() {   //首先将数组拍平然后进行统计
	t1Model.aggregate([
		{
			$unwind: "$tags"
		},
		{
			$project: {
				name: 1,
				age: 1,
				tags: 1
			}
		},
		{
			$group: {
				_id: "$tags",
				count: {$sum: 1}
			},
		}
	], function (err, results) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("results: %j", results);
		return process.exit(0);
	});
}
toUnwindAndAgg();