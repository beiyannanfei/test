var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var appAdmin = require('./routes/adminApi.js');
var appOpen = require('./routes/openApi.js');

var mFile = require('./routes/file.js');
var mExcel = require('./routes/excel.js');
var config = require('./config.js');
var middleware  = require('./routes/middleware.js')
var wxInfo = require('./interface/wxInfo.js');
var adminController = require('./routes/adminController.js')

process.on('uncaughtException', function (err) {
    console.log('[Inside \'uncaughtException\' event]' + err.stack || err.message);
    wxInfo.pushErrorMsg(err + '\n' + err.stack)
});

var logToken = '[:date] - :method :url :status :res[content-length] - :response-time ms';
express.logger.token('date', function(){
    return new Date().toLocaleString();
});

app.use(express.favicon());
app.use(express.logger(logToken));
app.use(express.bodyParser({maxFieldsSize: 1 * 1024 * 1024}))
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use('/test',require('./routes/testApi.js'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(middleware.midSend())

app.use('/admin', appAdmin);
app.use('/open', appOpen);

app.post('/image/upload', mFile.postFile);
app.post('/excel/upload', mExcel.postFile);
app.get('/i/:fileId', mFile.getFile);
app.get('/tpl/:pageName', adminController.goAdminPage);
app.set('port', config.port)

exports.server = require('http').createServer(app)
exports.server.listen(app.get('port'), function () {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

