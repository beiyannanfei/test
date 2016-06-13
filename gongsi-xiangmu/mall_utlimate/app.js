var path = require('path');
var koa = require('koa');
var app = koa();
var router = require('koa-router')();
var koaBodyparser = require('koa-bodyparser')
var staticCache = require('koa-static-cache')
var koaLogger = require('koa-logger')


var adminApi = require('./routes/adminApi.js');
var wechatApi = require('./routes/wechatApi.js');
var config = require('./config.js');
var middleware = require('./routes/middleware.js');

app.use(koaBodyparser())
app.use(koaLogger())

var session = require('koa-session');
adminApi.use(session({}, app))

app.use(middleware.midSend())
app.use(adminApi.routes());
app.use(wechatApi.routes());

app.use(staticCache(path.join(__dirname, 'public')));

app.listen(config.port);



