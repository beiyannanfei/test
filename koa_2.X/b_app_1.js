"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

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

app.use((() => {
  var ref = _asyncToGenerator(function* (ctx, next) {
    var start = new Date();
    yield next();
    var ms = new Date() - start;
    logger.info("%s %s - %s", ctx.method, ctx.url, ms);
  });

  return function (_x, _x2) {
    return ref.apply(this, arguments);
  };
})());

//response

app.use(ctx => {
  ctx.body = "Hello World";
});

app.listen(config.port, function () {
  logger.info("server start listen post: %j", config.port);
});

//npm i runkoa -g       //安装runkoa
//runkoa *.js   //这样不用在意babel细节
