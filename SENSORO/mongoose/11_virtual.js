/**
 * Created by wyq on 16/12/7.
 * 定义虚拟属性
 */
"use strict";
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
var Schema = mongoose.Schema;

var t7Schema = new Schema({
	name: {
		first: String,
		last: String
	}
}, {versionKey: false});

var t7Model = mongoose.model('t7', t7Schema);
var krouky = new t7Model({
	name: {first: 'krouky', last: 'han'}
});

t7Schema.virtual('name.full').get(function () {
	return this.name.first + ' ' + this.name.last;
});

console.log(krouky.name.full);




