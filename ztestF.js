exports.sendHuaRenRed = function (order) {      //华人理财发送红包
	var redInfo = order.redInfo;
	if (!redInfo) {
		var UPDOC = {
			//"redInfo.errState": financialErrMap.no_channelInfo,
			needFx: 0,
			"redInfo.SrcCv": 0,
			"redInfo.spend": 0,
			"redInfo.firstSpend": 0,
			"redInfo.cV": 0,
			valid: 1,
			//reason: mWxFinancial.getReasonByErrState(financialErrMap.no_channelInfo)
		};
		//return exports.updateHuaRenOrder(order, UPDOC);
	}
	if (order.money < typeConfig.hrFinancial.needMoney) {   //投资金额不足
		var UPDOC = {
			"redInfo.errState": financialErrMap.insufficient_investment_amount,
			needFx: 0,
			"redInfo.SrcCv": 0,
			"redInfo.spend": 0,
			"redInfo.firstSpend": 0,
			"redInfo.cV": 0,
			valid: 0,
			reason: mWxFinancial.getReasonByErrState(financialErrMap.insufficient_investment_amount)
		};
		return exports.updateHuaRenOrder(order, UPDOC);
	}
	var tOpenId = redInfo.tOpenId;
	var yOpenId = redInfo.openId;
	var yyyappId = redInfo.yyyappId;
	var mobile = order.mobile;
	if (!tOpenId || !yOpenId || !yyyappId || !mobile) {
		UPDOC = {
			"redInfo.errState": financialErrMap.param_incomplete,
			valid: 1,
			reason: mWxFinancial.getReasonByErrState(financialErrMap.param_incomplete)
		};
		return exports.updateHuaRenOrder(order, UPDOC);
	}
	var UPDOC = {valid: 1};
	async.auto({
		checkIsFx: function (cb) {      //是否已经返现
			checkIsFxUser(tOpenId, mobile, function (err, isFx) {
				if (!!err) {
					return cb(err);
				}
				if (isFx) {     //已经返过现
					UPDOC["redInfo.errState"] = financialErrMap.multiple_purchase;
					UPDOC["needFx"] = 0;
					UPDOC["redInfo.SrcCv"] = 0;
					UPDOC["redInfo.spend"] = 0;
					UPDOC["redInfo.firstSpend"] = 0;
					UPDOC["redInfo.cV"] = 0;
					UPDOC["valid"] = 0;
					UPDOC["reason"] = mWxFinancial.getReasonByErrState(financialErrMap.multiple_purchase);
					exports.updateHuaRenOrder(order, UPDOC);
					return cb(isFx);
				}
				return cb(null, isFx);
			});
		},
		getCv: function (cb) {      //获取用户余额
			exports.getUserCv(yyyappId, yOpenId, function (err, cv) {
				if (!!err) {
					UPDOC["redInfo.errState"] = financialErrMap.netErr;
					UPDOC["redInfo.SrcCv"] = 0;
					UPDOC["redInfo.spend"] = 0;
					UPDOC["redInfo.firstSpend"] = 0;
					UPDOC["redInfo.cV"] = 0;
					UPDOC["reason"] = mWxFinancial.getReasonByErrState(financialErrMap.netErr);
					exports.updateHuaRenOrder(order, UPDOC);
					return cb(err);
				}
				if (cv <= 0) {     //余额不足情况
					UPDOC["redInfo.errState"] = financialErrMap.user_daypay_notenough;
					UPDOC["needFx"] = 0;
					UPDOC["redInfo.SrcCv"] = cv;
					UPDOC["redInfo.spend"] = 0;
					UPDOC["redInfo.firstSpend"] = 0;
					UPDOC["redInfo.cV"] = cv;
					UPDOC["reason"] = mWxFinancial.getReasonByErrState(financialErrMap.user_daypay_notenough);
					exports.updateHuaRenOrder(order, UPDOC);
					return cb("user_daypay_notenough");
				}
				return cb(null, cv);
			});
		},
		minusCv: ["checkIsFx", "getCv", function (cb, datas) {     //扣除用户余额
			var userCv = datas.getCv;       //用户余额
			var needFx = order.needFx;      //需要返现
			var spend = needFx;
			if (userCv < needFx) {
				spend = userCv;
			}
			exports.minusUserCv(yyyappId, yOpenId, order._id.toString(), userCv, spend, "华人金融返现扣除余额", function (err, curlCv) {
				if (!!err) {
					UPDOC["redInfo.errState"] = financialErrMap.netErr;
					UPDOC["redInfo.SrcCv"] = userCv;
					UPDOC["redInfo.spend"] = spend;
					UPDOC["redInfo.firstSpend"] = spend;
					UPDOC["redInfo.cV"] = userCv;
					UPDOC["reason"] = mWxFinancial.getReasonByErrState(financialErrMap.netErr);
					exports.updateHuaRenOrder(order, UPDOC);
					return cb(err);
				}
				UPDOC["redInfo.SrcCv"] = userCv;
				UPDOC["redInfo.spend"] = spend;
				UPDOC["redInfo.firstSpend"] = spend;
				UPDOC["redInfo.cV"] = curlCv;
				return cb(null, {curlCv: curlCv, spend: spend});
			});
		}],
		sendRed: ["minusCv", function (cb, datas) {        //发送红包
			var spend = datas.minusCv.spend;    //扣除的用户余额
			var act_name = "去理财得返现活动";    //提现15元到账。订单来源xxx
			var remark = util.format("返现%s元到账。订单来源: 华人金融。", (+spend / 100).toFixed(2));
			exports.sendHb(order._id, yyyappId, yOpenId, spend, tOpenId, act_name, remark, order.orderId, function (err, data) {
				if (!!err) {
					UPDOC["redInfo.errState"] = financialErrMap.sendRedError;
					UPDOC["reason"] = mWxFinancial.getReasonByErrState(financialErrMap.sendRedError);
					exports.updateHuaRenOrder(order, UPDOC);
					return cb(err);
				}
				UPDOC["redInfo.errState"] = financialErrMap.success;
				return cb(null, data);
			});
		}],
		addFxUser: ["sendRed", function (cb, datas) {       //将发现用户加入黑名单
			exports.addFxUser(tOpenId, mobile, function (err, data) {
				return cb(null, data || err);
			});
		}]
	}, function (err, results) {
		console.log("[%j] husRenOrder sendHuaRenRed err: %j, results: %j, order: %j", new Date().toLocaleString(), err, results, order);
		if (!!err) {
			return;
		}
		makeHrRankInfo(order, results.minusCv.spend);
		if (UPDOC["redInfo.errState"] == financialErrMap.success) {
			sendMsg(order, results.minusCv.spend);      //发送短信

			order.yyyapp_id = order.redInfo.yyyappId;   //发送到严杰
			order.yyy_openid = order.redInfo.openId;
			order.open_id = order.redInfo.tOpenId;
			order.product_name = order.productName;
			var tempUpDoc = deepCopy(UPDOC);
			tempUpDoc.firstSpend = UPDOC["redInfo.firstSpend"];
			mUnionMallRed.sendRedInfo2yj(order, tempUpDoc);
		}
		return exports.updateHuaRenOrder(order, UPDOC);
	});
};