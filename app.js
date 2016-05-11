var express = require('express');
var path = require('path');
var app = express();

process.on('uncaughtException', function (err) {
	console.log('[Inside \'uncaughtException\' event]' + err.stack || err.message);
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

app.set('port', 9001);

exports.server = require('http').createServer(app)
exports.server.listen(app.get('port'), function () {
	console.log('Express server listening on port %d', app.get('port'));
});
