"use strict";
global.Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t1Schema = new Schema({
	name: {type: String},
	age: {type: Number},
	addr: {type: String}
});

let t4Model = mongoose.model("t4", t1Schema);

let doc = {
	name: "AAA",
	age: 20,
	addr: "beijing"
};

function test() {
	t4Model.create(doc).then(val => {
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err);
	});
}

function test1() {
	t4Model.remove({"name": "AAA"}).then(val => {
		console.log("val: %j", val);//val: {"ok":1,"n":1}有数据   {"ok":1,"n":0}无数据
	}).catch(err => {
		console.log("err: %j", err);
	});
}
test1();