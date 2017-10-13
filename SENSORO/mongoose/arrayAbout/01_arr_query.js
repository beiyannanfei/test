/**
 * Created by wyq on 17/10/13.
 * 数组查询
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t1Schema = new Schema({
	item: String,
	qty: Number,
	tags: [String],
	dim_cm: [Number]
}, {versionKey: false});

let t1Model = mongoose.model("t1", t1Schema);