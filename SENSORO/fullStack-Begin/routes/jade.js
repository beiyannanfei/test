/**
 * Created by wyq on 16/12/9.
 */
var express = require('express');
var app = module.exports = new express();

app.get("/test", function (req, res) {
	return res.render("test", {val: {a: "AAAA", b: "BBB"}});
});

app.get("/test1", function (req, res) {
	return res.render("test1");
});

app.get("/test2", function (req, res) {
	return res.render("index");
});