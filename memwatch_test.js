/**
 * Created by wyq on 2016/3/31.
 */
var memwatch = require('memwatch');     //memwatch库只能在node 0.10.x 情况下安装成功

/*memwatch.on('leak', function (info) {
 console.log('leak:');
 console.log(info);
 });
 memwatch.on('stats', function (stats) {
 console.log('stats:')
 console.log(stats);
 });*/

var stringArray = [];
var numberArray = [];

var leak = function () {
	stringArray.push("leak" + Math.random());
	numberArray.push(Math.random());
};
// Take first snapshot
var hd = new memwatch.HeapDiff();
for (var i = 0; i < 10000; i++) {
	leak();
}
// Take the second snapshot and compute the diff
var diff = hd.end();
console.log(JSON.stringify(diff, null, 2));


/*
{
	"before": {
	"nodes": 11510,
		"time": "2016-03-31T02:44:46.000Z",
		"size_bytes": 1475376,
		"size": "1.41 mb"
},
	"after": {
	"nodes": 41410,
		"time": "2016-03-31T02:44:46.000Z",
		"size_bytes": 2907936,
		"size": "2.77 mb"
},
	"change": {
	"size_bytes": 1432560,
		"size": "1.37 mb",
		"freed_nodes": 127,             //释放节点数量
		"allocated_nodes": 30027,       //分配节点数量
		"details": [
		{
			"what": "Array",        //类型
			"size_bytes": 410384,
			"size": "400.77 kb",
			"+": 16,        //分配what类型对象的数量
			"-": 63         //释放what类型对象的数量
		},
		{
			"what": "Code",
			"size_bytes": -10432,
			"size": "-10.19 kb",
			"+": 8,
			"-": 28
		},
		{
			"what": "Number",
			"size_bytes": 160000,
			"size": "156.25 kb",
			"+": 10000,
			"-": 0
		},
		{
			"what": "String",
			"size_bytes": 879368,
			"size": "858.76 kb",
			"+": 19999,
			"-": 1
		}
	]
}
}
*/