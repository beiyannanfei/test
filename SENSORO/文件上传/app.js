/**
 * Created by wyq on 17/7/3.
 */
var fs = require('fs');
var express = require('express');
var multer = require('multer');
const morgan = require("morgan");
var xlsx = require("node-xlsx");

var app = express();
var upload = multer(/*{dest: 'upload/'}*/);   //注释掉,则文件流保存在req.file.buffer字段

morgan.token("date", function () {
	return new Date();
});
app.use(morgan('[:date] - :method :url :status :response-time ms - :res[content-length]'));   //todo POST /test 200 76.091 ms - 14

// 单图上传
app.post('/upload', upload.single('logo'), function (req, res, next) {
	console.log(req.file);
	let result = JSON.parse(JSON.stringify(xlsx.parse(buffer)));
	res.send({ret_code: '0'});
});

app.get('/form', function (req, res, next) {
	var form = fs.readFileSync('./form.html', {encoding: 'utf8'});
	res.send(form);
});

app.listen(3000, function () {
	console.log('Express server listening on port 3000');
});