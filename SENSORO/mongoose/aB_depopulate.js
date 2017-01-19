/**
 * Created by wyq on 17/1/18.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t1Schema = new Schema({
	name: {type: String},
	age: {type: Number},
	addr: {type: String}
}, {versionKey: false});

let t1Model = mongoose.model("t1", t1Schema);

let t2Schema = new Schema({
	first: {type: String},
	last: {type: String},
	t1Id: {type: mongoose.Schema.Types.ObjectId, ref: "t1"}
}, {versionKey: false});

let t2Model = mongoose.model("t2", t2Schema);

function test() {
	let t1Doc = {
		name: "t1",
		age: 1,
		addr: "china"
	};
	t1Model.create(t1Doc).then(t1Val => {
		console.log("t1Val: %j", t1Val);//t1Val: {"name":"t1","age":1,"addr":"china","_id":"587f2ae484d3a7ab43deede2"}
		let t2Doc = {
			first: "Hello",
			last: "World",
			t1Id: t1Val._id
		};
		return t2Model.create(t2Doc);
	}).then(t2Val => {
		console.log("t2Val: %j", t2Val);//t2Val: {"first":"Hello","last":"World","t1Id":"587f2ae484d3a7ab43deede2","_id":"587f2ae484d3a7ab43deede3"}
		return t2Model.findOne({first: "Hello"}).populate("t1Id").exec();
	}).then(val => {
		console.log("val: %j", val);//val: {"_id":"587f2ae484d3a7ab43deede3","first":"Hello","last":"World","t1Id":{"_id":"587f2ae484d3a7ab43deede2","name":"t1","age":1,"addr":"china"}}
		console.log("t1Id: %j", val.t1Id);//t1Id: {"_id":"587f2ae484d3a7ab43deede2","name":"t1","age":1,"addr":"china"}
		val.depopulate("t1Id"); //将populate解析查询出来的内容再次转换为id
		console.log("t1Id: %j", val.t1Id);//t1Id: "587f2ae484d3a7ab43deede2"
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

test();


