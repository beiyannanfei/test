/**
 * Created by sensoro on 16/8/17.
 */

var jsonxml = require('jsontoxml');
var xml2js = require('xml2js');

var obj = {a: 10, b: 20, c: 30, d: {d1: 41, d2: 42, d3: 43}};

// console.log(jsonxml(obj, {}));  //没有xml根节点

function json2xml(obj) {
	var builder = new xml2js.Builder({
		allowSurrogateChars: true
	});
	var xml = builder.buildObject({
		xml: obj
	});
	return xml;
}

// console.log(json2xml(obj));

var xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><xml><a>10</a><b>20</b><c>30</c><d><d1>41</d1><d2>42</d2><d3>43</d3></d></xml>';

function xml2json(xml, cb) {
	xml2js.parseString(xml, {explicitArray: false, trim: true, explicitRoot: false}, function (err, json) {
		return cb(err, json);
	});
}

/*xml2json(xml, function (err, o) {
 console.log(arguments);
 });*/

var request = require('superagent');
function t1() {
	var param = {
		appid: "wxd678efh567hg6787",
		mch_id: "1230000109",
		out_trade_no: "20150806125346",
		nonce_str: "C380BEC2BFD727A4B6845133519F3AD6",
		sign: "5K8264ILTKCH16CQ2502SI8ZNMTM67VS"
	};
	var xmlParam = json2xml(param);
	console.log(xmlParam);
	request.post("https://api.mch.weixin.qq.com/pay/orderquery")
		.type('text/html')
		.send(xmlParam)
		.end(function (err, xhr) {
			console.log("err: %j, xhr: %j", err, xhr);
		});
}

var _ = require("underscore");
var parseString = xml2js.parseString;
exports.postXmlHttp = function (url, params, cb) {
	var options = _.extend({}, params);
	var xml = jsonxml(options, {});
	xml = '<xml>' + xml + '</xml>';
	console.log(xml);
	console.log(url);
	request.post(url)
		.type('text/html')
		.send(xml)
		.end(function (err, xhr) {
			if (xhr.statusCode == 200) {
				if (xhr.text) {
					parseString(xhr.text, {explicitArray: false, trim: true, explicitRoot: false}, function (err, result) {
						cb(err, result);
					})
				} else {
					cb('no response');
				}
			} else {
				cb(xhr.statusCode);
			}
		});
};
/*
 exports.postXmlHttp(
 "https://api.mch.weixin.qq.com/pay/orderquery",
 {
 appid: "wxd678efh567hg6787",
 mch_id: "1230000109",
 out_trade_no: "20150806125346",
 nonce_str: "C380BEC2BFD727A4B6845133519F3AD6",
 sign: "5K8264ILTKCH16CQ2502SI8ZNMTM67VS"
 }, function (err, o) {
 console.log("err: %j, o: %j", err, o);
 });
 */

