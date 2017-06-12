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
	createTime: {type: Date, default: Date.now}
});
let t1Model = mongoose.model("hour_test", t1Schema);

function toSave() {
	let doc = [
		{
			name: "AAA",
			createTime: "2017-06-12 12:19:35"
		},
		{
			name: "BBB",
			createTime: "2017-06-12 11:19:35"
		},
		{
			name: "CCC",
			createTime: "2017-06-12 10:19:35"
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
					year: {$year: "$createTime"},
					month: {$month: "$createTime"},
					day: {$dayOfMonth: "$createTime"},
					hour: {$hour: "$createTime"}  //由于保存到数据库中的时间是ISOdate,和实际时间有八个小时的时差,统计出来的数据也有八个小时的误差
					// 解决方案
					// const timeZoneOffset = -new Date().getTimezoneOffset() * 60 * 1000; //时区偏移毫秒数
					// year: {$year: [{$add: ['$createTime', timeZoneOffset]}]},
					// month: {$month: [{$add: ['$createTime', timeZoneOffset]}]},
					// day: {$dayOfMonth: [{$add: ['$createTime', timeZoneOffset]}]},
					// hour: {$hour: [{$add: ['$createTime', timeZoneOffset]}]}
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