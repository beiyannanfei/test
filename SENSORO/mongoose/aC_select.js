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

let t2Model = mongoose.model("t2", t2Schema);

t2Model.findOne().then(val => {
	console.log(val);
	return t2Model.findById(val._id).select({"first": 1, _id: 0});
}).then(val => {
	console.log(val);
});