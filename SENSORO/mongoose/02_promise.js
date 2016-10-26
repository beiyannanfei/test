"use strict";
global.Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const Redis = require("ioredis");
const rc = new Redis(6379, "127.0.0.1");

let t1Schema = new Schema({
	name: {type: String},
	age: {type: Number},
	addr: {type: String}
});

let t1Model = mongoose.model("t1", t1Schema);

function get() {
	Promise.all([getCache("580d7037986797f8a1bfc3f2")]).spread(val => {
		console.log("get val: %j", val);
	}).catch(err => {
		console.log("get err: %j", err);
	});
}

function getCache(id) {
	return rc.get(id).catch(err => {
		console.log("getCache err: %j", err);
		return Promise.reject(err);
	}).then(val => {
		console.log("getCache val: %j", val);
		if (!val) {
			return getDb(id);
		}
		return JSON.parse(val);
	});
}

function getDb(id) {
	return t1Model.findById(id).then(val => {
		console.log("getDb val: %j", val);
		return val;
	}).catch(err => {
		console.log("getDb err: %j", err);
		return Promise.reject(err);
	});
}

get();
