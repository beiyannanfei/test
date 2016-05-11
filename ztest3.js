var order = {
	"_id": ObjectId("570f0991f98b69e646ef6d80"),        //陈杰方订单Id
	"order_item_id": 1427504189,                        //订单下子编号(可能为null)
	"first_categoryid": "5146",                         //一级分类ID(可能为null)
	"first_categoryname": "零食/坚果/特产",               //一级分类名称(可能为null)
	"order_id": "8168040048204",                        //订单Id
	"order_date": "2016-04-14 11:04:18",                //订单时间
	"product_id": "10306753",                           //产品id
	"pm_info_id": "11591319",                           //无解释
	"product_name": "好想你 野酸味金丝枣280克*5袋",        //商品名称
	"from": "yhd",                                      //订单来源(对照关系见附录1 fromMap)
	"product_num": 1,                                   //商品数量
	"product_price": 100,                               //商品单价
	"fromstatus": 38,                                   //平台状态
	"commission": 32,                                   //佣金
	"_feedback": "orEt2txk4pQwdmPD8lC3kmEbNfRE|wxd02cb3b642133e89|oDeHbsqXT2XxN1llnE-zP0MroOB4|11591319|964660",    //暂时没用
	"open_id": "orEt2txk4pQwdmPD8lC3kmEbNfRE",          //天天电视宝openId
	"yyyapp_id": "wxd02cb3b642133e89",                  //
	"yyy_openid": "oDeHbsqXT2XxN1llnE-zP0MroOB4",       //摇一摇平台openId
	"mall_id": "964660",                                //刘磊商城Id(可能为null)
	"back_time": 2592000,                               //暂时没用
	"expect_cash": 2500,                                //期待返现(单位：分)
	"expect_commission": 32,                            //预期佣金(单位：元)
	"create_time": "2016-04-14 11:08:01",               //订单拉取时间
	"product_img": "http://d6.yihaodianimg.com/N06/M06/18/1E/ChEbu1UbvcyAd0TDAAK9klR0-iY87600.jpg",     //商品图片
	"status": 2,                                        //订单状态(对照关系见附录2 unionOrderPaySate)
	"action": "update",                                 //暂时没用
	"uniqueId": "570f0991ca7b4e980f8b4567",             //高春玲方订单Id
	"sendRedDate": ISODate("2016-05-14T03:04:18Z"),     //暂时没用
	"redState": 12,                                     //红包状态(对照关系见附录3 unionMallOrderState)
	"dateTime": ISODate("2016-04-14T03:08:01.844Z"),    //订单时间(二次发送红包金额时间为此时间延后30天)
	"dateTimeStr": "2016-04-14 11:08:01",
	"redInfo": {                                        //红包信息(注：该字段可能整体缺失，请按照0处理即可)
		"yyyappId": "wxd02cb3b642133e89",               //同yyyapp_id
		"openId": "oDeHbsqXT2XxN1llnE-zP0MroOB4",       //同yyy_openid
		"tOpenId": "orEt2txk4pQwdmPD8lC3kmEbNfRE",      //同open_id
		"firstSpend": 994,                              //首次返现金额(注：请对此字段进行非空验证，如果此字段不存在请使用spend字段)
		"spend": 994,                                   //兼容字段(注：请对此字段进行非空验证，如果此字段不存在取值0)
		"cV": 0,                                        //暂时没用
		"RefundNum": 0                                  //下单时的用户欠款(注：请对此字段进行非空验证，如果此字段不存在取值0)
	}
}

/*
 特殊说明
 用户首次返现金额 = order.redInfo ? ((order.redInfo.firstSpend || order.redInfo.spend) - (order.redInfo.RefundNum || 0)) : 0;
 用户二次返现金额 = order.expect_cash - (order.redInfo ? (order.redInfo.firstSpend || order.redInfo.spend) : 0);
 用户全部返现金额 = order.expect_cash - (order.redInfo ? (order.redInfo.RefundNum || 0) : 0);
 */
var fromMap = {  //附录1. 订单来源和联盟商家名称对应关系
	yhd: "一号店",
	gome: "国美",
	wangxin: "网信理财",
	self: "天天电视宝商城"      //刘磊商城
}
var unionOrderPaySate = {    //附录2. 联盟订单支付状态(key值为unionOrder中的from字段值)
	unknown: 0,     //未知
	noPay: 1,       //未支付
	pay: 2,         //已支付
	cancel: 3,      //取消
	refund: 4       //退货
}

var unionMallOrderState = {      //附录3. 联盟订单返现状态
	"wait": 1,                          //等待返现
	"success": 2,                       //返现成功
	"param_incomplete": 3,              //参数空缺
	"no_user": 4,                       //用户不存在
	"no_channelInfo": 5,                //无频道信息
	"too_many_channelInfo": 6,          //频道信息过多
	"netErr": 7,                        //获取余额失败、扣除余额失败
	"user_daypay_notenough": 8,         //用户余额不足
	"sendRedError": 9,                  //红包发送错误
	"not_need_cash": 10,                //无需返现
	"other": 11,                        //为系统错误，内容未知(只有一个可能会出现系统错误且此时还没扣除余额)
	"partSuccess": 12                   //部分发放成功
}