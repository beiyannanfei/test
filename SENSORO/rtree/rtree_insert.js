/**
 * Created by wyq on 17/3/15.
 */
"use strict";
var RTree = require("rtree");
var data = require("./data.js");
var _ = require("underscore");


function r1() {   //add point
	var rt = new RTree();

	rt.insert({"x": 7, "y": 60, "w": 0, "h": 0}, "A");
	rt.insert({"x": 29, "y": 58, "w": 0, "h": 0}, "B");
	rt.insert({"x": 6, "y": 68, "w": 0, "h": 0}, "C");
	rt.insert({"x": 71., "y": 74., "w": 0, "h": 0}, "D");
	rt.insert({"x": 78, "y": 55, "w": 0, "h": 0}, "E");
	rt.insert({"x": 80, "y": 25, "w": 0, "h": 0}, "F");
	rt.insert({"x": 5, "y": 47, "w": 0, "h": 0}, "G");
	rt.insert({"x": 70, "y": 44, "w": 0, "h": 0}, "H");
	rt.insert({"x": 16, "y": 24, "w": 0, "h": 0}, "I");
	rt.insert({"x": 28, "y": 44, "w": 0, "h": 0}, "J");
	console.log(JSON.stringify(rt.root));

	var result1 = rt.search({
		x: 0,
		y: 0,
		w: 6,
		h: 70
	}, true);
	console.log("=======================");
	console.log(result1);

	var a = { //rtree=2
		"x": 5, "y": 24, "w": 75, "h": 50, "id": "root",
		"nodes": [
			{
				"x": 5, "y": 24, "w": 23, "h": 44,
				"nodes": [
					{
						"x": 6, "y": 24, "w": 10, "h": 44,
						"nodes": [
							{
								"x": 7, "y": 60, "w": 0, "h": 0,
								"nodes": [{"x": 7, "y": 60, "w": 0, "h": 0, "leaf": "A"}]
							},
							{
								"x": 6, "y": 24, "w": 10, "h": 44,
								"nodes": [
									{"x": 6, "y": 68, "w": 0, "h": 0, "leaf": "C"},
									{"x": 16, "y": 24, "w": 0, "h": 0, "leaf": "I"}
								]
							}
						]
					},
					{
						"x": 5, "y": 44, "w": 23, "h": 3,
						"nodes": [
							{
								"x": 5, "y": 44, "w": 23, "h": 3,
								"nodes": [
									{"x": 28, "y": 44, "w": 0, "h": 0, "leaf": "J"},
									{"x": 5, "y": 47, "w": 0, "h": 0, "leaf": "G"}
								]
							}
						]
					}
				]
			},
			{
				"x": 29, "y": 25, "w": 51, "h": 49,
				"nodes": [
					{
						"x": 70, "y": 25, "w": 10, "h": 19,
						"nodes": [
							{
								"x": 70, "y": 25, "w": 10, "h": 19,
								"nodes": [
									{"x": 80, "y": 25, "w": 0, "h": 0, "leaf": "F"},
									{"x": 70, "y": 44, "w": 0, "h": 0, "leaf": "H"}
								]
							}
						]
					},
					{
						"x": 29, "y": 55, "w": 49, "h": 19,
						"nodes": [
							{
								"x": 29, "y": 55, "w": 49, "h": 3,
								"nodes": [
									{"x": 29, "y": 58, "w": 0, "h": 0, "leaf": "B"},
									{"x": 78, "y": 55, "w": 0, "h": 0, "leaf": "E"}
								]
							},
							{
								"x": 71, "y": 74, "w": 0, "h": 0,
								"nodes": [
									{"x": 71, "y": 74, "w": 0, "h": 0, "leaf": "D"}
								]
							}
						]
					}
				]
			}
		]
	};

	a = { //rtree=3
		"x": 5, "y": 24, "w": 75, "h": 50, "id": "root",
		"nodes": [
			{
				"x": 5, "y": 24, "w": 75, "h": 44,
				"nodes": [
					{
						"x": 6, "y": 68, "w": 0, "h": 0,
						"nodes": [
							{"x": 6, "y": 68, "w": 0, "h": 0, "leaf": "C"}
						]
					},
					{
						"x": 29, "y": 25, "w": 51, "h": 33,
						"nodes": [
							{"x": 29, "y": 58, "w": 0, "h": 0, "leaf": "B"},
							{"x": 78, "y": 55, "w": 0, "h": 0, "leaf": "E"},
							{"x": 80, "y": 25, "w": 0, "h": 0, "leaf": "F"}
						]
					},
					{
						"x": 5, "y": 24, "w": 11, "h": 36,
						"nodes": [
							{"x": 16, "y": 24, "w": 0, "h": 0, "leaf": "I"},
							{"x": 5, "y": 47, "w": 0, "h": 0, "leaf": "G"},
							{"x": 7, "y": 60, "w": 0, "h": 0, "leaf": "A"}
						]
					}
				]
			},
			{
				"x": 28, "y": 44, "w": 43, "h": 30,
				"nodes": [
					{
						"x": 28, "y": 44, "w": 43, "h": 30,
						"nodes": [
							{"x": 71, "y": 74, "w": 0, "h": 0, "leaf": "D"},
							{"x": 70, "y": 44, "w": 0, "h": 0, "leaf": "H"},
							{"x": 28, "y": 44, "w": 0, "h": 0, "leaf": "J"}
						]
					}
				]
			}
		]
	};

	a = { //rtree=4
		"x": 5, "y": 24, "w": 75, "h": 50, "id": "root",
		"nodes": [
			{
				"x": 70, "y": 25, "w": 10, "h": 49,
				"nodes": [
					{"x": 71, "y": 74, "w": 0, "h": 0, "leaf": "D"},
					{"x": 78, "y": 55, "w": 0, "h": 0, "leaf": "E"},
					{"x": 80, "y": 25, "w": 0, "h": 0, "leaf": "F"},
					{"x": 70, "y": 44, "w": 0, "h": 0, "leaf": "H"}
				]
			},
			{
				"x": 7, "y": 24, "w": 22, "h": 36,
				"nodes": [
					{"x": 16, "y": 24, "w": 0, "h": 0, "leaf": "I"},
					{"x": 7, "y": 60, "w": 0, "h": 0, "leaf": "A"},
					{"x": 29, "y": 58, "w": 0, "h": 0, "leaf": "B"},
					{"x": 28, "y": 44, "w": 0, "h": 0, "leaf": "J"}
				]
			},
			{
				"x": 5, "y": 47, "w": 1, "h": 21,
				"nodes": [
					{"x": 6, "y": 68, "w": 0, "h": 0, "leaf": "C"},
					{"x": 5, "y": 47, "w": 0, "h": 0, "leaf": "G"}
				]
			}
		]
	};

	a = { //rtree=0
		"x": 5, "y": 24, "w": 75, "h": 50, "id": "root",
		"nodes": [
			{
				"x": 5, "y": 24, "w": 24, "h": 44,
				"nodes": [
					{"x": 5, "y": 47, "w": 0, "h": 0, "leaf": "G"},
					{"x": 7, "y": 60, "w": 0, "h": 0, "leaf": "A"},
					{"x": 29, "y": 58, "w": 0, "h": 0, "leaf": "B"},
					{"x": 6, "y": 68, "w": 0, "h": 0, "leaf": "C"},
					{"x": 16, "y": 24, "w": 0, "h": 0, "leaf": "I"},
					{"x": 28, "y": 44, "w": 0, "h": 0, "leaf": "J"}
				]
			},
			{
				"x": 70, "y": 25, "w": 10, "h": 49,
				"nodes": [
					{"x": 80, "y": 25, "w": 0, "h": 0, "leaf": "F"},
					{"x": 71, "y": 74, "w": 0, "h": 0, "leaf": "D"},
					{"x": 78, "y": 55, "w": 0, "h": 0, "leaf": "E"},
					{"x": 70, "y": 44, "w": 0, "h": 0, "leaf": "H"}
				]
			}
		]
	}
}

