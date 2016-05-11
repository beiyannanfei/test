var order = {
	"_id": ObjectId("5719a6713fed30590c7a0748"),
	"from": "jd",
	"order_id": "17500934169",
	"jd_totalMoney": 39,
	"order_date": "2016-04-22 12:00:37",
	"jd_enabled": 0,
	"_feedback": "orEt2t1p8h9RrRR-sQMihUwV4fw0|wx1d54de8b6a59cc34|oWo_7t7fjziLF1ZljM1nX8K5ZmSw|10084720331|964660",
	"status": 2,
	"fromstatus": 2,
	"open_id": "orEt2t1p8h9RrRR-sQMihUwV4fw0",
	"yyyapp_id": "wx1d54de8b6a59cc34",
	"yyy_openid": "oWo_7t7fjziLF1ZljM1nX8K5ZmSw",
	"mall_id": "964660",
	"first_categoryid": "1320",
	"secend_categoryid": "1583",
	"third_categoryid": "1595",
	"product_id": "10084720331",
	"sku_id": "10084720331",
	"product_num": 1,
	"product_price": 39,
	"commission": 28.08,
	"create_time": "2016-04-22 12:20:01",
	"product_name": "谷绿园 肉松蛋糕1kg/箱 早餐肉松饼鸡蛋糕点心",
	"product_img": "https://q-cdn.mtq.tvm.cn/cps//public/user-uploads/images/20160422/1461293619-13677.jpg",
	"expect_commission": 28.08,
	"expect_cash": 2200,
	"back_time": 2592000,
	"action": "update",
	"uniqueId": "5719a671ca7b4e7b688b4567",
	"isBlack": 0,
	"sendRedDate": ISODate("2016-05-22T04:00:37Z"),
	"redState": 2,
	"dateTime": ISODate("2016-04-22T04:20:01.357Z"),
	"dateTimeStr": "2016-04-22 12:20:01",
	"userInfo": {
		"uid": "51050333",
		"bind_id": "1111",
		"pgroup_id": "0",
		"type": "5",
		"openid": "orEt2t1p8h9RrRR-sQMihUwV4fw0",
		"fakeid": "145940250115397",
		"username": "DX",
		"nickname": "DX",
		"signature": "",
		"avatar_url": "http://wx.qlogo.cn/mmopen/0gGy532gxEpRJPKgSwP9D8sjB5Avm3GSzUmppljJz6kicIKTZNklicuch2NIRo6nbH9EoPA7tmricKoibfic66P8Ngl07MI3nvGlB/0",
		"country": "中国",
		"province": "四川",
		"city": "广安",
		"add_time": "1459402501",
		"activity_id": "0",
		"weixin_last_time": "1459402501",
		"bonus": "0",
		"source": "2",
		"unionid": null,
		"sex": "1",
		"updatetime": "1461219150",
		"subscribe_time": "0",
		"address": null,
		"weixin_avatar_url": "http://wx.qlogo.cn/mmopen/0gGy532gxEpRJPKgSwP9D8sjB5Avm3GSzUmppljJz6kicIKTZNklicuch2NIRo6nbH9EoPA7tmricKoibfic66P8Ngl07MI3nvGlB/0"
	},
	"redInfo": {
		"yyyappId": "wx1d54de8b6a59cc34",
		"openId": "oWo_7t7fjziLF1ZljM1nX8K5ZmSw",
		"tOpenId": "orEt2t1p8h9RrRR-sQMihUwV4fw0",
		"firstSpend": 2200,
		"spend": 2200,
		"cV": 10210,
		"RefundNum": 0
	},
	"isFirstFull": 1,
	"beforeStatus": 0
}

//1.订单金额（所有订单的总金额含未支付，取消，退货等）单位分
var ddje = (order.product_price || 0) * 100 * (order.product_num || 1);
//2.已付款金额
if (2 == order.status) {
	var yfkje = (order.product_price || 0) * 100 * (order.product_num || 1);
}
//3.货到付款金额
//无法判断
//4.待付款金额（下单未付款）
if (0 == order.status || 1 == order.status) {
	var ddfkje = (order.product_price || 0) * 100 * (order.product_num || 1);
}
//5.已取消
if (3 == order.status) {
	var yqxje = (order.product_price || 0) * 100 * (order.product_num || 1);
}
//6.已退款
if (4 == order.status) {
	var ytkje = (order.product_price || 0) * 100 * (order.product_num || 1);
}
//7.已返现金额
if (2 == order.redState) {
	var yfxje = order.redInfo ? (order.redInfo.firstSpend ? order.redInfo.firstSpend : (order.redInfo.spend || 0)) : 0;
}
//8.未返现金额（已付款未返现）
if (2 == order.status) {
	var wfxje = order.expect_cash - (order.redInfo ? (order.redInfo.firstSpend ? order.redInfo.firstSpend : (order.redInfo.spend || 0)) : 0);
}

{
	//未返现有情况如下
	//1. 用户余额不足 计算方法如下
	if (2 == order.status && 2 == order.redState) {
		var yebzwfxje = order.expect_cash - (order.redInfo ? (order.redInfo.firstSpend ? order.redInfo.firstSpend : (order.redInfo.spend || 0)) : 0);
	}

	//2. 红包发放错误
	if (2 == order.status && 9 == order.redState) {
		var hbfscwje = order.redInfo ? (order.redInfo.firstSpend ? order.redInfo.firstSpend : (order.redInfo.spend || 0)) : order.expect_cash;
	}
}
//9.付款比例
//未知
