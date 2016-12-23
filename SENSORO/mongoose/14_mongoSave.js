/**
 * Created by wyq on 16/12/23.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t10Schema = new Schema({
	name: {type: String},
	age: {type: Number},
	addr: {type: String}
});

let t10Model = mongoose.model("t10", t10Schema);

function create() {
	let doc = {
		name: "AAA12",
		age: 20,
		addr: "bj"
	};
	t10Model.create(doc).then(val => {
		console.log("val: %j", val);
	});
}

function save() {
	t10Model.findOne({name: "AAA12"}).then(val => {
		console.log("val: %j", val);
		val.age = 21;
		val.addr = "beijing";
		return val.save();    //对查询出来的文档修改赋值后可以直接执行save方法,即可更新文档
	}).then(val => {
		console.log("save finish val: %j", val);
	});
}

save();