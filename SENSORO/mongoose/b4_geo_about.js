/**
 * Created by wyq on 17/6/1.
 * 地理围栏相关测试,图见同名文件图片(参考文档:http://www.infoq.com/cn/articles/depth-study-of-Symfony2/)
 */
"use strict";
const mongoose = require('mongoose');
const Bluebird = require("bluebird");
mongoose.Promise = Bluebird;
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

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
 * 查询当前坐标center附近的目标，由近到远排列(距离单位为弧度),球面距离
 */
function t1() {
	t1Model.find({lonlat: {$nearSphere: center}}).limit(3).exec().then(val => {
		console.log(val);
	}).catch(err => {
		console.log("t1 err: %j", err.message || err);
	});
}

/**
 * 指定最大距离,这里用near，默认以度为单位，公里数除以111(注意: $near不能使用2dsphere类型索引),平面距离
 */
function t2() {
	t1Model.find({lonlat2: {$near: center, $maxDistance: 2}}).then(val => {
		console.log(_.pluck(val, "name"));
	}).catch(err => {
		console.log("t2 err: %j", err.message || err);
	});
}

/**
 * $box 矩形区域内搜索(查询结果为乱序的)
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

/**
 * 2d索引能同时支持$center和$centerSphere，2dsphere索引支持$centerSphere。
 * 关于距离单位，$center默认是度，$centerSphere默认距离是弧度。
 * 圆形区域 查询以某坐标为圆心，指定半径的圆内的数据
 */
function t4() {
	let radius = 280 / 6371;  //通过距离计算弧度半径
	t1Model.find({
		lonlat: {
			$geoWithin: {
				$centerSphere: [center, radius]
			}
		}
	}).then(val => {
		console.log(_.pluck(val, "name"));
	}).catch(err => {
		console.log("t4 err: %j", err.message || err);
	});
}

/**
 * 多边形
 */
function t5() {
	let point1 = center;
	let point2 = doc.find(item => item.name === "c1").lonlat;
	let point3 = doc.find(item => item.name === "a2").lonlat;
	t1Model.find({
		lonlat: {
			$geoWithin: {
				$polygon: [
					point1,
					point2,
					point3
				]
			}
		}
	}).then(val => {
		console.log(_.pluck(val, "name"));
	}).catch(err => {
		console.log("t5 err: %j", err.message || err);
	});
}

/**
 * GeoJson $maxDistance距离单位默认为米
 */
function t6() {
	t1Model.find({
		lonlat: {
			$nearSphere: {
				$geometry: {
					type: "Point",
					coordinates: center
				},
				$minDistance: 140604,        //distance in meters
				$maxDistance: 350000
			}
		}
	}).then(val => {
		console.log(_.pluck(val, "name"));
	}).catch(err => {
		console.log("t6 err: %j", err.message || err);
	});
}

/**
 * 查找距离中心141km的点, spherical为true， dis的值为弧度，不指定则为度
 */
function t7() {
	t1Model.geoNear(center, {maxDistance: 141 / 6371, spherical: true}, function (err, results, stats) {
		if (!!err) {
			return console.log("t7 err: %j", err.message || err);
		}
		console.log(results);
		/**
		 * { dis: 0.013563687613269046,   //与center的距离,单位为弧度,转换为米方法: dis * 6371 * 1000
         obj:
         { _id: 592fcba368c554fe139e9109,
          __v: 0,
          lonlat2: [ 117, 39 ],
          lonlat: [ 117, 39 ],
          name: 'a0'
         }
      }
		 */
		console.log(stats);
		/**
		 { nscanned: 23,
			 objectsLoaded: 8,
			 avgDistance: 0.017687252042861673,   //平均距离
			 maxDistance: 0.022044775995372724,   //最大距离
			 time: 1
		 }
		 */
	});
}







