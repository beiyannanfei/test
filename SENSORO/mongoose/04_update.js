"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
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

test();



