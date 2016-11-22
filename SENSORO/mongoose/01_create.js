/**
 * Created by wyq on 16/10/10.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

console.log(mongoose.Types.ObjectId()); //生成一个_id
let t1Schema = new Schema({
	name: {type: String},
	age: {type: Number},
	addr: {type: String}
});

let t1Model = mongoose.model("t1", t1Schema);

let t2Schema = new Schema({
	job: {type: String},
	love: {type: String},
	t1Id: {type: mongoose.Schema.Types.ObjectId, ref: "t1"}
});

let t2Model = mongoose.model("t2", t2Schema);

function test1() {
	let doc = {
		name: "AAAA",
		age: 20,
		addr: "beijing"
	};
	t1Model.create(doc, function (err, response) {
		console.log(response);
		let doc = {
			_id: "57fb035353121ec02ce78a09",
			job: "chengxuyuan",
			love: "changge",
			t1Id: response._id
		};
		t2Model.create(doc, function (err, response) {
			console.log(arguments);
		});
	});
}

function test2() {
	t2Model.findOne({_id: "57fb035353121ec02ce78a09"}).populate("t1Id").exec(function (err, response) {
		console.log(response);
	});
}

function test3() {
	let doc = {
		name: "a1",
		age: 2010,
		addr: "shanghai 0001"
	};
	t1Model.update({name: doc.name}, {$set: doc}, {upsert: true}, function (err, response) {
		console.log(arguments);
		console.log(response);
		console.log(response.upserted);
	});
}

function test4() {
	t1Model.findById("57fb69c90ae727410c61c2b4")
		.then(val => {
			console.log(val);
			return t1Model.findById("57fb6a360ae727410c61c2b5")
		}).then(val => {
		console.log(val);
	}).catch(err => {
		console.log(err.message);
	})
}

function test5() {
	t2Model.find({_id: {$in: ["57fb035353121ec02ce78a09"]}}).populate("t1Id").exec().then(val => {
		console.log(val);
	}).catch(err => {
		console.log(err.message);
	});
}

function test6() {
	t2Model.count({}).then(val => {
		console.log(val);
	}).catch(err => {
		console.log(err.message);
	});
}



