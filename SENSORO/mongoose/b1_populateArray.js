/**
 * Created by wyq on 17/4/7.
 * 练习测试ref是一个数组的情况
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
var _ = require("underscore");

let t1Schema = new Schema({
	name: {type: String},
	age: {type: Number},
	addr: {type: String}
}, {versionKey: false});

let t1Model = mongoose.model("t1", t1Schema);

//10811017C6CCF7A7
let t2Schema = new Schema({
	job: {type: String},
	love: {type: String},
	t1Id: [{type: mongoose.Schema.Types.ObjectId, ref: "t1"}]
});

if (!t2Schema.options.toJSON) {
	t2Schema.options.toJSON = {};
}

t2Schema.options.toJSON.transform = function (doc, ret) {
	// console.log("==== ret: %j", ret);
	delete ret._id;
};


let t2Model = mongoose.model("t2", t2Schema);

function test1() {
	let doc = [
		{
			name: "AAAA",
			age: 20,
			addr: "beijing"
		},
		{
			name: "BBBB",
			age: 30,
			addr: "shanghai"
		},
		{
			name: "CCCC",
			age: 40,
			addr: "xianggang"
		}
	];
	t1Model.create(doc, function (err, response) {
		console.log(response);
		let doc = {
			_id: "57fb035353121ec02ce78a09",
			job: "chengxuyuan",
			love: "changge",
			t1Id: _.pluck(response, "_id")
		};
		t2Model.create(doc, function (err, response) {
			console.log(arguments);
		});
	});
}

function test2() {
	t2Model.findOne({"love": "changge"}).populate({path: "t1Id"}).exec(function (err, response) {
		console.log(response.toJSON());
		t2Model.update({_id: response._id}, {$push: {t1Id: "58eb5a60cb01aedee33f7279"}}, function (err, response) {
			console.log(arguments);
		});
	});
}

// test1();
test2();
var a = {
	t1Id: [
		{
			addr: 'beijing',
			age: 20,
			name: 'AAAA',
			_id: "58e76596dae24a13d2e93ef6"
		},
		{
			addr: 'shanghai',
			age: 30,
			name: 'BBBB',
			_id: "58e76596dae24a13d2e93ef7"
		},
		{
			addr: 'xianggang',
			age: 40,
			name: 'CCCC',
			_id: "58e76596dae24a13d2e93ef8"
		}
	],
	__v: 0,
	love: 'changge',
	job: 'chengxuyuan',
	_id: "57fb035353121ec02ce78a09"
};

