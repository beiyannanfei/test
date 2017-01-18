"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t1Schema = new Schema({
	name: {type: String},
	age: {type: Number},
	addr: {type: String}
});

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
		setTimeout(stream, 2000);
	});
}

function stream() {
	var stream = t1Model.find().stream();
	stream.on("data", item => {
		console.log("====== item: %j", item);
		stream.pause(); //暂停流
		setTimeout(function () {
			stream.resume();
		}, 1000);
	});
	stream.on("close", () => {
		console.log("======= finish");
	});
	stream.on("error", err => {
		console.log("err: %j", err);
	});
}

create();