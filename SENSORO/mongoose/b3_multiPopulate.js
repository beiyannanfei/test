/**
 * Created by wyq on 17/5/15.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
const Bluebird = require("bluebird");

let t1Schema = new Schema({
	name: {type: String, unique: true},
	age: {type: Number},
	addr: {type: String}
}, {versionKey: false});

let t1Model = mongoose.model("a1", t1Schema);

let t2Schema = new Schema({
	job: {type: String},
	love: {type: String},
	email: {type: String}
});

let t2Model = mongoose.model("a2", t2Schema);

let t3Schema = new Schema({
	do: String,
	a1Id: {type: mongoose.Schema.Types.ObjectId, ref: "a1"},
	a2Id: {type: mongoose.Schema.Types.ObjectId, ref: "a2"},
});

let t3Model = mongoose.model("a3", t3Schema);

function createDoc() {
	let doc1 = {
		name: "张三",
		age: 28,
		addr: "北京"
	};

	let doc2 = {
		job: "程序员",
		love: "炒股",
		email: "13888888888@163.com"
	};

	Bluebird.all([
		t1Model.create(doc1),
		t2Model.create(doc2)
	]).spread((t1, t2) => {
		console.log("t1: %j, t2: %j", t1, t2);
		let doc = {
			do: "test",
			a1Id: t1._id,
			a2Id: t2._id
		};
		return t3Model.create(doc);
	}).then(val => {
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function multipopu() {
	t3Model.find()
		.populate({path: "a1Id", select: "name -_id"})
		.populate({path: "a2Id", select: "job -_id"})
		.exec()
		.then(val => {
			console.log("val: %j", val);
		})
		.catch(err => {
			console.log("err: %j", err.message || err);
		});
}
multipopu();
