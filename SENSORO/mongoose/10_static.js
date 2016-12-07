/**
 * Created by wyq on 16/12/7.
 * mogoose 注册静态方法
 */
"use strict";
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
var Schema = mongoose.Schema;

var t1Schema = new Schema({
	name: {type: String, unique: true},
	age: {type: Number},
	addr: {type: String}
}, {versionKey: false});

t1Schema.static("say", function (cb) {  //静态方法在Model层就能使用
	console.log("====== mongoose static method ======");
	return setTimeout(cb, 1000, "Hello");
});

t1Schema.methods.speak = function (cb) {
	console.log("====== t1Schema.methods.speak ======");
	return setTimeout(cb, 1000, "World");
};

var t1Model = mongoose.model("t1", t1Schema);

t1Model.say(function (info) {
	console.log("say info: %s", info);
});

var t1Entity = new t1Model({name: "a", age: 28, addr: "chengdu"});
t1Entity.speak(function (con) {
	console.log("speak con: %s", con);
});