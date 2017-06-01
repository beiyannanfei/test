/**
 * Created by wyq on 17/6/1.
 * 地理围栏相关测试,图见同名文件图片
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;
const Bluebird = require("bluebird");
const _ = require("underscore");

let t1Schema = new Schema({
	name: {type: String},
	lonlat: {type: [Number], index: '2dsphere'},
	lonlat2: {type: [Number], index: '2d'}
});
let t1Model = mongoose.model("geo_test", t1Schema);

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
let center = [116, 39];

/**
 * 首先将数据保存到数据库
 */
function save2db() {
	t1Model.create(doc).then(val => {
		console.log("save data success");
	}).catch(err => {
		console.log("save data err");
	});
}

/**
 * 查询当前坐标center附近的目标，由近到远排列
 */
function t1() {
	t1Model.find({lonlat: {$nearSphere: center}}).limit(3).exec().then(val => {
		console.log(val);
	}).catch(err => {
		console.log("t1 err: %j", err.message || err);
	});
}

/**
 * 指定最大距离,这里用near，默认以度为单位，公里数除以111(注意: $near不能使用2dsphere类型索引)
 */
function t2() {
	t1Model.find({lonlat2: {$near: center, $maxDistance: 2}}).then(val => {
		console.log(_.pluck(val, "name"));
	}).catch(err => {
		console.log("t2 err: %j", err.message || err);
	});
}

/**
 * $box 矩形区域内搜索(查询结果为按照距离进行排序)
 */
function t3() {
	let maxLonlat = doc.find(item => item.name === "b1");
	t1Model.find({
		lonlat2: {
			$geoWithin: {
				$box: [
					center,
					maxLonlat.lonlat
				]
			}
		}
	}).then(val => {
		console.log(_.pluck(val, "name"));
	}).catch(err => {
		console.log("t3 err: %j", err.message || err);
	});
}
t3();