function r2() { //插入矩形
	console.time("AAAAA");
	var rList = [
		[{x: 0, y: 0, w: 10, h: 10}, "A"],
		[{x: 2, y: 1, w: 2, h: 2}, "A1"],
		[{x: 7, y: 1, w: 2, h: 3}, "A2"],
		[{x: 5, y: 5, w: 3, h: 3}, "A3"],
		[{x: 1, y: 5, w: 2, h: 4}, "A4"],
		[{x: 11, y: 11, w: 10, h: 11}, "B"],
		[{x: 12, y: 12, w: 3, h: 2}, "B1"],
		[{x: 13, y: 17, w: 3, h: 3}, "B2"],
		[{x: 17, y: 15, w: 4, h: 4}, "B3"],
		[{x: 18, y: 16, w: 2, h: 2}, "B4"],
	];
	var rt = new RTree(10);
	rList.forEach(item => {
		rt.insert(item[0], item[1]);
	});
	console.log(JSON.stringify(rt.root));
	var a = { //rtree 分组  node=auto
		"x": 0, "y": 0, "w": 21, "h": 22, "id": "root",
		"nodes": [
			{
				"x": 1, "y": 1, "w": 8, "h": 8,
				"nodes": [
					{"x": 2, "y": 1, "w": 2, "h": 2, "leaf": "A1"},
					{"x": 5, "y": 5, "w": 3, "h": 3, "leaf": "A3"},
					{"x": 7, "y": 1, "w": 2, "h": 3, "leaf": "A2"},
					{"x": 1, "y": 5, "w": 2, "h": 4, "leaf": "A4"}
				]
			},
			{
				"x": 0, "y": 0, "w": 21, "h": 22,
				"nodes": [
					{"x": 11, "y": 11, "w": 10, "h": 11, "leaf": "B"},
					{"x": 12, "y": 12, "w": 3, "h": 2, "leaf": "B1"},
					{"x": 0, "y": 0, "w": 10, "h": 10, "leaf": "A"},
					{"x": 13, "y": 17, "w": 3, "h": 3, "leaf": "B2"},
					{"x": 17, "y": 15, "w": 4, "h": 4, "leaf": "B3"},
					{"x": 18, "y": 16, "w": 2, "h": 2, "leaf": "B4"}
				]
			}
		]
	};
	a = { //node=10
		"x": 0, "y": 0, "w": 21, "h": 22, "id": "root",
		"nodes": [
			{"x": 0, "y": 0, "w": 10, "h": 10, "leaf": "A"},
			{"x": 2, "y": 1, "w": 2, "h": 2, "leaf": "A1"},
			{"x": 7, "y": 1, "w": 2, "h": 3, "leaf": "A2"},
			{"x": 5, "y": 5, "w": 3, "h": 3, "leaf": "A3"},
			{"x": 1, "y": 5, "w": 2, "h": 4, "leaf": "A4"},
			{"x": 11, "y": 11, "w": 10, "h": 11, "leaf": "B"},
			{"x": 12, "y": 12, "w": 3, "h": 2, "leaf": "B1"},
			{"x": 13, "y": 17, "w": 3, "h": 3, "leaf": "B2"},
			{"x": 17, "y": 15, "w": 4, "h": 4, "leaf": "B3"},
			{"x": 18, "y": 16, "w": 2, "h": 2, "leaf": "B4"}
		]
	};
	var r1 = rt.search({x: 14, y: 3, w: 0, h: 0}, true);
	console.log("area: %j, r1: %j", _.pluck(r1, "leaf"), r1);  // => []
	var r2 = rt.search({x: 5, y: 4, w: 0, h: 0}, true);
	console.log("area: %j, r2: %j", _.pluck(r2, "leaf"), r2);  // => [ { x: 0, y: 0, w: 10, h: 10, leaf: 'A' } ]
	var r3 = rt.search({x: 6, y: 7, w: 0, h: 0}, true);
	console.log("area: %j, r3: %j", _.pluck(r3, "leaf"), r3);  // => [ { x: 5, y: 5, w: 3, h: 3, leaf: 'A3' },	{ x: 0, y: 0, w: 10, h: 10, leaf: 'A' } ]
	var r4 = rt.search({x: 16, y: 12, w: 0, h: 0}, true);
	console.log("area: %j, r4: %j", _.pluck(r4, "leaf"), r4); // => [ { x: 11, y: 11, w: 10, h: 11, leaf: 'B' } ]
	var r5 = rt.search({x: 14, y: 18, w: 0, h: 0}, true);
	console.log("area: %j, r5: %j", _.pluck(r5, "leaf"), r5);  // =>[ { x: 13, y: 17, w: 3, h: 3, leaf: 'B2' },	{ x: 11, y: 11, w: 10, h: 11, leaf: 'B' } ]
	var r6 = rt.search({x: 20.5, y: 15, w: 0, h: 0}, true);
	console.log("area: %j, r6: %j", _.pluck(r6, "leaf"), r6);  // =>[ { x: 17, y: 15, w: 4, h: 4, leaf: 'B3' },	{ x: 11, y: 11, w: 10, h: 11, leaf: 'B' } ]
	var r7 = rt.search({x: 20, y: 17, w: 0, h: 0}, true); //点在B4的边上
	var rd = rt.remove({x: 17, y: 15, w: 4, h: 4}, "B3");  //删除一个点
	console.log("rd: %j", rd);
	console.log("area: %j, r7: %j", _.pluck(r7, "leaf"), r7);  // =>[ { x: 18, y: 16, w: 2, h: 2, leaf: 'B4' },	{ x: 17, y: 15, w: 4, h: 4, leaf: 'B3' },	{ x: 11, y: 11, w: 10, h: 11, leaf: 'B' } ]
	var r8 = rt.search({x: 19, y: 17, w: 0, h: 0}, true);
	console.log("area: %j, r8: %j", _.pluck(r8, "leaf"), r8);  // =>[ { x: 18, y: 16, w: 2, h: 2, leaf: 'B4' },	{ x: 17, y: 15, w: 4, h: 4, leaf: 'B3' },	{ x: 11, y: 11, w: 10, h: 11, leaf: 'B' } ]
	console.timeEnd("AAAAA");
}

