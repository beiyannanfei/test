var xlsx = require("node-xlsx");
var fs = require("fs");

try {
	var buffer = fs.readFileSync("/Users/wyq/Downloads/authLog/a.xlsx");
	// var buffer = fs.readFileSync("./excel1.xlsx");
} catch (e) {
	console.log("e: %s", e.message);
}

console.log(buffer);
console.log(typeof buffer);
var result;
try {
	result = JSON.parse(JSON.stringify(xlsx.parse(buffer)));
} catch (e) {
	console.log(e.message);
}
console.log(JSON.stringify(result));

var list = [];
console.log(result[0].data.length);
result[0].data.forEach(item => {
	if (item.length !== 3) {
		console.log("data error item: %j", item);
		return;
	}
	list.push({t: `${item[0]} ${item[1]}`, count: +item[2]});
});

console.log("let list = %j", list);
/*console.log("===========================");
 var buffer1 = fs.readFileSync("./excel2.xls");
 console.log(buffer1);
 var result1 = JSON.parse(JSON.stringify(xlsx.parse(buffer1)));
 console.log(JSON.stringify(result1));*/

/*
 var request = require('superagent');

 request.post("127.0.0.1:5000/qrcode/add/file")
 .type('multipart/form-data')
 .field('a', JSON.stringify([10, 20, 30]))
 .attach("file", "./excel1.xlsx")
 .end(function (err, xhr) {
 console.log(xhr.body);
 });*/



