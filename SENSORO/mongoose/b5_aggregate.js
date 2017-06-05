/**
 * Created by wyq on 17/6/5.
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
	users: {type: String},
	deviceSN: {type: String},
	alarmStatus: {type: Number, enum: [0, 1, 2], default: 0},
	updatedTime: {type: Date, default: Date.now}
});
let t1Model = mongoose.model("agg_test", t1Schema);

let doc = [
	{
		users: "0001",
		deviceSN: "sn1",
		alarmStatus: 2,
		updatedTime: new Date(moment().add(-1, "d"))
	},
	{
		users: "0001",
		deviceSN: "sn2",
		alarmStatus: 1,
		updatedTime: new Date(moment().add(-1, "d"))
	},
	{
		users: "0001",
		deviceSN: "sn3",
		alarmStatus: 2,
		updatedTime: new Date(moment().add(-1, "d"))
	},
	{
		users: "0002",
		deviceSN: "sn1",
		alarmStatus: 2,
		updatedTime: new Date(moment().add(-1, "d"))
	},
	{
		users: "0001",
		deviceSN: "sn3",
		alarmStatus: 2
	}
];

function toSave() {
	t1Model.create(doc).then(val => {
		console.log("save success");
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function toAggre() {
	let condition = [
		{
			$match: {
				users: "0001",
				alarmStatus: 2,
				updatedTime: {$gte: new Date(moment().add(-1, "d").startOf('d'))}
			}
		},
		{
			$group: {
				_id: {
					year: {$year: '$updatedTime'},
					month: {$month: '$updatedTime'},
					day: {$dayOfMonth: "$updatedTime"}
				},
				sn: {$addToSet: "$deviceSN"}
			}
		}
	];
	t1Model.aggregate(condition, function (err, results) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("results: %j", results);
	});
}
toAggre();


