var exec = require('child_process').exec;
var MD5 = require("crypto-js/md5");
var util = require("util");
var httpUtil = require("./superagent.js");


var url = '127.0.0.1:6004/open/financial/huaren/order';
var orderInfo = {
	orderId: +new Date(),
	timeStamp: ~~(+new Date() / 1000),
	userId: "wyq_test",
	mobile: "18810776836",
	productID: "测试2016",
	productName: "wyq测试",
	repayTime: "3天",
	incomeRate: "11.00",
	money: 60001,
	loantypeName: "到期后一次性还息还本",
	feedback: "orEt2t9TyFNWO3XX5E-YTj61Hd0U|onC35t2vYse-MA-UPzvOt7HbMHzE|wx33dc1a5264b4e846|888"
};

var rkey = "tVmInInG&fIrStP2P";
var checkStr = util.format("%s:%s:%s:%s:%s",
	orderInfo.orderId, orderInfo.timeStamp, orderInfo.userId, orderInfo.money, rkey);
var checkSign = MD5(MD5(checkStr).toString()).toString();
orderInfo.sign = checkSign;

httpUtil.httpPost(url, orderInfo, function (err, response) {
	console.log("err: %j, response: %j", err, response);
});

/*

 var param = util.format('orderId=%s&timeStamp=%s&userId=%s&mobile=%s&productID=%s&productName=%s&repayTime=%s&incomeRate=%s&money=%s&loantypeName=%s&feedback=%s&sign=%s', orderInfo.orderId, orderInfo.timeStamp, orderInfo.userId, orderInfo.mobile, orderInfo.productID, orderInfo.productName, orderInfo.repayTime, orderInfo.incomeRate, orderInfo.money, orderInfo.loantypeName, orderInfo.feedback, orderInfo.sign);

 var cmd = util.format('curl "%s" -H Accept-Encoding:gzip -d "%s"', url, param);
 console.log(cmd);
 exec(cmd, function (err, stdout, stderr) {
 console.log(err);
 console.log(stdout);
 });
 */
