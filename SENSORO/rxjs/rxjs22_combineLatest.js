"use strict";
var Rx = require("rx");
console.log("[%j] begin", new Date().toTimeString());
var colors = ["紫色", "黄色", "蓝色", "黑色"];
var shapes = ["小星星", "圆形", "三角形", "正方形", "心形", "五边形"];

var source1 = Rx.Observable.interval(3000).map(()=>colors.pop());
var source2 = Rx.Observable.interval(2000).map(()=>shapes.pop());

var combined = Rx.Observable.combineLatest(source1, source2, (x, y) => {
	console.log("[%j] ===== x: %j, y: %j", new Date().toTimeString(), x, y);
	return x + "的" + y;
}).take(8);

combined.subscribe(shaped => {
	console.log(shaped);
});

/*var colors = ["紫色", "黄色", "蓝色", "黑色"];
 var shapes = ["小星星", "圆形", "三角形", "正方形", "心形", "五边形"];
 var source1 = Rx.Observable.interval(3000)
 .map(()=>colors.pop());
 var source2 = Rx.Observable.interval(2000)
 .map(()=>shapes.pop());

 var combined = Rx.Observable.combineLatest(source1, source2, function (x, y) {
 return x + "的" + y;
 }).take(8);

 combined.subscribe((shaped)=>console.log(shaped));*/
