/**
 * Created by wyq on 16/12/7.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let t1Schema = new Schema({
	name: {type: String, unique: true},
	age: {type: Number},
	addr: {type: String}
}, {versionKey: false});

let t1Model = mongoose.model("t1", t1Schema);

function create() {
	let doc = [
		{
			name: "AAAA",
			age: 20,
			addr: "AAAA"
		},
		{
			name: "BBBB",
			age: 30,
			addr: "BBBB"
		},
		{
			name: "CCCC",
			age: 40,
			addr: "CCCC"
		},
		{
			name: "DDDD",
			age: 50,
			addr: "DDDD"
		}
	];
	t1Model.create(doc, function (err, response) {
		console.log(err, response);
	});
}

function readStream() {
	var stream = t1Model.find().stream();
	stream.on("data", function (item) {
		console.log("item: %j", item);
		stream.pause(); //暂停流
		setTimeout(function () {
			return stream.resume(); //延时启动流
		}, 1000);
	}).on("close", function () {
		console.log("=== finish ===");
	}).on("error", function (err) {
		console.log("err: %j", err);
	});
}

readStream();