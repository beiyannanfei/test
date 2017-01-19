/**
 * Created by wyq on 17/1/18.
 * static 方法
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

t2Schema.static("say", function (p1, p2, cb) {  //注意: 一定要定义在model之前才生效
	return cb(null, "test:" + p1 + "," + p2);
});

let t2Model = mongoose.model("t2", t2Schema);

t2Model.say(1, 2, function (err, reponse) {
	console.log(arguments);
});