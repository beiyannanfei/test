/**
 * Created by wyq on 17/1/18.
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

if (!t2Schema.options.toObject) {
	t2Schema.options.toObject = {};
}

t2Schema.options.toObject.transform = function (doc, ret, options) {
	console.log("doc: %j, ret: %j", doc, ret);
	ret.id = ret._id.toString();
	ret.fullName = ret.first + "-" + ret.last;
	delete ret._id;
};

let t2Model = mongoose.model("t2", t2Schema);

let doc = {
	first: "Hello",
	last: "World",
	time: new Date()
};

t2Model.create(doc).then(val => {
	console.log("val: %j", val);
	return t2Model.findById(val._id);
}).then(val => {
	console.log("val: %j", val);
	console.log(val.toObject({transform: xForm}));
	val = val.toObject();
	console.log("val: %j", val);
}).catch(err => {
	console.log("err: %j", err.message || err);
});

function xForm(doc, ret, options) {
	return {timeStamp: +ret.time, custom: true};
}


