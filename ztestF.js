var xml2js = require("xml2js");


function xml2Json(xml, cb) {
	xml2js.parseString(buf, {explicitArray: false, trim: true, explicitRoot: false}, function (err, json) {
		if (!!err) {
			return cb("parse xml err");
		}
		if (!json) {
			return cb("no response");
		}
		return cb(null, json);
	});
}

function json2xml(obj) {
	var builder = new xml2js.Builder({
		allowSurrogateChars: true
	});
	var xml = builder.buildObject({
		xml:obj
	});
	return xml;
}

var request = require('superagent');

var obj = {
	out_trade_no: "123456798",
	appid: "abcdefg"
};

request
	.post("127.0.0.1:4000/wxpay/cb")
	.set('Content-Type', 'text/xml')
	.send(json2xml(obj))
	.end(function () {
		console.log("xhr: %j", arguments);
	});