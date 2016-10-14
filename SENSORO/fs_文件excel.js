var fs = require('fs');
var xlsx = require("node-xlsx");

var sheets = [];
var nameMap1 = {name: "AAAAA", data: []};
nameMap1.data.push(['交易日期', '门店', 'openId', '交易金额', '交易状态']);
nameMap1.data.push(['2016-09-08', '门店1', 'a1', 10.12, '成功']);
nameMap1.data.push(['2016-09-09', '门店2', 'a2', 123.123, '失败']);

var nameMap2 = {name: "BBBBB", data: []};
nameMap2.data.push(['交易日期', '门店', 'openId', '交易金额', '交易状态']);
nameMap2.data.push(['1999-09-08', '门店3', 'a3', 10.12, '成功']);
nameMap2.data.push(['1999-09-09', '门店4', 'a4', 123.123, '支付中']);

sheets.push(nameMap1);
sheets.push(nameMap2);


var buffer = xlsx.build(sheets, {});
var fileName = __dirname + "/ZZZZZZ.xls";
fs.writeFile(fileName, buffer, {encoding: 'utf8', mode: 438, flag: 'a+'}, function (err, results) {
	console.log(arguments);
});

setTimeout(function () {
	fs.unlink(fileName, function (err) {
		console.log("err: %j", err)
	});
}, 10000);

