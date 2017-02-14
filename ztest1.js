"use strict";
var moment = require("moment");
var util = require("util");


var buildNoticeDate = function (templateId, order, nickName, shopName) {
	let templateMap = {
		//IT科技-IT软件与服务  用户支付通知消息模版
		"OPENTM200787222": {
			first: {    //抬头
				value: util.format("微信支付成功通知\n支付码：%s\n订单编号：%s", order.payCode, order.outTradeNo),
				color: "#000000"
			},
			keyword1: {   //消费日期
				value: moment(new Date(order.createTime)).format("YYYY-MM-DD HH:mm:ss"),
				color: "#000000"
			},
			keyword2: {   //消费金额
				value: (order.money / 100).toFixed(2) + "元",
				color: "#173177"
			},
			keyword3: {   //消费店铺
				value: shopName,
				color: "#000000"
			},
			remark: {     //结束语
				value: "\n多谢您的惠顾！\n",
				color: "#000000"
			}
		},
		//IT科技-IT软件与服务  收银员支付通知模版
		"OPENTM205297594": {
			first: {     //抬头
				value: util.format("您收到一笔成功支付订单\n付款用户：%s\n支付码：%s\n提交时间：%s",
					order.nickName || nickName, order.payCode, moment(new Date(order.createTime)).format("YYYY-MM-DD HH:mm:ss")),
				color: "#000000"
			},
			keyword1: {   //订单编号
				value: order.outTradeNo,
				color: "#000000"
			},
			keyword2: {   //订单金额
				value: (order.money / 100).toFixed(2) + "元",
				color: "#173177"
			},
			remark: {     //结束语
				value: "\n多谢您的惠顾！\n",
				color: "#000000"
			}
		}
	};
	return templateMap[templateId];
};

var buildRefundNoticeData = function (templateId, refundlog, nickName, shopName) {
	let status = refundlog.status;    //订单状态
	let refundTempMap = {
		//IT科技-IT软件与服务  退款申请通知模版
		"OPENTM400503586": {
			first: {    //抬头
				value: util.format("您为用户: %s 发起了一笔退款申请", nickName),
				color: "#000000"
			},
			keyword1: {   //退单编号
				value: refundlog.outRefundNo,
				color: "#000000"
			},
			keyword2: {   //退款金额
				value: (refundlog.refundFee / 100).toFixed(2) + "元",
				color: "#000000"
			},
			remark: {
				value: util.format("商户名称: %s\n订单金额：%s\n订单编号：%s\n\n零钱支付预计到账时间为20分钟,银行卡支付预计到账时间为1-3个工作日\n",
					shopName, (refundlog.money / 100).toFixed(2) + "元", refundlog.outTradeNo),
				color: "#000000"
			}
		},
		//IT科技-IT软件与服务  退款结果通知模版
		"OPENTM405487309": {
			first: {    //抬头
				value: status == 6 ? util.format("您为用户: %s 发起的退款已成功办理", nickName) : util.format("您为用户: %s 发起的退款执行失败", nickName),
				color: "#000000"
			},
			keyword1: {   //退款时间
				value: moment(new Date(refundlog.createTime)).format("YYYY-MM-DD HH:mm:ss"),
				color: "#000000"
			},
			keyword2: {   //订单编号
				value: refundlog.outTradeNo,
				color: "#000000"
			},
			keyword3: {   //订单类型
				value: " ",
				color: "#000000"
			},
			keyword4: {   //退款金额
				value: (refundlog.refundFee / 100).toFixed(2) + "元",
				color: "#000000"
			},
			remark: {
				value: status == 6 ? util.format("退款编号：%s\n申请原因：%s\n订单金额：%s\n\n退款操作已完成,请知悉!\n",
					refundlog.outRefundNo, refundlog.reason, (refundlog.money / 100).toFixed(2) + "元") :
					util.format("退款编号：%s\n订单金额：%s\n失败原因：%s\n\n退款操作失败,请知悉!\n",
						refundlog.outRefundNo, (refundlog.money / 100).toFixed(2) + "元",
						"退款失败或转入代发，退款到银行发现用户的卡作废或者冻结了，导致原路退款银行卡失败，资金回流到商户的现金帐号，需要商户人工干预，通过线下或者财付通转账的方式进行退款。"),
				color: "#000000"
			}
		}
	};
	return refundTempMap[templateId];
};

var refundlog = {
	status: 11,
	outRefundNo: "123456",
	refundFee: 12,
	money:147,
	outTradeNo: "147852",
	createTime: new Date(),
	reason: "退款原因"
};

var order = {
	nickName: "北艳难菲",
	payCode: "2589",
	createTime: new Date(),
	outTradeNo: "a123",
	money: 123
};

console.log(buildRefundNoticeData("OPENTM400503586", refundlog, "bynf", "bynf店铺"));