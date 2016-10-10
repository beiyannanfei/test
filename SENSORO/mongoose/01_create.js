/**
 * Created by wyq on 16/10/10.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

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

test2();









