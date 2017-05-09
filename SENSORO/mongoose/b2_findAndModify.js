/**
 * Created by wyq on 17/5/5.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t1Schema = new Schema({
	name: {type: String},
	age: {type: Number},
	addr: {type: String, default: "unknown address"}
});

let t1Model = mongoose.model("t1", t1Schema);


/*
let doc = {
	name: "AAAA",
	age: 15,
	addr: "bj"
};

t1Model.create(doc, function (err, response) {
	console.log(arguments);
});*/

t1Model.findAndModify();  //mongoose没有实现findAndModify方法