function r3() {
	var rList = [
		[{x: 0, y: 0, w: 10, h: 10}, "A"],
		[{x: 2, y: 1, w: 2, h: 2}, "A1"],
		[{x: 7, y: 1, w: 2, h: 3}, "A2"],
		[{x: 5, y: 5, w: 3, h: 3}, "A3"],
		[{x: 1, y: 5, w: 2, h: 4}, "A4"],
		[{x: 11, y: 11, w: 10, h: 11}, "B"],
		[{x: 12, y: 12, w: 3, h: 2}, "B1"],
		[{x: 13, y: 17, w: 3, h: 3}, "B2"],
		[{x: 17, y: 15, w: 4, h: 4}, "B3"],
		[{x: 18, y: 16, w: 2, h: 2}, "B4"],
	];
	var rt = new RTree();
	rList.forEach(item => {
		rt.insert(item[0], item[1]);
	});

	var r1 = rt.getTree();
	console.log(r1);
}

function r4() {
	var gTree = new RTree();
	var geoJson = {
		"type": "FeatureCollection",
		"features": [
			{
				"type": "Feature",
				"geometry": {"type": "Point", "coordinates": [100, 1]},
				"properties": {"prop0": "value0"}
			},
			{
				"type": "Feature",
				"geometry": {"type": "LineString", "coordinates": [[100, 0], [101, 1]]},
				"properties": {"prop0": "value0"}
			},
			{
				"type": "Feature",
				"geometry": {"type": "Polygon", "coordinates": [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]]]},
				"properties": {"prop0": "value0"}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Polygon",
					"coordinates": [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
				},
				"properties": {"prop0": "value0"}
			},
			{
				"type": "Feature",
				"geometry": {"type": "MultiPoint", "coordinates": [[100, 0], [101, 1]]},
				"properties": {"prop0": "value0"}
			},
			{
				"type": "Feature",
				"geometry": {"type": "MultiLineString", "coordinates": [[[100, 0], [101, 1]], [[102, 2], [103, 3]]]},
				"properties": {"prop0": "value0"}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "MultiPolygon",
					"coordinates": [[[[102, 2], [103, 2], [103, 3], [102, 3], [102, 2]]], [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]]
				},
				"properties": {"prop0": "value0"}
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "GeometryCollection",
					"geometries": [{"type": "Point", "coordinates": [100, 0]}, {
						"type": "LineString",
						"coordinates": [[101, 0], [102, 1]]
					}, {
						"type": "Polygon",
						"coordinates": [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
					}, {"type": "MultiPoint", "coordinates": [[100, 0], [101, 1]]}, {
						"type": "MultiLineString",
						"coordinates": [[[100, 0], [101, 1]], [[102, 2], [103, 3]]]
					}, {
						"type": "MultiPolygon",
						"coordinates": [[[[102, 2], [103, 2], [103, 3], [102, 3], [102, 2]]], [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]]
					}, {
						"type": "GeometryCollection",
						"geometries": [{"type": "Point", "coordinates": [100, 1]}, {
							"type": "LineString",
							"coordinates": [[102, 0], [103, 1]]
						}]
					}]
				},
				"properties": {"prop0": "value0"}
			}
		]
	};
	gTree.geoJSON(geoJson);
	// console.log(JSON.stringify(gTree.getTree()));
	var a = {
		"x": 100, "y": 0, "w": 3, "h": 3, "id": "root",
		"nodes": [
			{
				"x": 100, "y": 0, "w": 1, "h": 1,
				"nodes": [
					{
						"x": 100, "y": 0, "w": 1, "h": 1,
						"leaf": {
							"type": "Feature",
							"geometry": {
								"type": "MultiPoint",
								"coordinates": [
									[100, 0], [101, 1]
								]
							},
							"properties": {
								"prop0": "value0"
							}
						}
					},
					{
						"x": 100, "y": 0, "w": 1, "h": 1,
						"leaf": {
							"type": "Feature",
							"geometry": {"type": "LineString", "coordinates": [[100, 0], [101, 1]]},
							"properties": {"prop0": "value0"}
						}
					}, {
						"x": 100,
						"y": 0,
						"w": 1,
						"h": 1,
						"leaf": {
							"type": "Feature",
							"geometry": {"type": "Polygon", "coordinates": [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]]]},
							"properties": {"prop0": "value0"}
						}
					}, {
						"x": 100,
						"y": 0,
						"w": 1,
						"h": 1,
						"leaf": {
							"type": "Feature",
							"geometry": {
								"type": "Polygon",
								"coordinates": [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
							},
							"properties": {"prop0": "value0"}
						}
					}]
			}, {
				"x": 100,
				"y": 0,
				"w": 3,
				"h": 3,
				"nodes": [{
					"x": 100,
					"y": 1,
					"w": 0,
					"h": 0,
					"leaf": {
						"type": "Feature",
						"geometry": {"type": "Point", "coordinates": [100, 1]},
						"properties": {"prop0": "value0"}
					}
				}, {
					"x": 100,
					"y": 0,
					"w": 3,
					"h": 3,
					"leaf": {
						"type": "Feature",
						"geometry": {"type": "MultiLineString", "coordinates": [[[100, 0], [101, 1]], [[102, 2], [103, 3]]]},
						"properties": {"prop0": "value0"}
					}
				}, {
					"x": 100,
					"y": 0,
					"w": 3,
					"h": 3,
					"leaf": {
						"type": "Feature",
						"geometry": {
							"type": "MultiPolygon",
							"coordinates": [[[[102, 2], [103, 2], [103, 3], [102, 3], [102, 2]]], [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]]
						},
						"properties": {"prop0": "value0"}
					}
				}, {
					"leaf": {
						"type": "Feature",
						"geometry": {
							"type": "GeometryCollection",
							"geometries": [{"type": "Point", "coordinates": [100, 0]}, {
								"type": "LineString",
								"coordinates": [[101, 0], [102, 1]]
							}, {
								"type": "Polygon",
								"coordinates": [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
							}, {"type": "MultiPoint", "coordinates": [[100, 0], [101, 1]]}, {
								"type": "MultiLineString",
								"coordinates": [[[100, 0], [101, 1]], [[102, 2], [103, 3]]]
							}, {
								"type": "MultiPolygon",
								"coordinates": [[[[102, 2], [103, 2], [103, 3], [102, 3], [102, 2]]], [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]]
							}, {
								"type": "GeometryCollection",
								"geometries": [{"type": "Point", "coordinates": [100, 1]}, {
									"type": "LineString",
									"coordinates": [[102, 0], [103, 1]]
								}]
							}]
						},
						"properties": {"prop0": "value0"}
					}, "x": 100, "y": 0, "h": 1, "w": 3
				}]
			}]
	};
	var result = gTree.bbox([0, 0], [500, 500]);
	console.log(JSON.stringify(result));
	a = [
		{
			"type": "Feature",
			"geometry": {
				"type": "Polygon",
				"coordinates": [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
			},
			"properties": {"prop0": "value0"}
		}, {
			"type": "Feature",
			"geometry": {"type": "Polygon", "coordinates": [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]]]},
			"properties": {"prop0": "value0"}
		}, {
			"type": "Feature",
			"geometry": {"type": "LineString", "coordinates": [[100, 0], [101, 1]]},
			"properties": {"prop0": "value0"}
		}, {
			"type": "Feature",
			"geometry": {"type": "MultiPoint", "coordinates": [[100, 0], [101, 1]]},
			"properties": {"prop0": "value0"}
		}, {
			"type": "Feature",
			"geometry": {
				"type": "GeometryCollection",
				"geometries": [{"type": "Point", "coordinates": [100, 0]}, {
					"type": "LineString",
					"coordinates": [[101, 0], [102, 1]]
				}, {
					"type": "Polygon",
					"coordinates": [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]
				}, {"type": "MultiPoint", "coordinates": [[100, 0], [101, 1]]}, {
					"type": "MultiLineString",
					"coordinates": [[[100, 0], [101, 1]], [[102, 2], [103, 3]]]
				}, {
					"type": "MultiPolygon",
					"coordinates": [[[[102, 2], [103, 2], [103, 3], [102, 3], [102, 2]]], [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]]
				}, {
					"type": "GeometryCollection",
					"geometries": [{"type": "Point", "coordinates": [100, 1]}, {
						"type": "LineString",
						"coordinates": [[102, 0], [103, 1]]
					}]
				}]
			},
			"properties": {"prop0": "value0"}
		}, {
			"type": "Feature",
			"geometry": {
				"type": "MultiPolygon",
				"coordinates": [[[[102, 2], [103, 2], [103, 3], [102, 3], [102, 2]]], [[[100, 0], [101, 0], [101, 1], [100, 1], [100, 0]], [[100.2, 0.2], [100.8, 0.2], [100.8, 0.8], [100.2, 0.8], [100.2, 0.2]]]]
			},
			"properties": {"prop0": "value0"}
		}, {
			"type": "Feature",
			"geometry": {"type": "MultiLineString", "coordinates": [[[100, 0], [101, 1]], [[102, 2], [103, 3]]]},
			"properties": {"prop0": "value0"}
		}, {"type": "Feature", "geometry": {"type": "Point", "coordinates": [100, 1]}, "properties": {"prop0": "value0"}}];
}

