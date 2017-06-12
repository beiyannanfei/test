/**
 * Created by wyq on 17/6/12.
 * $hour
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
	timeStr: String
});
let t1Model = mongoose.model("hour_test", t1Schema);

function toSave() {
	let doc = [
		{
			name: "AAA",
			timeStr: "2017-06-12 12:19:35"
		},
		{
			name: "BBB",
			timeStr: "2017-06-12 11:19:35"
		},
		{
			name: "CCC",
			timeStr: "2017-06-12 10:19:35"
		}
	];
	t1Model.create(doc).then(val => {
		console.log("var: %j", val);
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function toAgg() {
	let condition = [
		{
			$group: {
				_id: {
					year: {$year: "$timeStr"},
					month: {$month: "$timeStr"},
					day: {$dayOfMonth: "$timeStr"},
					hour: {$hour: "$timeStr"}
				},
				count: {$sum: 1}
			}
		}
	];
	t1Model.aggregate(condition, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log(response);
	});
}
toAgg();