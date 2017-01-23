/**
 * Created by wyq on 17/1/23.
 */
"use strict";
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var util = require("util");

process.on('uncaughtException', function (err) {
	console.error('[Inside \'uncaughtException\' event]' + err.stack || err.message);
});

app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

app.set('port', 9900);
//exports.server = require('http').createServer(app);
app.listen(app.get('port'), function () {
	console.log('Express server listening on port %d', app.get('port'));
});

app.get("/test/:id", function (req, res) {
	let param = req.params;
	let query = req.query;
	console.log("get test param: %j, query: %j", param, query);
	return res.end("get success");
});

app.post("/test/:id", function (req, res) {
	let param = req.params;
	let query = req.query;
	let body = req.body;
	console.log("post test param: %j, query: %j, body: %j", param, query, body);
	return res.end("post success");
});

app.delete("/test/:id", function (req, res) {
	let param = req.params;
	let query = req.query;
	let body = req.body;
	console.log("delete test param: %j, query: %j, body: %j", param, query, body);
	return res.end("delete success");
});

app.put("/test/:id", function (req, res) {
	let param = req.params;
	let query = req.query;
	let body = req.body;
	console.log("put test param: %j, query: %j, body: %j", param, query, body);
	return res.end("put success");
});