function r5() {
	var rList = [
		[{x: 0, y: 0, w: 10, h: 10}, "A"],
		[{x: 2, y: 1, w: 2, h: 2}, "A1"],
		[{x: 7, y: 1, w: 2, h: 3}, "A2"],
		[{x: 5, y: 5, w: 3, h: 3}, "A3"],
		[{x: 1, y: 5, w: 2, h: 4}, "A4"],
		[{x: 11, y: 11, w: 10, h: 11}, "B"],
		[{x: 12, y: 12, w: 3, h: 2}, "B1"],
		[{x: 13, y: 17, w: 3, h: 3}, "B2"],
		[{x: 17, y: 15, w: 4, h: 4}, "B3"],
		[{x: 18, y: 16, w: 2, h: 2}, "B4"],
	];
	var rt = new RTree(10);
	rList.forEach(item => {
		rt.insert(item[0], item[1]);
	});
	var fromJson = rt.toJSON();
	console.log(fromJson);
	var a = {
		"x": 0, "y": 0, "w": 21, "h": 22, "id": "root",
		"nodes": [
			{"x": 0, "y": 0, "w": 10, "h": 10, "leaf": "A"},
			{"x": 2, "y": 1, "w": 2, "h": 2, "leaf": "A1"},
			{"x": 7, "y": 1, "w": 2, "h": 3, "leaf": "A2"},
			{"x": 5, "y": 5, "w": 3, "h": 3, "leaf": "A3"},
			{"x": 1, "y": 5, "w": 2, "h": 4, "leaf": "A4"},
			{"x": 11, "y": 11, "w": 10, "h": 11, "leaf": "B"},
			{"x": 12, "y": 12, "w": 3, "h": 2, "leaf": "B1"},
			{"x": 13, "y": 17, "w": 3, "h": 3, "leaf": "B2"},
			{"x": 17, "y": 15, "w": 4, "h": 4, "leaf": "B3"},
			{"x": 18, "y": 16, "w": 2, "h": 2, "leaf": "B4"}
		]
	};
}

