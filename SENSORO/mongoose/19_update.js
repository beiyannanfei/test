/**
 * Created by wyq on 17/1/6.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t15Schema = new Schema({
	time: {type: Date, default: Date.now},
	li: {type: String},
	uid: {type: String}
});

let t15Model = mongoose.model("t15", t15Schema);


//无则创建,有则不变
function newAndUnique() {
	var condition = {li: "a1", uid: "b1"};
	var options = {upsert: true, setDefaultsOnInsert: true};
	t15Model.update(condition, condition, options, function (err, response) {
		console.log(response);
		// var a = {ok: 1, nModified: 0, n: 1, upserted: [{index: 0, _id: 586f6b8e6129cefc3f5274f6}]};
		// { ok: 1, nModified: 0, n: 1 }
	});
}

function findOneAndUpdate() {
	t15Model.findOneAndUpdate(
		{li: "AA"},
		{li: "AA", uid: "A0"},
		{upsert: true, setDefaultsOnInsert: true, new: true}, function (err, response) {
			console.log(response);
		});
}

function findnull() {
	t15Model.findOneAndUpdate({li: "AA"}, {li: "AA", uid: "A0"}, function (err, response) {
		console.log(response);
	});
}

findnull();