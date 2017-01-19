"use strict";
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
var Schema = mongoose.Schema;

var t7Schema = new Schema({
	name: {
		first: String,
		last: String
	},
	addr: {
		province: String,
		city: String,
		county: String
	}
});

var t7Model = mongoose.model('t7', t7Schema);
var krouky = new t7Model({
	name: {first: 'krouky', last: 'han'},
	addr: {province: "河北省", city: "廊坊市", county: "固安县"}
});

t7Schema.virtual('name.full').get(function () {   //该方法只能定义在对象下,不可以直接定义
	return this.name.first + ' ' + this.name.last;
});

t7Schema.virtual('addr.complete').get(function () {   //也可以定义为 name.complete (只要存在就可以)
	return this.addr.province + ' ' + this.addr.city + ' ' + this.addr.county;
});

console.log(krouky.name.full);
console.log(krouky.addr.complete);