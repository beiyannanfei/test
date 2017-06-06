/**
 * Created by wyq on 17/6/6.
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
	age: Number,
	dateTime: {type: Date, default: Date.now}
});
let t1Model = mongoose.model("where_test", t1Schema);

function toSave() {
	let doc = [
		{
			name: "AA",
			age: 20
		},
		{
			name: "BB",
			age: 30
		},
		{
			name: "CC",
			age: 40
		}
	];
	t1Model.create(doc).then(val => {
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function toWhere() {
	t1Model.find({$where: "this.age > 20"}).then(val => {
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function toWhere1() {
	var q = function () {
		for (var index in this) {
			printjson(index + "-" + this[index]);
			if (index === "name" && this[index] === "AA") {
				return true;
			}
		}
	};
	t1Model.find({$where: q}).then(val => {
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

toWhere1();