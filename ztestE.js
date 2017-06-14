"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/smart-city-local");
const Schema = mongoose.Schema;
const client = require("./SENSORO/elasticSearch_test/esClient").esClient;
const async = require("async");

var schema = new Schema({
	msgId: String,
	taskId: String,
	type: String,
	sn: String,
	appId: String,
	sensorData: {
		battery: Number,
		temperature: Number,
		light: Number, // 光线传感器数据
		humidity: Number,
		water: Number,
		jinggai: Boolean,
		drop: Number,
		co: Number,
		co2: Number,
		distance: Number,  // 水位（测距）传感器数据
		calibration: Number, // 水位（测距）传感器的标定值
		angle: Number,
		so2: Number,
		no2: Number,
		ch4: Number,
		pm2_5: Number,
		pm10: Number,
		cover: Boolean, // 标准传感器，井盖是否闭合
		level: Boolean,  // 标准传感器，液位是否达到预警值
		smoke: Boolean,
		customer: String
	},
	lonlat: {type: [Number]},
	interval: Number,
	updatedTime: {type: Date, default: Date.now, expires: '2160h'}
});

let t1Model = mongoose.model("log", schema);

t1Model.find({sn: "11401017C61870E8"}).then(val => {
	async.eachSeries(val, function (item, cb) {
		let doc = {
			index: 'city-es',    //db
			type: 'logs',     //table
			body: {}
		};
		item.msgId && (doc.body.msgId = item.msgId);
		item.taskId && (doc.body.taskId = item.taskId);
		item.type && (doc.body.type = item.type);
		item.sn && (doc.body.sn = item.sn);
		item.appId && (doc.body.appId = item.appId);
		item.sensorData ? (doc.body.sensorData = item.sensorData) : "";
		item.lonlat && (doc.body.lonlat = item.lonlat);
		item.interval && (doc.body.interval = item.interval);
		item.updatedTime && (doc.body.updatedTime = +new Date(item.updatedTime));
		console.log("============ item: %j, doc: %j", item, doc);
		client.create(doc, function (err, val) {
			if (!!err) {
				console.log("======= es err: %j", err.message || err);
			}
			return cb();
		});
	}, function (err) {
		console.log("=============== finish ===============");
	});
});