function minusCv(order, cb) {       //扣除用户余额,返回支付参数
	if (order.expect_cash <= 0 ||
		order.status == mUnionOrderPaySate.cancel ||
		order.status == mUnionOrderPaySate.refund) {     //无需返现
		return cb ? cb(null, null) : "";
	}

	if (!order.open_id || !order.yyyapp_id || !order.yyy_openid) {
		return cb ? cb(null, null) : "";
	}

	var payInfo = {
		yyyappId: order.yyyapp_id,
		openId: order.yyy_openid,
		tOpenId: order.open_id
	};
	var userCv = 0; //用户余额
	async.auto({
		getUserCv: function (cb) {      //获取用户余额
			lotteryApi.getVirtualCurrency(payInfo.yyyappId, payInfo.openId, function (err, num) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-getUserCv err: %j, order: %j, payInfo: %j", new Date().toLocaleString(), err, order, payInfo);
					return cb(err);
				}
				userCv = +num || 0;
				if (userCv < 100) {
					console.log("[%j] unionMallOrderConsumer-getUserCv less userCv: %j, order: %j, payInfo: %j", new Date().toLocaleString(), userCv, order, payInfo);
					payInfo.firstSpend = 0;
					payInfo.spend = 0;
					payInfo.RefundNum = 0;
					payInfo.cV = userCv;
					return cb("user_daypay_notenough");
				}
				return cb(null, userCv);
			});
		},
		minusCv: ["getUserCv", function (cb) {      //扣除用户余额
			if (order.expect_cash <= userCv) {          //余额大于应返现，一次全反
				payInfo.firstSpend = order.expect_cash;
				payInfo.spend = order.expect_cash;
			}
			else {
				payInfo.firstSpend = userCv;
				payInfo.spend = userCv;
			}
			var mallId = order._id.toString();
			var note = typeConfig.fromMap[order.from] + ":" + order.order_id + " 返现扣除";
			lotteryApi.minusVirtualCurrency(payInfo.yyyappId, payInfo.openId, mallId, userCv, +payInfo.firstSpend, note, function (err, data) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-minusCv err: %j, order: %j, payInfo: %j, userCv: %j", new Date().toLocaleString(), err, order, payInfo, userCv);
					return cb(err);
				}
				payInfo.cV = +(data.body ? data.body.virtualCurrency || 0 : 0);
				return cb(null, data);
			});
		}],
		getRefundNum: ["minusCv", function (cb) {
			var key = "union_mall_order_refund_red_money";
			var field = order.open_id;
			redisClient.HGET(key, field, function (err, value) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-minusCv-HGET err: %j, order: %j", new Date().toLocaleString(), err, order);
					return cb(err);
				}
				value = +(value || 0);
				if (value <= 0) {   //欠款为0
					payInfo.RefundNum = 0;                  //扣除用户欠款金额
					return cb(null, value);
				}
				var newValue = 0;   //设置最新欠款金额
				if (payInfo.firstSpend <= value) {      //返现金额小于欠款
					newValue = value - payInfo.firstSpend;
					payInfo.RefundNum = payInfo.firstSpend;
				}
				else {      //返现金额大于欠款
					newValue = 0;
					payInfo.RefundNum = value;
				}
				redisClient.HSET(key, field, newValue, function (err, o) {
					if (!!err) {
						console.log("[%j] unionMallOrderConsumer-minusCv-HSET err: %j, newValue: %j, order: %j", new Date().toLocaleString(), err, newValue, order);
						return cb(err);
					}
					return cb(null, value);
				});
			});
		}]
	}, function (err, results) {
		console.log("[%j] unionMallOrderConsumer minusCv err: %j, results: %j, order: %j", new Date().toLocaleString(), err, results, order);
		if (!!err) {
			if (err == "user_daypay_notenough") {   //用户余额不足
				return cb(null, payInfo);
			}
			return cb(err);
		}
		return cb(null, payInfo);
	});
}

function start() {
	var a = 0;
	a ? (console.log("============")) : "";
}

start();
