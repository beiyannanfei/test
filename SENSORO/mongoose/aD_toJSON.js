/**
 * Created by wyq on 17/1/18.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t2Schema = new Schema({
	name: String,
	last: String
});

t2Schema.path("name").get(function (v) {
	return v + " is my name";
});
t2Schema.path("last").get(function (v) {
	return v + " is my last name";
});

t2Schema.set("toJSON", {getters: true, virtuals: false});
let t2Model = mongoose.model("t2", t2Schema);
var t = new t2Model({name: "Hello", last: "World"});
console.log(t.toObject());
console.log(t.toJSON());
console.log(JSON.stringify(t));