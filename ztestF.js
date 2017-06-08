//测试插入8000w数据到db
"use strict";
const mongoose = require('mongoose');
const Bluebird = require("bluebird");
mongoose.Promise = Bluebird;
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
const uuid = require("uuid");
const async = require("async");


var GetUuid = function () {
	var buffer = new Array(32);
	uuid.v4(null, buffer, 0);
	var string = uuid.unparse(buffer);
	string = string.replace(/-/g, "");
	return string;
};

let sns = ["001", "002", "003", "004", "005"];

let t1Schema = new Schema({
	sn: String,
	appId: String,
	sensorData: {
		battery: Number,
		temperature: Number,
		light: Number // 光线传感器数据
	},
	updatedTime: {type: Date, default: Date.now}
});
let t1Model = mongoose.model("sensor-log", t1Schema);

function toSave8kw() {
	var i = 0;
	async.whilst(
		function () {
			return i < 80000000;
		},
		function (cb) {
			++i;
			let doc = {
				sn: sns[Math.floor(Math.random() * sns.length)],
				appId: i,
				sensorData: {
					battery: ~~(Math.random() * 100),
					temperature: ~~(Math.random() * 30),
					light: ~~(Math.random() * 300000)
				}
			};
			t1Model.create(doc, function (err, response) {
				if (!!err) {
					console.log("err: %j", err.message || err);
				}
				if (i % 10000 === 0) {
					console.log("create %jw finis", ~~i / 10000);
				}
				return cb();
			});
		},
		function (err) {
			console.error(err);
		}
	);
}

function toAgg() {
	console.time("use: ");
	t1Model.aggregate([
		{
			$group: {
				_id: "$sn",
				lightAvg: {$avg: "$sensorData.light"},
				count: {$sum: 1}
			}
		}
	], function (err, results) {
		console.timeEnd("use: ");
		console.log("results: %j", results);
	});
}

toAgg();

