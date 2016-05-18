/**
 * Created by wyq on 2016/5/18.
 */

var koa = require("koa");
var app = new koa();
var config = require("./config.js");
var log4js = require('log4js');
log4js.configure(config.log4jsconfig, {});
var logger = log4js.getLogger(__filename);
require('babel-core/register')({
	presets: ['es2015-node5', 'stage-3']
});
/*// x-response-time

 app.use(function *(next) {
 var start = new Date;
 yield next;
 var ms = new Date - start;
 this.set("X-Response-Time", ms + "ms");
 });*/

//logger

app.use(async (ctx, next) => {
	var start = new Date;
	await next();
	var ms = new Date - start;
	logger.info("%s %s - %s", ctx.method, ctx.url, ms);
});

//response

app.use(ctx => {
	ctx.body = "Hello World";
});

app.listen(config.port, function () {
	logger.info("server start listen post: %j", config.port);
});

//npm i runkoa -g       //安装runkoa
//runkoa *.js   //这样不用在意babel细节
//或者 babel app_1.js -o b_app_1.js 将es7语法进行转化之后 node b_app_1.js