function r6() {
	var geoJson = {
		"type": "FeatureCollection",
		"features": [
			{
				"type": "Feature",
				"geometry": {"type": "Polygon", "coordinates": [[[9, 7], [9, 11], [19, 11], [19, 7], [9, 7]]]},
				"properties": "A"
			},
			{
				"type": "Feature",
				"geometry": {
					"type": "Polygon",
					"coordinates": [[[9, 9], [12, 11], [14, 15], [16, 11], [19, 9], [16, 7], [14, 3], [12, 7], [9, 9]]]
				},
				"properties": "B"
			}
		]
	};
	var gTree = new RTree();
	gTree.geoJSON(geoJson);
	var r1 = gTree.search({x: 2, y: 2, w: 0, h: 0}, true);
	console.log(JSON.stringify(r1));  //=> []
	var r2 = gTree.search({x: 14, y: 5, w: 0, h: 0}, true);
	console.log(JSON.stringify(r2));  //=> [{"x":9,"y":3,"w":10,"h":12,"leaf":{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[9,9],[12,11],[14,15],[16,11],[19,9],[16,7],[14,3],[12,7],[9,9]]]},"properties":"B"}}]
	var r3 = gTree.search({x: 10, y: 10.9, w: 0, h: 0}, true);
	console.log(JSON.stringify(r3));  // => [{"x":9,"y":3,"w":10,"h":12,"leaf":{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[9,9],[12,11],[14,15],[16,11],[19,9],[16,7],[14,3],[12,7],[9,9]]]},"properties":"B"}},{"x":9,"y":7,"w":10,"h":4,"leaf":{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[9,7],[9,11],[19,11],[19,7],[9,7]]]},"properties":"A"}}]
	var r4 = gTree.search({x: 10, y: 5, w: 0, h: 0}, true);
	console.log(JSON.stringify(r4));  // => [{"x":9,"y":3,"w":10,"h":12,"leaf":{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[9,9],[12,11],[14,15],[16,11],[19,9],[16,7],[14,3],[12,7],[9,9]]]},"properties":"B"}}]


}

r6();



