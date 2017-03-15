/**
 * Created by wyq on 17/3/14.
 */
var express = require("express");
var app = express();
var util = require("util");

var session = require("express-session");
var RedisStore = require("connect-redis")(session);

app.use(session({
	name: "test-sess-id",     //设置 cookie 中保存 session 的字段名称，默认为 connect.sid
	store: new RedisStore(),  //session 的存储方式，默认存放在内存中
	resave: false,            //即使 session 没有被修改，也保存 session 值，默认为 true
	saveUninitialized: false, //强制没有“初始化”的session保存到storage中默认是true,但是不建议使用默认值。
	secret: "abc123",         //通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改。
	rolling: false,           //每个请求都重新设置一个 cookie，默认为 false。
	cookie: {       //设置存放 session id 的 cookie 的相关选项，默认为(default: { path: '/', httpOnly: true, secure: false, maxAge: null })
		maxAge: 20 * 1000
	}
}));

app.get("/t1", (req, res) => {
	console.log("session: %j", req.session);
	console.log("sessionID: %j", req.sessionID);
	console.log("req.session.cookie: %j", req.session.cookie);
	console.log("[%j], %j", new Date().toLocaleString(), new Date(req.session.cookie.expires).toLocaleString());
	if (req.session.isVisit) {
		req.session.isVisit++;
		return res.send(util.format('<h3>第%s次访问此界面</h3>', req.session.isVisit));
	}
	req.session.isVisit = 1;
	return res.send("欢迎第一次访问!");
});


app.listen(8080, function () {
	console.log("server start finish listen port: 8080");
});