/**
 * Created by wyq on 2016/5/13.
 */

var express = require('express');
var app = express();
var config = require("./config.js");
var log4js = require('log4js');
log4js.configure(config.log4jsconfig, {});
var logger = log4js.getLogger(__filename);
var birds = require('./birds.js');
var util = require("util");
var bodyParser = require('body-parser');
var morgan = require("morgan");


process.on('uncaughtException', function (err) {
	logger.error('[Inside \'uncaughtException\' event]' + err.stack || err.message);
});

morgan.token("date", function () {
	return new Date();
});
app.use(morgan('[:date] - :method :url :status :response-time ms - :res[content-length]'));   //todo POST /test 200 76.091 ms - 14

app.set("env", config.NODE_ENV);

app.use('/birds', birds);

app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.get("/test", function (req, res) {
	// console.log(req.body);
	res.status(200);
	return res.send("test post body");
});

logger.info("run environment: %j", app.get('env'));

app.set('port', config.port);
//exports.server = require('http').createServer(app);
app.listen(app.get('port'), function () {
	logger.fatal('Express server listening on port %d, redis: %j', app.get('port'), util.format("%s:%s", config.redis.host, config.redis.port));
});


app.get("/download", function (req, res) {
	let fileName = "../W3CSchool.chm";
	let path = require("path");
	let filePath = path.join(__dirname, fileName);
	let fs = require("fs");
	let stats = fs.statSync(filePath);
	if (stats.isFile()) {
		res.set({
			'Content-Type': 'application/octet-stream',
			'Content-Disposition': 'attachment; filename=w3c.chm',
			'Content-Length': stats.size
		});
		return fs.createReadStream(filePath).pipe(res);
	}
	else {
		return res.end(404);
	}
});
