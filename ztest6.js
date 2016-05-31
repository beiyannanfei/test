var _ = require("underscore");
var data = ["kafuka-queue-ttye", "{\"message\":{\"yyyappid\":\"wx44490bbc768ce355\",\"code\":\"5e61e171c455578eb84bd21c72b0ade9\",\"sigExpire\":1464397369,\"clientOrderId\":\"1464397345293\",\"userVirtualCurrency\":0,\"spend\":null,\"note\":\"测试设置\",\"topicAction\":\"minus\",\"clientTime\":1464397369667,\"backTopic\":\"fanli_mall_ttye_callback\",\"clientName\":\"返利商城\",\"clientBusinessName\":\"测试\",\"sig\":\"3512c902871bad1425edce0ea4c722b8\"}}"];
console.log(data.length);
if (data && _.isArray(data) && data.length > 1) {
	var doc = JSON.parse(data[1]);
	console.log(doc);
}