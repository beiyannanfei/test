/**
 * Created by wyq on 2016/5/16.
 * api练习
 */
var express = require('express');
var app = express();
module.exports = app;
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);

var showReqMethod = function (req, res, next) {        //请求方式
	logger.trace('Request Type:', req.method);
	logger.debug('Request URL:', req.originalUrl);
	var ipList = req.connection.remoteAddress.split(":");
	logger.info("Request IP:", ipList[ipList.length - 1]);
	logger.warn("req.hostname: %j", req.hostname);
	logger.error("req.protocol: %j", req.protocol);
	logger.fatal("req.ip: %j", req.ip);
	logger.info("req.ips: %j\n\n", req.ips);
	next();
};

app.use(showReqMethod);

// curl "127.0.0.1:9001/api/"
app.get("/", function (req, res) {
	return res.send("apiTest success");
});

// curl "127.0.0.1:9001/api/set_get"
app.get("/set_get", function (req, res) {
	app.set("title", "My Site");
	var title = app.get("title");
	return res.send(title);
});

// curl "127.0.0.1:9001/api/enable_disable"
app.get("/enable_disable", function (req, res) {
	app.enable("trust");
	var e1 = app.get("trust");
	app.disable("trust1");
	var e2 = app.get("trust1");
	return res.send({e1: e1, e2: e2});
});

// curl "127.0.0.1:9001/api/enabled_disabled"
app.get("/enabled_disabled", function (req, res) {
	var e1 = app.enabled('trust proxy');
	app.enable('trust proxy');
	var e2 = app.enabled('trust proxy');

	var d1 = app.disabled('trust proxy1');
	app.enable('trust proxy1');
	var d2 = app.disabled('trust proxy1');
	return res.send({enabled: {e1: e1, e2: e2}, disabled: {d1: d1, d2: d2}});
});

// curl "127.0.0.1:9001/api/bodyParser" -d "a=10&b=20"
app.post("/bodyParser", function (req, res) {
	var body = req.body;
	logger.info("bodyParser body: %j", body);
	return res.send(body);
});

// curl "127.0.0.1:9001/api/getip"
app.get("/getip", function (req, res) {
	app.enable("trust proxy");
	var ip = req.ip;
	return res.send(ip)
});

// curl "127.0.0.1:9001/api/getPath"
app.get("/getPath", function (req, res) {
	var path = req.path;
	logger.info("getPath path: %j\n\n", path);
	return res.send(path);
});

// curl "127.0.0.1:9001/api/getHost"
app.get("/getHost", function (req, res) {
	var host = req.host;
	logger.info("getHost host: %j\n\n", host);
	return res.send(host);
});

// curl "127.0.0.1:9001/api/getProtocol"
app.get("/getProtocol", function (req, res) {
	var protocol = req.protocol;
	logger.info("getProtocol protocol: %j\n\n", protocol);
	return res.send(protocol);
});

// curl "127.0.0.1:9001/api/getsubdomains"
app.get("/getsubdomains", function (req, res) {
	var subdomains = req.subdomains;
	logger.info("getsubdomains protocol: %j\n\n", subdomains);
	return res.send(subdomains);
});

// curl "127.0.0.1:9001/api/getacceptedLanguages"
app.get("/getacceptedLanguages", function (req, res) {
	var acceptedLanguages = req.acceptedLanguages;
	logger.info("getacceptedLanguages acceptedLanguages: %j\n\n", acceptedLanguages);
	return res.send(acceptedLanguages);
});

// curl "127.0.0.1:9001/api/getacceptedCharsets"
app.get("/getacceptedCharsets", function (req, res) {
	var acceptedCharsets = req.acceptedCharsets;
	logger.info("getacceptedCharsets acceptedCharsets: %j\n\n", acceptedCharsets);
	return res.send(acceptedCharsets);
});










