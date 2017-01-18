/**
 * Created by wyq on 17/1/15.
 * 文档中删除_id字段
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
let t = new t2Model({first: "A", last: "b", time: new Date()});
console.log(t.id);  //587ae0bd47f4a8141738804b

let t3Schema = new Schema({
	first: {type: String},
	last: {type: String},
	time: Date
}, {id: false});  //此时不会有id字段
let t3Model = mongoose.model("t3", t3Schema);
let t1 = new t3Model({first: "A", last: "b", time: new Date()});
console.log(t1.id);