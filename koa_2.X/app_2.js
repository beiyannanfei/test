/**
 * Created by wyq on 2016/5/18.
 */

var koa = require("koa");
var app = new koa();
var config = require("./config.js");
var log4js = require('log4js');
log4js.configure(config.log4jsconfig, {});
var logger = log4js.getLogger(__filename);
var router = require("koa-router")();

router.get("/", ctx => {
	return ctx.body = "Hello World!";
});

router
	.get("/get", (ctx, next)=> {    //curl "127.0.0.1:9101/get"
		return ctx.body = "Hello get!";
	})
	.post("/post", (ctx, next) => {     //curl "127.0.0.1:9101/post" -d "a=10"
		return ctx.body = "Hello post!";
	});

//命名路由      curl "127.0.0.1:9101/users/3"
router.get("user", "/users/:id", (ctx, next) => {
	logger.info("ctx id: %j", ctx.params.id);
	ctx.body = "Hello user " + ctx.params.id;
});
//命名路由用法        curl "127.0.0.1:9101/getNamed"
router.get("/getNamed", (ctx) => {
	ctx.body = router.url("user", 3);
});

//多个中间件     curl "127.0.0.1:9101/multi/midd/10"
router.get("/multi/midd/:id",
	(ctx, next)=> {
		var id = ctx.params.id || 0;
		ctx.id = id * id;
		return next();
	}, ctx => {
		logger.info("ctx.id: %j", ctx.id);
		ctx.body = ctx.id;
	}
);

app.use(router.routes()).use(router.allowedMethods());

//嵌套路由
var Router = require("koa-router");
var forums = new Router();
var posts = new Router();

posts.get('/', function (ctx, next) {   //curl "127.0.0.1:9101/forums/123/posts"
	logger.info("ctx.url = %j", ctx.url);
	ctx.body = "aaaaaaa";
});
posts.get('/:pid', function (ctx, next) {   //curl "127.0.0.1:9101/forums/123/posts/456"
	logger.info("ctx.url = %j", ctx.url);
	ctx.body = "bbbbb";
});
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());

// responds to "/forums/123/posts" and "/forums/123/posts/123"
app.use(forums.routes());

//路由前缀
var preRouter = new Router({prefix: "/prefix"});
app.use(preRouter.routes()).use(preRouter.allowedMethods());
preRouter.get("/test", (ctx, next) => { //curl "127.0.0.1:9101/prefix/test"
	logger.info("url: %j", ctx.url);
	ctx.body = ctx.url;
});
preRouter.get("/test/:id", (ctx, next) => { //curl "127.0.0.1:9101/prefix/test/147"
	logger.info("url: %j", ctx.url);
	ctx.body = ctx.url;
});

//链接参数
router.get("/param/:category/:title", (ctx, next) => {  //curl "127.0.0.1:9101/param/programming/how-to-node"
	logger.info("url: %j, params: %j", ctx.url, ctx.params);
	ctx.params.url = ctx.url;
	ctx.body = ctx.params;
});


router.get("/a1", ctx => {      // 浏览器中访问 http://127.0.0.1:9101/a1
	logger.info("========== a1 ==========");
	ctx.redirect("/a2");
	ctx.status = 301;
});

router.get("/a2", ctx => {
	logger.info("========== a2 ==========");
	ctx.body = "a1 => a2";
});

//router.param(param, middleware) ⇒ Router
var users = {
	1: "a1",
	2: "a2",
	3: "a3"
};
router
	.param("myuser", (id, ctx, next) => {
		ctx.user = users[id];
		if (!ctx.user) {
			return ctx.status = 404;
		}
		return next();
	})
	.get("/myusers/:myuser", ctx => {   // curl "127.0.0.1:9101/myusers/3"
		ctx.body = ctx.user;
	})
	.get("/myusers/:myuser/friends", ctx => {   //curl "127.0.0.1:9101/myusers/3/friends"
		ctx.body = ctx.user + "-friends";
	});


app.listen(config.port, function () {
	logger.info("server start listen post: %j", config.port);
});

//npm i runkoa -g       //安装runkoa
//runkoa *.js   //这样不用在意babel细节
