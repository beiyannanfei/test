var schema = module.exports = new mongoose.Schema({
	shopId: {type: String, required: true},       //门店id
	openId: {type: String, required: true},       //用户openId
	appId: {type: String, required: true},        //商户appId
	mchId: {type: String, required: true},        //商户号
	money: {type: Number, required: true},        //订单金额
	outTradeNo: {type: String, required: true},   //商户订单号
	beforeStatue: {type: Number, required: true}, //之前订单状态
	newStatue: {type: Number, required: true},    //最新订单状态
	changeTime: {type: Date, default: Date.now},  //变化时间
	paylog: {type: mongoose.Schema.Types.ObjectId, ref: "Wxpaylog"}   //微信订单id
});