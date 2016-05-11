function buildReportParam(doc) {
	var param = {prizeInfo: {}, winerInfo: {}};
	param.prizeInfo.id = doc.prizeId;
	param.prizeInfo.type = +doc.prizeData.prizeType;
	param.prizeInfo.pic = doc.prizeData.prize_img;
	param.prizeInfo.name = doc.prizeData.prize_name;
	param.prizeInfo.buyNum = doc.buyNum;
	param.prizeInfo.marketValue = doc.prizeData.marketValue || 0;
	//param.prizeInfo.remark = doc.remark;
	if (doc.prizeData.jdLink) {
		param.prizeInfo.jdLink = doc.prizeData.jdLink;
	}
	if (doc.prizeData.expire_in) {
		param.prizeInfo.expireDay = +doc.prizeData.expire_in;
	}
	if (doc.prizeData.notice_url) {
		param.prizeInfo.gainUrl = doc.prizeData.notice_url;
	}
	if (doc.prizeData.wx_coupon_id) {
		param.prizeInfo.card_id = doc.prizeData.wx_coupon_id
	}
	if (doc.prizeData.prize_value) {
		param.prizeInfo.price = doc.prizeData.prize_value
	}
	if (doc.prizeData.url) {
		param.prizeInfo.link = doc.prizeData.url
	}
	if (doc.prizeData.consume_url) {
		param.prizeInfo.consume_url = doc.prizeData.consume_url
	}
	if (doc.prizeData.user_data) {
		param.prizeInfo.fields = doc.prizeData.user_data
	}
	if (doc.prizeData.skuId) {
		param.prizeInfo.sku_id = doc.prizeData.skuId;
		param.prizeInfo.gtvmid = doc.prizeData.gtvmid;
		param.prizeInfo.sku_name = doc.prizeData.attr_name;
	}
	param.winerInfo.openId = doc.userData.openid;
	param.winerInfo.name = doc.userData.nickname;
	param.winerInfo.icon = doc.userData.headimgurl;
	param.winerInfo.sex = +doc.userData.sex;
	param.winerInfo.province = doc.userData.province || "";
	param.winerInfo.country = doc.userData.country || "";
	param.winerInfo.city = doc.userData.city || "";
	param.winerInfo.realIp = doc.localIp || "";
	param.winerInfo.user_agent = doc.user_agent || "";


	param.yyyappid = doc.yyyappId;
	param.tvmId = doc.tvmId;
	param.scheme_id = doc.planId;
	param.channelId = doc.channelId;
	param.activityType = doc.type == 2 ? 5 : (1000 + doc.type || 0);
	param.token = doc.wxToken;
	param.lotteryId = doc.gConfId;
	param.create_timestamp = new Date(doc.dateTime).getTime();
	param.createTime = param.create_timestamp;
	param.state = 2;

	if (doc.u_name && doc.u_phone && doc.u_address) {
		param.address = {};
		param.address.name = doc.u_name;
		param.address.phoneNum = doc.u_phone;
		param.address.address = doc.u_address;

		doc.u_province ? (param.address.province = doc.u_province) : "";
		doc.u_city ? (param.address.city = doc.u_city) : "";
		doc.u_county ? (param.address.county = doc.u_county) : "";
	}
	return param;
}