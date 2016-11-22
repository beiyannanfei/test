/**
 * Created by wyq on 16/11/21.
 */
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

let t6Model = mongoose.model("t6", t1Schema);

let doc = {
	name: "AAA",
	age: 20,
	addr: "beijing"
};

function test() {
	t6Model.create(doc).then(val => {
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err);
	});
}

function test1(type) {
	t6Model.findOne({name: "AAA"}, {addr: 1}).then(val => {
		console.log("val: %j", val);
		console.log(val[type]);
	}).catch(err => {
		console.log("err: %j", err);
	});
}

test1("addr");