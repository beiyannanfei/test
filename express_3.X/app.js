var express = require('express');
var app = express();
var path = require('path');
var config = require("./config.js");
var appAdmin = require("./admin/adminApi.js");
var appOpen = require("./open/openApi.js");
var appMidd = require("./mid_test/midWareTest.js");
var middleware = require("./globle/middleware.js");
var appApi = require("./api_test/apiTest.js");
var util = require("util");
var log4js = require('log4js');
var cookieParser = require('cookie-parser');
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
app.use(express.bodyParser({    //如果不加这句代码，那么post中的body参数无法解析
	maxFieldsSize: 1024 * 1024
}));

// load the cookie-parsing middleware
app.use(cookieParser());

app.use(middleware.midSend());
app.use("/admin", appAdmin);
app.use("/open", appOpen);
app.use("/midd", appMidd);
app.use("/api", appApi);

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', config.port);
exports.server = require('http').createServer(app);
exports.server.listen(app.get('port'), function () {
	logger.fatal('Express server listening on port %d, redis: %j', app.get('port'), util.format("%s:%s", config.redis.host, config.redis.port));
});
