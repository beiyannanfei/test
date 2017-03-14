/**
 * Created by wyq on 17/3/9.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t1Schema = new Schema({
	name: {type: String, unique: true},
	age: {type: Number},
	addr: {type: String, default: "unknown address"}
}, {versionKey: false});

let t1Model = mongoose.model("t1", t1Schema);

function t1() {
	t1Model.findOne(function (err, response) {
		if (!!err || !response) {
			return console.log(err.message || "no data");
		}
		console.log(response);
		response.name += "_TEST";
		console.log(response);
		response.save(function (err, newDoc) {
			console.log(arguments);
			process.exit(1);
		});
	});
}

function t2() {
	t1Model.findOne(function (err, response) {
		if (!!err || !response) {
			return console.log(err.message || "no data");
		}
		console.log(response);
		t3(response);
	});
}

var _ = require("underscore");
function t3(info) {
	// info = _.pick(info, "_id", "name", "age", "save");
	info.addr = undefined;
	console.log(info);
	info.save(function (err, response) {
		console.log(arguments);
		process.exit(1);
	});
}

t2();

