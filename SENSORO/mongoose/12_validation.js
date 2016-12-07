/**
 * Created by wyq on 16/12/7.
 * 数据验证
 */
"use strict";
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
var Schema = mongoose.Schema;

var t8Schema = new Schema({
	name: {type: "String", required: true},
	age: {type: "Number", min: 18, max: 120},
	city: {type: "String", enum: ["bj", "sh"]}
}, {versionKey: false});

var t8Model = mongoose.model('t8', t8Schema);

function create() {
	let doc = {
		name: "AAA",
		age: 19,
		city: "bj"
	};
	t8Model.create(doc, function (err, response) {
		console.log(arguments);
	});
}




