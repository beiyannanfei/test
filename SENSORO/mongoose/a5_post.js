/**
 * Defines a post hook for the document
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t2Schema = new Schema({
	first: {type: String},
	last: {type: String}
});

let t2Model = mongoose.model("t2", t2Schema);

t2Schema.post("save", function (doc) {
	console.log("== post save doc: %j", doc);
});

t2Schema.post("find", function (doc) {
	console.log("== post find doc: %j", doc);
});

var m = new t2Model({first: "aaa", last: "BBB"});

m.save(function () {
	console.log("save finish %j", arguments);
});

var doc = {first: "bbb", last: "CCC"};
t2Model.create(doc, function (err, response) {
	console.log("create finish %j", arguments);
});



