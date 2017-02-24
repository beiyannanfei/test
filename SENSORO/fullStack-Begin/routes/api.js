/**
 * Created by wyq on 16/9/12.
 */
var express = require('express');
var app = module.exports = new express();

app.get("/a1", (req, res) => {
	console.log(req.query);
	res.send("<h1>Hello World</h1>");
});

app.get("/a2", (req, res) => {
	console.log("a2 req.query: %j", req.query);
	var name = req.query.name;
	if (name == "admin") {
		return res.send("用户名已经存在!");
	}
	return res.send("通过!");
});

app.post("/a3", (req, res) => {
	console.log("a3 req.body: %j", req.body);
	var name = req.body.name;
	if (name == "admin") {
		return res.send("用户名已经存在!");
	}
	return res.send("通过!");
});

app.post("/a4", (req, res) => {
	console.log("a4 req.body: %j", req.body);
	var name = req.body.loginName;
	if (name == "admin") {
		return res.send("用户名已经存在!");
	}
	return res.send("通过!");
});

app.post("/a5", (req, res) => {
	console.log("a5 req.body: %j", req.body);
	if (req.body.loginpwd == "admin") {
		return res.send("fial");
	}
	return res.send("OK");
});

app.get("/a6/province", (req, res) => {
	return res.send(["北京市", "天津市", "上海市"]);
});

app.get("/a6/city", (req, res) => {
	var province = req.query.province;
	if (province == "北京市") {
		return res.send(["朝阳区", "海淀区", "东城区"]);
	}
	if (province == "天津市") {
		return res.send(["河东区", "河西区", "塘沽区"]);
	}
	if (province == "上海市") {
		return res.send(["浦东区", "蒲西区", "闵行区"]);
	}
});

app.post("/a7/load", (req, res) => {
	console.log("a7 load req.body: %j", req.body);
	return res.send({a: 123, b: 456, c: 789});
});

app.get("/a7/get", (req, res) => {
	console.log("a7 get req.query: %j", req.query);
	return res.send({a: 1, b: 2, c: 3});
});

app.get("/a7/xml", (req, res) => {
	console.log("a7 xml req.query: %j", req.query);
	res.set('Content-Type', 'text/xml');
	res.end("<?xml version='1.0' encoding='utf-8' ?><User><Name>LiXueFeng</Name></User>");
});

app.post("/a7/post", (req, res) => {
	console.log("a7 post req.body: %j", req.body);
	if (req.body.name == "admin") {
		return res.status(400).send({err: "test error"});
	}
	return res.send({a: 111, b: 222, c: 333});
});

app.get("/jquery", function (req, res) {
	return res.end("这是个从Nodejs服务器中读取的数据。");
});

app.post("/jquery", function (req, res) {
	var text = "";
	for (var index in req.body) {
		text += index + ": " + req.body[index] + "\n";
	}
	return res.end(text);
});

app.post("/urllib", function (req, res) {
	console.log("req.body: %j", req.body);
	res.send({a: 10, b: 20});
});
