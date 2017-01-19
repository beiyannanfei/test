/**
 * Created by wyq on 17/1/19.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
const co = require("co");

let t2Schema = new Schema({
	first: {type: String},
	last: {type: String},
	time: Date
});
let t2Model = mongoose.model("t2", t2Schema);

var docs = [
	{
		first: "A1",
		last: "B1",
		time: new Date()
	},
	{
		first: "A2",
		last: "B2",
		time: new Date()
	},
	{
		first: "A3",
		last: "B3",
		time: new Date()
	},
	{
		first: "A4",
		last: "B4",
		time: new Date()
	}
];

function test() {
	t2Model.create(docs).then(val => {
		console.log(val);
		equals();
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function equals() {
	t2Model.where("first").equals("A1").exec().then(val => {
		console.log("equals val: %j", val);
	}).catch(err => {
		console.log("equals err: %j", err.message || err);
	});

	t2Model.where("first", "A1").then(val1 => {
		console.log("equals val1: %j", val1);
	}).catch(err1 => {
		console.log("equals err1: %j", err1.message || err1);
	});
}

test();