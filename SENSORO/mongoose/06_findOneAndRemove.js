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

let t5Model = mongoose.model("t5", t1Schema);

let doc = {
	name: "AAA",
	age: 20,
	addr: "beijing"
};

function test() {
	t5Model.create(doc).then(val => {
		console.log("val: %j", val);
	}).catch(err => {
		console.log("err: %j", err);
	});
}

function test1() {
	t5Model.findOneAndRemove({name: "AAA"}, {select: {age: 1, addr: 1}}).then(val => { //有值 val: {"_id":"5832a0a1fe5af60d12d3b3d0","name":"AAA","age":20,"addr":"beijing","__v":0}
		console.log("val: %j", val);  //无值  val: null
	}).catch(err => {
		console.log("err: %j", err);
	});
}

test1();