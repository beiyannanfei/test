/**
 * Created by wyq on 17/6/29.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t1Schema = new Schema({
	name: {type: String, unique: true},
	age: {type: Number},
	addr: {type: String}
}, {versionKey: false});

let t1Model = mongoose.model("t1", t1Schema);

async function callStat() {
	let doc = {
		name: "AAAE",
		age: 25,
		addr: "beijing"
	};
	try {
		let response = await t1Model.create(doc);
		console.log(response);
		response = await t1Model.update({_id: response._id}, {$set: {age: 26}});
		console.log(response);
		response = await t1Model.find({age: 26});
		console.log(response);
	} catch (e) {
		console.log("e: %j", e.message || e);
	}
}

callStat();
