var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var config = require('./config.js');
var wxInfo = require('./interface/wxInfo.js');
var appWechat = require('./routes/api');
var appAdmin = require('./routes/adminApi.js');
var appOpen = require('./routes/openApi.js');
var env = require('./env-config');
var mFile      = require('./routes/file.js');
var mExcel      = require('./routes/excel.js');
var log4js = require('log4js');
log4js.configure(config.log4jsconfig, {});
var accessLoger=log4js.getLogger();

process.on('uncaughtException', function (err) {
    console.log('[Inside \'uncaughtException\' event]' + err.stack || err.message);
    if (env != 'localhost'){
        wxInfo.pushErrorMsg('env: ' + config.NODE_ENV + '\n' + err + '\n' + err.stack)
    }
});

var format = ':method :url :status :content-length :response-time ms';
app.use(log4js.connectLogger(accessLoger, {level:log4js.levels.INFO, format: format}));
app.use(express.bodyParser({maxFieldsSize: 1 * 1024 * 1024}))
app.use(app.router)

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.set('view engine', 'html');
if (config.NODE_ENV != 'dev'){
    app.set('view cache', true);
}

app.use('/admin', appAdmin);
app.use('/pointMall', appWechat);
app.use('/open', appOpen);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'temp')));

app.post('/image/upload', mFile.postFile);
app.post('/excel/upload', mExcel.postFile);
app.get('/i/:fileId', mFile.getFile);
app.set('port', config.port)

exports.server = require('http').createServer(app)
exports.server.listen(app.get('port'), function () {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
