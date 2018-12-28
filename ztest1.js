"use strict";
const _ = require("underscore");
const MD5 = require("md5");
const util = require("util");
const xml2js = require('xml2js');
const request = require('superagent');

let payParam = {
	appid: "wx6*****6a4",
	mch_id: "152******1",
	nonce_str: "Kwyfk43mcFDoeDJZ2CNL47rOa9gd2jRL",
	body: "恋世界购买123456-1234",
	out_trade_no: "123456-1545647815",
	total_fee: 400,
	spbill_create_ip: "127.0.0.1",
	notify_url: "https://******",
	trade_type: "APP",
	// attach: "2362765424644.2.2018-05-30T10:10:59+08:00.2363086403188",
};

let getPaySign = function (param, signKey = "") {
	let paramArr = _.keys(param);
	paramArr.sort();
	let strArr = [];
	paramArr.forEach(key => {
		strArr.push(util.format("%s=%s", key, param[key]));
	});
	strArr.push(util.format("%s=%s", "key", signKey));
	let md5string = strArr.join("&");
	console.log("md5string: %j", md5string);
	return MD5(md5string).toString().toUpperCase();
};

payParam.sign = getPaySign(payParam);

let json2xml = function (obj) {
	let builder = new xml2js.Builder({
		allowSurrogateChars: true
	});
	let xml = builder.buildObject({
		xml: obj
	});
	return xml;
};

let xml2Json = function (xml, cb) {
	xml2js.parseString(xml, {explicitArray: false, trim: true, explicitRoot: false}, function (err, json) {
		if (!!err) {
			return cb("parse xml err");
		}
		if (!json) {
			return cb("no response");
		}
		return cb(null, json);
	});
};

let postXmlHttp = function (url, params, cb) {
	let xmlStr = json2xml(params);
	console.log("postXmlHttp url: %j, xmlStr: %j", url, xmlStr);
	request.post(url)
		.type("text/xml")
		.send(xmlStr)
		.end((err, xhr) => {
			if (!!err) {
				return cb(err);
			}
			if (!xhr || !xhr.text) {
				return cb("no response");
			}
			if (xhr.statusCode != 200) {
				console.log("postXmlHttp statusCode err url: %j, xmlStr: %j, statusCode: %j", url, xmlStr, xhr.statusCode);
				return cb(xhr.statusCode);
			}
			xml2Json(xhr.text, function (err, result) {
				if (!!err) {
					console.log("postXmlHttp xml2Json err: %j, xhr.text: %j, url: %j, params: %j", err, xhr.text, url, params);
				}
				return cb(err, result);
			});
		});
};

let wxHttpCallback = exports.wxHttpCallback = function (err, response, cb) {
	if (err) {
		return cb('http err: ' + err);
	}
	if (!response) {
		return cb('no response');
	}
	if (response.return_code == 'FAIL') {
		return cb('return_code fail: ' + response.return_msg);
	}
	if (response.result_code == 'FAIL') {
		return cb('err_code:' + response.err_code + ', err_msg:' + response.err_code_des);
	}
	return cb(null, response);
};

console.log("payParam: %j", payParam);
let url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
postXmlHttp(url, payParam, function (err, response) {
	console.log("=================== err: %j, response: %j", err, response);
	wxHttpCallback(err, response, function (err, res) {
		console.log("=================== err: %j, res: %j", err, res);
	});
});
