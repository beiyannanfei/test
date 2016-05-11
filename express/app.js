var express = require('express');
var app = express();
var config = require("./config.js");
var appAdmin = require("./admin/adminApi.js");
var appOpen = require("./open/openApi.js");
var middleware = require("./globle/middleware.js");
var util = require("util");
var log4js = require('log4js');
log4js.configure(config.log4jsconfig, {});
var logger = log4js.getLogger(__filename);

process.on('uncaughtException', function (err) {
	logger.error('[Inside \'uncaughtException\' event]' + err.stack || err.message);
});

var logToken = '[:date] - :method :url :status :res[content-length] - :response-time ms';
express.logger.token('date', function () {
	return new Date().toLocaleString();
});

app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});

app.use(express.logger(logToken));
app.use(express.bodyParser({
	maxFieldsSize: 1024 * 1024
}));

app.use(middleware.midSend());
app.use("/admin", appAdmin);
app.use("/open", appOpen);

app.use(app.router);
app.set('port', config.port);
exports.server = require('http').createServer(app)
exports.server.listen(app.get('port'), function () {
	logger.fatal('Express server listening on port %d, redis: %j', app.get('port'), util.format("%s:%s", config.redis.host, config.redis.port));
});
