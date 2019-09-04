/**
 * Created by wyq on 16/12/22.
 * 短信
 */
var request = require('superagent');
var MD5 = require("crypto-js/md5");
var async = require("async");

var httpPost = exports.httpPost = function (url, param, cb) {
	request.post(url)
		.type("application/x-www-form-urlencoded")
		.send(param)
		.timeout(10000)
		.accept("text/json")
		.end(function (err, xhr) {
			if (!!err) {
				return cb(err);
			}
			if (xhr.statusCode != 200) {
				return cb(xhr.statusCode);
			}
			if (!xhr.text) {
				return cb("response has not content");
			}
			let body;
			try {
				body = JSON.parse(xhr.text);
			}
			catch (e) {
				body = xhr.text;
			}
			return cb(null, body);
		});
};

/**
 *
 * @param mobile  手机号码
 * @param msg     信息内容
 * @param type    短信头{1: TV+摇电视, 2: 媒体桥, 3: 天天电视宝, 4: 电视红包}
 * @param cb
 */
var sendMsg = function (mobile, msg, type, cb) {
	var str = "mobile=" + mobile + "&rkey=waop4lBu8Fln";
	var sign = MD5(MD5(str).toString()).toString();
	var url = "http://sms.yaotv.tvm.cn/apis/sms/sendSms";
	var param = {
		mobile: mobile,
		msg: msg,
		sign: sign,
		type: type
	};
	httpPost(url, param, function (err, response) {
		return cb ? cb(err, response) : "";
	});
};

/*
 sendMsg("13888888888", "短信測試1", 1, function () {
 console.log(arguments);
 });*/

async.series([
	// cb => sendMsg("13888888888", "短信测试1", 1, cb),
	// cb => sendMsg("13888888888", "短信测试2", 2, cb),
	cb => sendMsg("13691035358", "短信测试3", 3, cb),
	// cb => sendMsg("13888888888", "短信测试4", 4, cb),
], function (err, results) {
	console.log(arguments);
});