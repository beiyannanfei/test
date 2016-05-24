/**
 * Created by wyq on 2016/5/23.
 * 应用上下文（Context）
 */

var koa = require("koa");
var app = new koa();
var config = require("./config.js");
var log4js = require('log4js');
log4js.configure(config.log4jsconfig, {});
var logger = log4js.getLogger(__filename);
var router = require("koa-router")();
var parse = require('co-body');

router.use(async (ctx, next) => {   //runkoa app_3.js
	if ("POST" == ctx.method) {
		ctx.postArg = await parse(ctx, {limit: '1kb'});
	}
	await next();
});

/*app.use(function *(next) {      //node app_3.js
	if ("POST" == this.method) {
		this.postArg = yield parse(this, {limit: '1kb'});
	}
	return yield next;
});*/

router.get("/context/get/test", ctx => {    // curl "127.0.0.1:9101/context/get/test?a=10&b=20"
	logger.info("返回请求头 -- ctx.header: %j", ctx.header);
	logger.info("返回请求方法 -- ctx.method: %j", ctx.method);
	logger.info("返回 req 对象的 Content-Length (Number) -- ctx.length: %j", ctx.length);
	logger.info("返回请求 url -- ctx.url: %j", ctx.url);
	logger.info("返回请求 pathname -- ctx.path: %j", ctx.path);
	logger.info("返回 url 中的查询字符串，去除了头部的 '?' -- ctx.querystring: %j", ctx.querystring);
	logger.info("返回 url 中的查询字符串，包含了头部的 '?' -- ctx.search: %j", ctx.search);
	logger.info("返回请求主机名，不包含端口；当 app.proxy 设置为 true 时，支持 X-Forwarded-Host。 -- ctx.host: %j", ctx.host);
	logger.info("返回 req 对象的 Content-Type，不包括 charset 属性 -- ctx.type: %j", ctx.type);
	logger.info("返回经过解析的查询字符串 -- ctx.query: %j", ctx.query);
	logger.info("返回请求协议名 -- ctx.protocol: %j", ctx.protocol);
	logger.info("判断请求协议是否为 HTTPS 的快捷方法 -- ctx.secure: %j", ctx.secure);
	logger.info("返回请求IP -- ctx.ip: %j", ctx.ip);
	logger.info("返回请求IP列表 -- ctx.ips: %j", ctx.ips);
	logger.info("返回请求对象中的子域名数组 -- ctx.subdomains: %j", ctx.subdomains);
	return ctx.body = "Hello GET Context";
});

router.post("/context/post/test", ctx => {    // curl "127.0.0.1:9101/context/post/test?a=10&b=20" -d "c=30&d=40"
	logger.info("返回请求头 -- ctx.header: %j", ctx.header);
	logger.info("返回请求方法 -- ctx.method: %j", ctx.method);
	logger.info("返回 req 对象的 Content-Length (Number) -- ctx.length: %j", ctx.length);
	logger.info("返回请求 url -- ctx.url: %j", ctx.url);
	logger.info("返回请求 pathname -- ctx.path: %j", ctx.path);
	logger.info("返回 url 中的查询字符串，去除了头部的 '?' -- ctx.querystring: %j", ctx.querystring);
	logger.info("返回 url 中的查询字符串，包含了头部的 '?' -- ctx.search: %j", ctx.search);
	logger.info("返回请求主机名，不包含端口；当 app.proxy 设置为 true 时，支持 X-Forwarded-Host。 -- ctx.host: %j", ctx.host);
	logger.info("返回 req 对象的 Content-Type，不包括 charset 属性 -- ctx.type: %j", ctx.type);
	logger.info("返回经过解析的查询字符串 -- ctx.query: %j", ctx.query);
	logger.info("返回请求协议名 -- ctx.protocol: %j", ctx.protocol);
	logger.info("判断请求协议是否为 HTTPS 的快捷方法 -- ctx.secure: %j", ctx.secure);
	logger.info("返回请求IP -- ctx.ip: %j", ctx.ip);
	logger.info("返回请求IP列表 -- ctx.ips: %j", ctx.ips);
	logger.info("返回请求对象中的子域名数组 -- ctx.subdomains: %j", ctx.subdomains);
	logger.fatal("get args: %j, post args: %j", ctx.query, ctx.postArg);
	return ctx.body = "Hello POST Context";
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(config.port, function () {
	logger.info("server start listen post: %j", config.port);
});