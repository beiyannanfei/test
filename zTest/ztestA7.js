var doc = {
	"_id": ("565fad1341ebc5d03e9e37ea"),
	"exchangeId": "56540a5fa02716ee1c50e8b2",
	"prizeId": "5654092a33c51602268b4567",
	"openId": "oxWE2s2CBfAEmLE4ef-6mm3epSio",
	"yyyappId": "wx44490bbc768ce355",
	"planId": "1257",
	"channelId": "1782",
	"wxToken": "33580c57d3c86f07",
	"activeName": "多个购买",
	"user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13B143 MicroMessenger/6.3.7 NetType/WIFI Language/zh_CN",
	"localIp": "103.16.126.89",
	"tvmId": "13021111164",
	"mallOpenId": "o3gwwt8dQK-EHQ-eOefnq1EOLXDA",
	"mallToken": "ec917ca8d9f0",
	"prizePrice": 1,
	"auth_phone": "13021111164",
	"buyNum": 1,
	"totalPrice": 1,
	"prizeData": {
		"prize_name": "多个消费码购买",
		"needScore": 1,
		"prizeType": 2,
		"prize_img": "http://q.cdn.mtq.tvm.cn/Public/user-uploads/images/20151124/1448347925-30561.jpg",
		"expire_in": null,
		"notice_url": "http://www.image.baidu.com",
		"wx_coupon_id": null,
		"prize_value": null,
		"url": "http://www.jd.com",
		"consume_url": null,
		"user_data": null
	},
	"userData": {
		"city": "West",
		"province": "Beijing",
		"sex": "1",
		"openid": "oxWE2s2CBfAEmLE4ef-6mm3epSio",
		"country": "CN",
		"resTime": "1449110801",
		"status": "ok",
		"headimgurl": "http://wx.qlogo.cn/mmopen/bnkRWEqVUN5wSIgZbfMoBzYUmr5tyCQhe3dG77RSEeCJ3JPNJanzBWkJLSc63EzS3s9L1jG5icb4eM0ojP2LnZicTeL3dyrnbW",
		"ret": "0",
		"nickname": "过客"
	},
	"dateTime": ("2015-12-03T02:46:43.451Z"),
	"wxOrderState": 3,
	"out_trade_no": "2015120310464394005055306479",
	"package": "prepay_id=wx20151203104643b8b0bd991c0409036663"
}

var userPay = 0;    //用户余额支付价格
var wxPay = 0;      //用户微信支付价格

var userDayPay = +(doc.userDayPay || 0);
var totalPrice = +(doc.totalPrice || 0);

if (userDayPay > 0) {
	if (userDayPay > totalPrice) {
		userPay = totalPrice;
	}
	else {
		userPay = userDayPay;
		wxPay = totalPrice - userDayPay;
	}
}
else {
	wxPay = totalPrice;
}

var UPDOC = {
	userPay: userPay,
	wxPay: wxPay
};

console.log(UPDOC);