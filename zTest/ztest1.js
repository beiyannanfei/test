var doc = {
	gConfId: id,                //商品配置id
	goodsId: goodsId,           //商品详情id    <=> prizeId_planId
	prizeId: goodsInfo.prize_id,
	planId: goodsInfo.planInfo.scheme_id,
	openId: openId,
	yyyappId: yyyappId,
	channelId: goodsInfo.planInfo.channel_id,
	wxToken: goodsInfo.planInfo.wx_token,
	user_agent: user_agent,
	localIp: req.localIp,
	tvmId: goodsInfo.planInfo.tvm_id,
	mallOpenId: mallOpenId,
	mallToken: config.tvmMallToken,
	prizePrice: confInfo.price,
	auth_phone: auth_phone,
	buyNum: buyNum,
	totalPrice: buyNum * confInfo.price,
	userDayPay: userDayPay,     //用户余额
	type: +confInfo.type,
	isBlack: confInfo.isBlack || 0,
	remark: remark,
	prizeData: {
		prize_name: goodsInfo.prize_name,
		needScore: confInfo.coinsNum,
		prizeType: +goodsInfo.type,
		prize_img: goodsInfo.prize_img,
		expire_in: goodsInfo.expire_in,
		notice_url: goodsInfo.notice_url,
		wx_coupon_id: goodsInfo.wx_coupon_id,
		prize_value: goodsInfo.prize_value,
		url: goodsInfo.url,
		consume_url: goodsInfo.consume_url,
		user_data: goodsInfo.user_data,
		marketValue: Math.floor((confInfo.originalPrice || 0) * 100),
		jdLink: confInfo.originalLink || ""
	},
	userData: userData,
	dateTime: new Date(),
	isGood: true            //标志位(用于和老数据的区分)
};