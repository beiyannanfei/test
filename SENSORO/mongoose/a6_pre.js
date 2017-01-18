/**
 * Defines a pre hook for the document.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t2Schema = new Schema({
	first: {type: String},
	last: {type: String},
	time: Date
});

let t2Model = mongoose.model("t2", t2Schema);

t2Schema.pre("save", function (next) {
	console.log("pre save %j", this);
	this.time = new Date();
	this.first = this.first.toUpperCase();
	return next();
});

t2Schema.pre("validate", function (next) {  //会优先pre save 执行
	console.log("pre validate %j", this);
	this.last = "_" + this.last;
	return next();
});

var doc = {
	first: "a",
	last: "b"
};

t2Model.create(doc, (err, response) => {
	console.log("create finish %j", response);
});


