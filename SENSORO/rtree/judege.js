/**
 * Created by wyq on 17/3/16.
 * 判断一个点是不是在一个多边形内
 */
"use strict";
const _ = require("underscore");

var pointList = [   //多边形顶点坐标
	{x: 2, y: 6},
	{x: 4, y: 7},
	{x: 5, y: 9},
	{x: 6, y: 7},
	{x: 8, y: 7},
	{x: 6, y: 6},
	{x: 6, y: 4},
	{x: 5, y: 6},
	{x: 4, y: 4}
];

/**
 * 获取包围多边形矩形的两个顶点
 * @param list  点列表
 * @returns {{maxX: *, maxY: *, minX: *, minY: *}}
 */
function getRectPoint(list) {
	var point = {
		maxX: list[0].x,
		maxY: list[0].y,
		minX: list[0].x,
		minY: list[0].y
	};
	list.forEach(item => {
		if (point.maxX < item.x) {
			point.maxX = item.x
		}
		if (point.maxY < item.y) {
			point.maxY = item.y
		}
		if (point.minX > item.x) {
			point.minX = item.x;
		}
		if (point.minY > item.y) {
			point.minY = item.y;
		}
	});
	return point;
}

/**
 * 判断点是否在矩形中
 * @param point  点
 * @param rect   矩形顶点
 * @returns {boolean}
 */
function isInRect(point, rect) {
	if (point.x < rect.minX || point.x > rect.maxX || point.y < rect.minY || point.y > rect.maxY) {
		return false;
	}
	return true;
}

/**
 * 判断点是否在多边形
 * @param point   测试点
 * @param pList   多边形顶点坐标
 * @returns {number}
 */
function isInPolygon(point, pList) {
	let vertx = _.pluck(pList, "x");
	let verty = _.pluck(pList, "y");
	let nvert = vertx.length;
	let testx = point.x;
	let testy = point.y;
	let i, j, c = false;
	for (i = 0, j = nvert - 1; i < nvert; j = i++) {
		if (( (verty[i] > testy) != (verty[j] > testy) ) && (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i]))
			c = !c;
	}
	return c;
}

/**
 * 测试边数较多的情况
 * @param count 边数
 */
function testTooManyEdge(count, isInt) {
	//整数测试
	var i = function () {
		let pointList = [];       //全部为整数
		console.time("makePoint Time");
		for (let i = 0; i < count; ++i) {
			let x = ~~(Math.random() * 10000000);
			let y = ~~(Math.random() * 10101010);
			pointList.push({x: x, y: y});
		}
		console.timeEnd("makePoint Time");
		console.log("length: %j", pointList.length);
		var point = {x: ~~(Math.random() * 10000000), y: ~~(Math.random() * 10101010)};
		console.time("test point is in Time");
		var isIn = isInPolygon(point, pointList);
		console.timeEnd("test point is in Time");
		console.log(isIn);
	};
	//浮点数测试
	var f = function () {
		let pointList = [];
		console.time("makePoint Time");
		for (let i = 0; i < count; ++i) {
			let x = Math.random();
			let y = Math.random() * 1.01010101;
			pointList.push({x: x, y: y});
		}
		console.timeEnd("makePoint Time");
		console.log("length: %j", pointList.length);
		var point = {x: Math.random(), y: Math.random()};
		console.time("test point is in Time");
		var isIn = isInPolygon(point, pointList);
		console.timeEnd("test point is in Time");
		console.log(isIn);
	};

	if (isInt) {
		return i();
	}
	return f();
	/**
	 * 结论:
	 * 边数       整数耗时(ms)        浮点数耗时(ms)
	 * 10           ≈0.4                ≈0.7
	 * 100          ≈0.5                ≈0.8
	 * 1000         <0.6                ≈1.1
	 * 10000        ≈3                  <5
	 * 100000       <10                 <25
	 * 1000000      ≈60                 ≈180
	 * 10000000     ≈600                <1300
	 * 20000000     <1200               内存溢出(边界19838942)
	 * 21000000     ≈1600               内存溢出
	 * 22000000     ≈1700               内存溢出
	 * 23000000     内存溢出             内存溢出
	 */
}

testTooManyEdge(19838942, 0);

