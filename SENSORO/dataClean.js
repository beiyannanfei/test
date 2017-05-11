/**
 * Created by wyq on 17/5/11.
 */
const _ = require("underscore");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

var dataClean = function (data) {
	if (!_.isObject(data) || _.isArray(data) || data instanceof ObjectId) {
		return;
	}
	for (var k in data) {
		var val = data[k];
		if (_.isArray(val)) {
			data[k] = _.filter(val, function (item) {
				return item !== null && item !== undefined && item !== '';
			});
		} else if (val === null || val === undefined || val === '') {
			if (_.isArray(data)) {
				data.splice(k, 1);
			} else {
				delete data[k];
			}
		} else if (_.isObject(data[k])) {
			dataClean(data[k]);
		}
	}
};

let data = {
	"_id": ObjectId("591163cc03561a367bd93936"),
	"data": {
		"createdTime": 1494311883925.0,
		"data": {
			"smoke": null,
			"level": null,
			"cover": null,
			"angle": null,
			"pm10": null,
			"pm2_5": null,
			"pm1": null,
			"o3": null,
			"lpg": null,
			"ch2o": null,
			"ch4": null,
			"no2": null,
			"so2": null,
			"co2": null,
			"co": null,
			"leak": null,
			"light": null,
			"humidity": null,
			"temperature": null,
			"gyroscope": null,
			"magnetism": null,
			"acceleration": null,
			"gps": null,
			"battery": 99,
			"appParam": {
				"confirm": null,
				"nodeAlarmSet": null,
				"nodeAlarm": null,
				"nodeState": null,
				"syncTime": null,
				"uploadInterval": 5,
				"cmd": null
			},
			"bleParam": null,
			"loraParam": null,
			"cmdRet": 0,
			"cmd": null,
			"id": 0,
			"customer": "14080018003202100538c601"
		},
		"msgId": "591163cb805dde3197c025bf",
		"type": "text",
		"deviceType": "module",
		"sn": "01521117C69ED23E",
		"appId": "lUn0eDNDHOMs"
	},
	"__v": 0
};

dataClean(data);
console.log("%j", data);