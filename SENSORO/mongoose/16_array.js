/**
 * Created by wyq on 17/1/4.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t12Schema = new Schema({
	name: {type: String},
	list: {type: Array}
});

let t12Model = mongoose.model("t12", t12Schema);

function create() {
	let doc = {
		name: "AAA12"
	};
	t12Model.create(doc).then(val => {
		console.log("val: %j", val);
	});
}

create();