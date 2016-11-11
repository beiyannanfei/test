"use strict";
global.Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

console.log(mongoose.Types.ObjectId()); //生成一个_id
let t1Schema = new Schema({
	name: {type: String},
	age: {type: Number},
	addr: {type: String}
});

let t3Model = mongoose.model("t3", t1Schema);

function test() {
	let doc = [
		{
			name: "AAA",
			age: 20,
			addr: "beijing"
		},
		{
			name: "BBB",
			age: 21,
			addr: "shanghai"
		},
		{
			name: "CCC",
			age: 22,
			addr: "guangzhou"
		}
	];
	t3Model.create(doc, function (err, datas) {
		console.log(arguments);
		t3Model.update({age: {$gte: 20}}, {$set: {name: "000000"}}, {multi: false}, function (err, response) {
			console.log(response);
			var a = {
				ok: 1,          //更新没有出错
				nModified: 0,   //修改的文档数量
				n: 1            //查询到符合条件的文档数量
			};
		});
	});
}

function test1() {//{"ok":1,"nModified":0,"n":1,"upserted":[{"index":0,"_id":"5812b52aa47683cdb499d416"}]}
	t3Model.update({name: "aaa"}, {name: "aaa", age: 20, addr: "beijing"}, {upsert: true}).then(val=> {
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err.message);
	});
}

function test2() {
	t3Model.remove({name: "aaa"}).then(val => { //{"ok":1,"n":1}文档存在  {"ok":1,"n":0}文档不存在
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err.message);
	});
}

function test3() {
	Promise.all([t3Model.remove({name: "aaa"}), t3Model.count({name: "aaab"})]).spread((v1, v2)=> {
		console.log(v1.result, v2);
	}).catch(err => {
		console.log("err: %j", err.message);
	});
}

function test4() {
	return t3Model.update({name: "aaa"}, {name: "aaa", age: 20, addr: "beijing"}, {upsert: true}).then(val=> {
		console.log("val: %j", val);
		return val;
	}).catch(err => {
		console.log("err: %j", err.message);
		return Promise.reject(err);
	});
}

function test5() {
	test4().then(val => {
		console.log("===val: %j", val);
	}).catch(err => {
		console.log("== err: %j", err.message);
	});
}

test5();

