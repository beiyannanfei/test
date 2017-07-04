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
// 注意上传界面中的 <input type="file" name="logo"/>中的name必须是下面代码中指定的名
app.post('/upload', upload.single('logo'), function (req, res, next) {
	console.log(req.file);
	var result;
	try {
		result = JSON.parse(JSON.stringify(xlsx.parse(req.file.buffer)));
	} catch (e) {
		console.log(e.message);
	}
	console.log(JSON.stringify(result));
	res.send({ret_code: '0'});
});

app.get('/form', function (req, res, next) {
	var form = fs.readFileSync('./form.html', {encoding: 'utf8'});
	res.send(form);
});

app.listen(3000, function () {
	console.log('Express server listening on port 3000');
});