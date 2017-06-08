/**
 * Created by wyq on 17/6/8.
 */
"use strict";
const mongoose = require('mongoose');
const Bluebird = require("bluebird");
mongoose.Promise = Bluebird;
mongoose.connect("mongodb://localhost/smart-city-local");
const Schema = mongoose.Schema;

let t1Schema = new Schema({
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
let t1Model = mongoose.model("log", t1Schema);

t1Model.aggregate([
	{
		$match: {
			"sn": "01581117C66451E0"
		}
	},
	{
		$group: {
			_id: {
				year: {$year: '$updatedTime'},
				month: {$month: '$updatedTime'},
				day: {$dayOfMonth: "$updatedTime"},
				hour: {$hour: "$updatedTime"}
			},
			batteryavg: {$avg: "$sensorData.battery"},
			batterymin: {$min: "$sensorData.battery"},
			batterymax: {$max: "$sensorData.battery"},
			lightavg: {$avg: "$sensorData.light"},
			lightmin: {$min: "$sensorData.light"},
			lightmax: {$max: "$sensorData.light"}
		}
	}
], function (err, results) {
	console.log("%j", arguments);
});

var a = {
	"0": null,
	"1": [
		{
			"_id": {"year": 2017, "month": 6, "day": 3, "hour": 3},
			"batteryavg": 1,
			"batterymin": 1,
			"batterymax": 1,
			"lightavg": 14627.871849314974,
			"lightmin": 4.19,
			"lightmax": 4270000
		}, {
			"_id": {"year": 2017, "month": 6, "day": 3, "hour": 4},
			"batteryavg": 1,
			"batterymin": 1,
			"batterymax": 1,
			"lightavg": 1345408.6498885795,
			"lightmin": 3.79,
			"lightmax": 483000000
		}, {
			"_id": {"year": 2017, "month": 6, "day": 3, "hour": 5},
			"batteryavg": 1,
			"batterymin": 1,
			"batterymax": 1,
			"lightavg": 3.96348314606741,
			"lightmin": 3.06,
			"lightmax": 5.06
		}, {
			"_id": {"year": 2017, "month": 6, "day": 3, "hour": 6},
			"batteryavg": 1,
			"batterymin": 1,
			"batterymax": 1,
			"lightavg": 3.052480620155039,
			"lightmin": 2.9,
			"lightmax": 3.3
		}
	]
};