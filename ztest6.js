var exec = require('child_process').exec;
var MD5 = require("crypto-js/md5");
var util = require("util");
var httpUtil = require("./superagent.js");


var url = 'http://qa.pmall.yaotv.tvm.cn/open/financial/huaren/order';
var orderInfo = {
	orderId: "188247_18",
	timeStamp: "1466412888",
	userId: "526321",
	mobile: "4167c3266b67fc449172249550a55876",
	productID: "1936",
	productName: "华金8天投",
	repayTime: "6个月",
	incomeRate: "6.00",
	money: 10000,
	loantypeName: "到期后一次性还息还本",
	feedback: "orEt2t9TyFNWO3XX5E-YTj61Hd0U|wx44490bbc768ce355|oxWE2s_3y2RcuEb1r6XSp2u9rZnQ|3"
};

var rkey = "tVmInInG&fIrStP2P";
var checkStr = util.format("%s:%s:%s:%s:%s",
	orderInfo.orderId, orderInfo.timeStamp, orderInfo.userId, orderInfo.money, rkey);
var checkSign = MD5(MD5(checkStr).toString()).toString();
orderInfo.sign = checkSign;

httpUtil.httpPost(url, orderInfo, function (err, response) {
	console.log("err: %j, response: %j", err, response);
});


