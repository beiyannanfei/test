/**
 * Created by wyq on 17/3/14.
 */
var express = require("express");
var cookieParser = require("cookie-parser");

var app = express();
app.use(cookieParser("asdf"));

app.get("/", (req, res) => {
	return res.send("welcome visit!");
});

app.get("/t1", (req, res) => {
	console.log("Cookies: %j", req.cookies);
	console.log("Signed Cookies: %j", req.signedCookies);
	return res.send(JSON.stringify(req.cookies) + "===" + JSON.stringify(req.signedCookies));
});

app.get("/t2", (req, res) => {  //设置cookie
	console.log("headers: %j", req.headers);
	console.log("headers: %j", req.headers.cookie);
	console.log("Cookies: %j", req.cookies);
	console.log("Signed Cookies: %j", req.signedCookies);
	if (req.cookies.isVisit) {
		res.cookie("isVisit", ++req.cookies.isVisit, {maxAge: 10 * 1000});
		return res.send("欢迎第" + req.cookies.isVisit + "次访问");
	}
	res.cookie("isVisit", 1, {maxAge: 10 * 1000});
	return res.send("欢迎第一次访问!");
});

app.get("/t3", (req, res) => {  //cookie加密
	console.log("Cookies: %j", req.cookies);
	console.log("Signed Cookies: %j", req.signedCookies);
	if (req.cookies.isVisit || req.signedCookies.isVisit) {
		res.cookie("isVisit", (+(req.cookies.isVisit || req.signedCookies.isVisit)) + 1, {maxAge: 30 * 1000, signed: true});
		return res.send("欢迎第" + (req.cookies.isVisit || req.signedCookies.isVisit) + "次访问");
	}
	res.cookie("isVisit", 1, {maxAge: 30 * 1000, signed: true});    //signed=true 代表加密,cookieParser需要设置密钥(本例中为asdf)
	return res.send("欢迎第一次访问!");
});

app.get("/t4", (req, res) => {  //cookie清除
	if (req.query.delcookie) {
		res.clearCookie("isVisit");
		return res.send("cookie清除");
	}
	console.log("Cookies: %j", req.cookies);
	if (req.cookies.isVisit) {
		res.cookie("isVisit", ++req.cookies.isVisit, {maxAge: 30 * 1000});
		return res.send("欢迎第" + req.cookies.isVisit + "次访问");
	}
	res.cookie("isVisit", 1, {maxAge: 30 * 1000});
	return res.send("欢迎第一次访问!");
});

app.listen(8080, function () {
	console.log("server start finish listen port: 8080");
});

