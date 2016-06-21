var exec = require('child_process').exec;
var MD5 = require("crypto-js/md5");
var util = require("util");
var httpUtil = require("./superagent.js");


var url = 'http://pmall.yaotv.tvm.cn/open/financial/huaren/order';
var orderInfo = {
	orderId: "188247_1",
	timeStamp: "1466412888",
	userId: "526321",
	mobile: "5e815a21deb3218dd2f282dae481d9bd",
	productID: "1936",
	productName: "华金8天投",
	repayTime: "8天",
	incomeRate: "6.00",
	money: 10000,
	loantypeName: "到期后一次性还息还本",
	feedback: "orEt2t1rzNjS32HG8iaEiR4WhjaE%7C46497107fa23%7CorEt2t1rzNjS32HG8iaEiR4WhjaE%7C2"
};

var rkey = "tVmInInG&fIrStP2P";
var checkStr = util.format("%s:%s:%s:%s:%s",
	orderInfo.orderId, orderInfo.timeStamp, orderInfo.userId, orderInfo.money, rkey);
var checkSign = MD5(MD5(checkStr).toString()).toString();
orderInfo.sign = checkSign;

httpUtil.httpPost(url, orderInfo, function (err, response) {
	console.log("err: %j, response: %j", err, response);
});


