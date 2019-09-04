//发送短信
var httpUtils = require("../superagent.js");
var MD5 = require("crypto-js/md5");

var sendMsg = function (mobile, msg, type, cb) {
	if (!mobile) {
		return cb ? cb("no mobile") : "";
	}
	if (!type) {
		type = 1
	}
	var str = "mobile=" + mobile + "&rkey=waop4lBu8Fln";
	var sign = MD5(MD5(str).toString()).toString();
	var url = "http://sms.yaotv.tvm.cn/apis/sms/sendSms";
	var param = {
		mobile: mobile,
		msg: msg,
		sign: sign,
		type: type
	};
	httpUtils.httpPost(url, param, cb);
};

sendMsg("13888888888", "短信测试", 1, function (err, o) {
	console.log(arguments);
});


