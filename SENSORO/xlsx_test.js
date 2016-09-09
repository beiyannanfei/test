/**
 * Created by wyq on 16/9/9.
 * excel文档导出练习
 */
var express = require('express');
var app = express();
var morgan = require("morgan");
var XLSX = require('xlsx');

process.on('uncaughtException', function (err) {
	logger.error('[Inside \'uncaughtException\' event]' + err.stack || err.message);
});

morgan.token("date", function () {
	return new Date();
});
app.use(morgan('[:date] - :method :url :status :response-time ms - :res[content-length]'));   //todo POST /test 200 76.091 ms - 14

app.get("/test", (req, res) => {
	var _headers = ['id', 'name', 'age', 'country', 'remark'];
	var _data = [
		{
			id: '1',
			name: 'test1',
			age: '30',
			country: 'China',
			remark: 'hello'
		},
		{
			id: '2',
			name: 'test2',
			age: '20',
			country: 'America',
			remark: 'world'
		},
		{
			id: '3',
			name: 'test3',
			age: '18',
			country: 'Unkonw',
			remark: '???'
		}
	];
	var headers = _headers.map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65 + i) + 1}))
		.reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
	var data = _data.map((v, i) => _headers.map((k, j) => Object.assign({}, {
		v: v[k], position: String.fromCharCode(65 + j) + (i + 2)
	})))
		.reduce((prev, next) => prev.concat(next)).reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
// 合并 headers 和 data
	var output = Object.assign({}, headers, data);
// 获取所有单元格的位置
	var outputPos = Object.keys(output);
// 计算出范围
	var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
// 构建 workbook 对象
	var wb = {
		SheetNames: ['mySheet'],
		Sheets: {
			'mySheet': Object.assign({}, output, {'!ref': ref})
		}
	};
// 导出 Excel
	XLSX.writeFile(wb, 'output.xlsx', {type: 'buffer'});
	res.end("AAAAAA");
});

app.listen(9001, function () {
	console.log('Express server listening on port 9001');
});