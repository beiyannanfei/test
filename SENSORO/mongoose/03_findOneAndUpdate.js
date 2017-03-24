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

let t1Model = mongoose.model("t1", t1Schema);

/*{ db—data
 "_id" : ObjectId("580d87078f122a01afe18838"),
 "name" : "AAAA",
 "age" : 20,
 "addr" : "beijing",
 "__v" : 0
 }*/

function test() {
	t1Model.findOneAndUpdate(
		{name: "AAAA"},
		{$set: {name: "AAAA", age: 21, addr: "shang-hai"}},
		{upsert: true, new: true},  //new 返回更新后的文档
		function (err, doc) {
			console.log("doc: %j", doc);
		});
}

test();
