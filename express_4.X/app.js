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


process.on('uncaughtException', function (err) {
	logger.error('[Inside \'uncaughtException\' event]' + err.stack || err.message);
});

app.set("env", config.NODE_ENV);

app.use('/birds', birds);

logger.info("run environment: %j", app.get('env'));

app.set('port', config.port);
//exports.server = require('http').createServer(app);
app.listen(app.get('port'), function () {
	logger.fatal('Express server listening on port %d, redis: %j', app.get('port'), util.format("%s:%s", config.redis.host, config.redis.port));
});

