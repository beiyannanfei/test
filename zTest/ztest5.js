var doc = {
	//"_id": ObjectId("569a2530c958ebbf3565bb8e"),
	"wxOrderState": 6,
	"exchangeId": "5685017b585c78e65fa6f47a",
	"prizeId": "568f798bf3802c5e1a8b4567",
	"openId": "oGqqkwJKTStWWUgvr7j396asNepc",
	"yyyappId": "wxdde8d49a9600d9e2",
	"planId": "265ff241-afa8-11e5-a7d2-9c37f401990e",
	"channelId": "1777",
	"wxToken": "0be2d360c83f776f",
	"activeName": "播报兑换区",
	"user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_2 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13C75 MicroMessenger/6.3.9 NetType/WIFI Language/zh_CN",
	"localIp": "123.121.3.149",
	"tvmId": "20134560026",
	"mallOpenId": "o3gwwtywI4ItQFTkXruv97zB3vLo",
	"mallToken": "ec917ca8d9f0",
	"prizePrice": 1989.9999999999998,
	"auth_phone": "13693558702",
	"buyNum": 1,
	"totalPrice": 1989.9999999999998,
	"prizeData": {
		"prize_name": "曲奇巧克力棒饼干",
		"needScore": 5,
		"prizeType": 1,
		"prize_img": "https://q-cdn.mtq.tvm.cn/Public/user-uploads/images/20160108/1452243319-13991.png",
		"expire_in": "3",
		"notice_url": "",
		"wx_coupon_id": null,
		"prize_value": null,
		"url": null,
		"consume_url": null,
		"user_data": [
			{
				"key": "name",
				"value": "联系人"
			},
			{
				"key": "phoneNum",
				"value": "联系电话",
				"reg": "/^0?1[3|4|5|7|8][0-9]\\d{8}$/"
			},
			{
				"key": "address",
				"value": "地址"
			}
		],
		"marketValue": 2200
	},
	"userData": {
		"city": "Chaoyang",
		"nickname": "刘子赫",
		"sex": "1",
		"openid": "oGqqkwJKTStWWUgvr7j396asNepc",
		"country": "CN",
		"resTime": "1452942630",
		"sourceCache": "slave",
		"status": "ok",
		"headimgurl": "http://wx.qlogo.cn/mmopen/FLH8ib4WVmLlObhX8IJicyHAHO2oxuBqAEoopt3jpBibicokj8qrteTNSOO3gcRv57iap85osvTU7tb5PYMPST2tK62fL2CicyfvY1",
		"province": "Beijing",
		"ret": "0"
	},
	//"dateTime": ISODate("2016-01-16T11:10:40.687Z"),
	"u_name": "刘志强",
	"u_phone": "13810875873",
	"u_address": "高碑店东A区40－5",
	"u_province": "北京市",
	"u_city": "北京市",
	"u_county": "朝阳区",
	"out_trade_no": "2016011619104001279192813672"
	//userDayPay:0
}

console.log(Math.ceil(+doc.prizePrice * (doc.buyNum || 1) || 0) - doc.userDayPay || 0);
console.log(Math.ceil(+doc.prizePrice * (doc.buyNum || 1) || 0))
console.log(doc.userDayPay || 0)
console.log(doc.userDayPay)
console.log(Math.ceil(+doc.prizePrice * (doc.buyNum || 1) || 0) - doc.userDayPay);




