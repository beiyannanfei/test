/**
 * Created by wyq on 17/6/1.
 * 地理围栏相关测试
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
const Bluebird = require("bluebird");

let t1Schema = new Schema({
	name: {type: String},
	lonlat: {type: [Number], index: '2dsphere'},
	lonlat2: {type: [Number], index: '2d'}
});
let t1Model = mongoose.model("geo_test", t1Schema);
let center = {lon: 116, lat: 39};

let doc = [
	{
		name: "a0",
		lonlat: [117, 39],
		lonlat2: [117, 39]
	},
	{
		name: "a1",
		lonlat: [118, 39],
		lonlat2: [118, 39]
	},
	{
		name: "a2",
		lonlat: [119, 39],
		lonlat2: [119, 39]
	},
	{
		name: "a3",
		lonlat: [120, 39],
		lonlat2: [120, 39]
	},
	{
		name: "b0",
		lonlat: [117, 40],
		lonlat2: [117, 40]
	},
	{
		name: "b1",
		lonlat: [118, 41],
		lonlat2: [118, 41]
	},
	{
		name: "b2",
		lonlat: [119, 42],
		lonlat2: [119, 42]
	},
	{
		name: "b3",
		lonlat: [120, 43],
		lonlat2: [120, 43]
	},
	{
		name: "c0",
		lonlat: [116, 40],
		lonlat2: [116, 40]
	},
	{
		name: "c1",
		lonlat: [116, 41],
		lonlat2: [116, 41]
	},
	{
		name: "c2",
		lonlat: [116, 42],
		lonlat2: [116, 42]
	},
	{
		name: "c3",
		lonlat: [116, 43],
		lonlat2: [116, 43]
	}
];

function save2db() {    //首先将数据保存到数据库
	t1Model.create(doc).then(val => {
		console.log("save data success");
	}).catch(err => {
		console.log("save data err");
	});
}





