/**
 * Created by wyq on 16/12/8.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t9Schema = new Schema({
	name: {type: String, unique: true},
	age: {type: Number},
	addr: {type: String}
}, {versionKey: "_myVersionKey"});  //版本(默认为_v),false代表没有该字段

let t9Model = mongoose.model("t9", t9Schema);

function create() {
	let doc = {
		name: "AAA",
		age: 20,
		addr: "bj"
	};
	t9Model.create(doc).then(val => {
		console.log("val: %j", val);
	});
}

create();