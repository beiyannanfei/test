/**
 * Created by wyq on 17/1/4.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t13Schema = new Schema({
	name: {type: String},
	list: {type: Array}
});

let t13Model = mongoose.model("t13", t13Schema);

function create() {
	//{ ok: 1,	nModified: 0,	n: 1,	upserted: [ { index: 0, _id: 586c63c9588512fdfc0589d4 } ] } 没有数据执行插入
	// { ok: 1, nModified: 0, n: 1 }    //数组中存在插入的元素 nModified为0
	// { ok: 1, nModified: 1, n: 1 }    //数组插入成功nModified为1
	t13Model.update({name: "AAA"}, {$addToSet: {list: "B"}}, {upsert: true}, function (err, response) {
		console.log(response);
	});
}

// create();

function pull() {
	// { ok: 1, nModified: 1, n: 1 }    有数据
	// { ok: 1, nModified: 0, n: 1 }    没有数据
	t13Model.update({name: "AAA"}, {$pull: {list: "A"}}, function (err, response) {
		console.log(response);
	});
}

pull();