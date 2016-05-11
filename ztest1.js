/**
 * Created by wyq on 2016/3/22.
 * 联盟商城订单获取
 */

var config = require("../../config.js");
var kafka = require('kafka-node');
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;
var topic = "cps_occur_oder";
var client = new Client(config.kafka.connectionStr);
var topics = [{topic: topic}];
var options = {autoCommit: true, fetchMaxBytes: 100 * 1024 * 1024};
var consumer = new HighLevelConsumer(client, topics, options);


var dbUtils = require('../../mongoSkin/mongoUtils.js');
var unionOrderCollection = new dbUtils("unionorder");
var unionOrderCollectionSlave = new dbUtils("unionorder", 1);
var exec = require('child_process').exec;
var _ = require('underscore');
var async = require('async');
var moment = require('moment');
var typeConfig = require("../../routes/typeConfig.js");
var redis_client = require('../../redis/redis_client.js');
var lotteryApi = require("../../interface/lotteryApi.js");
var redisClient = redis_client.redisClient();
var newredisClient = redis_client.redisClient();
var mUnionOrderPaySate = typeConfig.unionOrderPaySate;
var mUnionMallRed = require("../../routes/unionMallRed.js");
var mWxhb = require("../../routes/wxhb.js");
var util = require("util");

console.log("[%j] unionMallOrderConsumer start *******", new Date().toLocaleString());

consumer.on('message', function (message) {
	console.log("[%j] unionMallOrderConsumer get message: %j", new Date().toLocaleString(), message);
	redisClient.LPUSH("unionMallOrderConsumer", JSON.stringify(message), function (err, data) {
		if (!!err) {
			console.log("[%j] unionMallOrderConsumer LPUSH err: %j, message: %j", new Date().toLocaleString(), err, message);
		}
		else {
			console.log("[%j] unionMallOrderConsumer push to redis success offset: %j", new Date().toLocaleString(), message.offset);
		}
	});
});

consumer.on('error', function (err) {
	console.error("[%j] unionMallOrderConsumer err: %j, financialDaemon will restart 10mins later", new Date().toLocaleString(), err);
	setTimeout(function () {    //kafka出错后587s后重启脚本(587为600以下比较合适的一个质数)
		console.log("[%j] exec forever restart /opt/mall_play/tools/cron/financialDaemon.js", new Date().toLocaleString());
		var cmd = "forever restart /opt/mall_play/tools/cron/financialDaemon.js";
		exec(cmd, function (err, stdout, stderr) {
			console.log("[%j] unionMallOrderConsumer forever restart err: %j, stdout: %j, stderr: %j", new Date().toLocaleString(), err, stdout, stderr);
		});
	}, 587 * 1000);
});

function saveOrder(orderStr) {      //保存订单到数据库
	var order = JSON.parse(orderStr.value);
	if (!order || "null" == order) {
		return console.log("[%j] saveOrder order null, orderStr: %j", new Date().toLocaleString(), orderStr);
	}
	var order_date = order.order_date;      //下单日期
	var back_time = +order.back_time || 0;  //返现延时
	var uniqueId = order.uniqueId;          //订单唯一性id
	var tOpenId = order.open_id;          //用户openid
	var yyy_openid = order.yyy_openid;        //用户摇一摇平台openId
	if (!tOpenId || !yyy_openid || !uniqueId) {
		return console.log("[%j] tOpenId or yyy_openid or uniqueId null, orderStr: %j", new Date().toLocaleString(), orderStr);
	}

	order.product_num ? (order.product_num = +order.product_num) : "";
	order.product_price ? (order.product_price = +order.product_price) : "";
	order.commission ? (order.commission = +order.commission) : "";
	order.expect_cash ? (order.expect_cash = +order.expect_cash) : "";
	order.back_time ? (order.back_time = +order.back_time) : "";
	order.status ? (order.status = +order.status) : (order.status = 0);
	order.fromstatus ? (order.fromstatus = +order.fromstatus) : (order.fromstatus = 0);

	if (order.action == "update") {     //订单更新
		return updateOrder(order, orderStr.offset);
	}
	mUnionMallRed.setNewUser(order);    //设置新用户信息
	var sendRedDate = new Date(new Date(order_date).getTime() + back_time * 1000);
	order.sendRedDate = sendRedDate;    //发送红包的时间
	order.redState = typeConfig.unionMallOrderState.wait;   //红包状态
	if (order.expect_cash <= 0 || order.status != mUnionOrderPaySate.pay) {   //无需返现
		order.redState = typeConfig.unionMallOrderState.not_need_cash;
	}
	order.dateTime = new Date();
	order.dateTimeStr = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');

	delete order._id;
	order._id = new dbUtils.ObjectID();

	async.auto({
		checkUnique: function (cb) {        //检测订单是否已经存在
			findOrderByuniqueId(uniqueId, function (err, data) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer checkUnique err: %j, order: %j, offset: %j", new Date().toLocaleString(), err, order, orderStr.offset);
					return cb(err);
				}
				if (data) { //订单已经存在
					console.log("[%j] unionMallOrderConsumer checkUnique data exists, order: %j, uniqueId: %j, offset: %j", new Date().toLocaleString(), order, uniqueId, orderStr.offset);
					return cb(uniqueId + " order already exists");
				}
				return cb(null, orderStr.offset);
			});
		},
		/*isFirstOrder: function (cb) {   //是不是首单
		 if (order.redState != typeConfig.unionMallOrderState.wait) {    //未支付
		 return cb(null, "not pay");
		 }
		 //if (order.fromstatus != typeConfig.lifanState[order.from]) {    //不是立返状态
		 // return cb(null, "not liFan");
		 // }
		 if (order.from != "yhd") {      //一号店立返
		 return cb(null, "not from yhd");
		 }
		 var key = "union_mall_order_first_list";
		 var field = yyy_openid;
		 redisClient.HINCRBY(key, field, 1, function (err, data) {
		 if (!!err) {
		 console.log("[%j] unionMallOrderConsumer isFirstOrder err: %j, key: %j, field: %j", new Date().toLocaleString(), err, key, field);
		 }
		 if (data == 1) {    //首单
		 order.sendRedDate = new Date();
		 }
		 return cb(null, data);
		 });
		 },
		 minusUserCv: function (cb) {        //扣除用户余额
		 minusCv(order, function (err, payInfo) {
		 if (!!err || !payInfo) {
		 return cb(null, payInfo);
		 }
		 order.redInfo = payInfo;
		 return cb(null, payInfo);
		 });
		 },*/
		doPreCheck: ["checkUnique", function (cb) {     //发红包前获取参数
			preCheck(order, function (err, payInfo) {
				if (!!err || !payInfo) {
					return cb(null, payInfo);
				}
				order.redInfo = payInfo;
				return cb(null, payInfo);
			});
		}],
		sendRed: ["doPreCheck", function (cb) {      //发红包
			var redInfo = order.redInfo;
			if (!redInfo) {
				return cb(null, data);
			}
			var sendMoneyNum = redInfo.firstSpend;
			sendWxRed(order, function (err, data) {
				if (!!err) {
					order.redState = typeConfig.unionMallOrderState.sendRedError;
					return cb(null, "send red err: " + err);
				}
				order.redState = typeConfig.unionMallOrderState.success;
				if (sendMoneyNum < order.expect_cash) {
					order.redState = typeConfig.unionMallOrderState.partSuccess;
				}
				return cb(null, "success");
			});
		}],
		saveOrder: ["sendRed", function (cb) {      //保存订单
			unionOrderCollection.save(order, function (err, data) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer saveOrder err: %j, order: %j, offset: %j", new Date().toLocaleString(), err, order, orderStr.offset);
					return cb(err);
				}
				return cb(null, data);
			});
		}]
	}, function (err, results) {
		if (!!err) {
			return console.log("[%j] unionMallOrderConsumer_err: %j, order: %j, uniqueId: %j, offset: %j", new Date().toLocaleString(), err, order, uniqueId, orderStr.offset);
		}
		satisticsBuyNumPerProduct(order);
		mUnionMallRed.sendMsg(order, order.status);
		return console.log("[%j] ================= save unionMallOrderConsumer success, uniqueId: %j, offset: %j, _id: %j", new Date().toLocaleString(), uniqueId, orderStr.offset, results.saveOrder._id.toString());
	});
}

function preCheck(order, cb) {       //发送红包前检测，返回红包参数
	if (order.redState != typeConfig.unionMallOrderState.wait) {    //不是待返现状态
		return cb ? cb(null, null) : "";
	}
	if (!order.open_id || !order.yyyapp_id || !order.yyy_openid) {  //参数不全
		return cb ? cb(null, null) : "";
	}
	var payInfo = {
		yyyappId: order.yyyapp_id,
		openId: order.yyy_openid,
		tOpenId: order.open_id
	};
	var userRefundNum = 0;      //用户欠款
	var userCv = 0;             //用户余额
	async.auto({
		getRefundNum: function (cb) {       //获取用户欠款
			var key = "union_mall_order_refund_red_money";
			var field = order.open_id;
			redisClient.HGET(key, field, function (err, value) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-preCheck-getRefundNum err: %j, order: %j", new Date().toLocaleString(), err, order);
					return cb(err);
				}
				userRefundNum = +(value || 0);
				return cb(null, value);
			});
		},
		getUserCv: function (cb) {      //获取用户余额
			lotteryApi.getVirtualCurrency(payInfo.yyyappId, payInfo.openId, function (err, num) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-preCheck-getUserCv err: %j, order: %j", new Date().toLocaleString(), err, order);
					return cb(err);
				}
				userCv = +num || 0;
				return cb(null, num);
			});
		},
		calcMoney: ["getRefundNum", "getUserCv", function (cb) {     //计算各种参数
			if (userCv < 100) {
				return cb("user_daypay_notenough");
			}
			if (userRefundNum <= 0) {       //用户无欠款
				payInfo.RefundNum = 0;
				payInfo.spend = order.expect_cash;     //返现金额
				return cb(null, payInfo);
			}
			var newValue = 0;   //设置最新欠款金额
			if (order.expect_cash <= value) {      //返现金额小于欠款
				newValue = value - order.expect_cash;
				payInfo.spend = 0;
				payInfo.RefundNum = order.expect_cash;
			}
			else {      //返现金额大于欠款
				newValue = 0;
				payInfo.RefundNum = value;
				payInfo.spend = (order.expect_cash - value >= 100) ? (order.expect_cash - value) : 0;
			}
			var key = "union_mall_order_refund_red_money";
			var field = order.open_id;
			redisClient.HSET(key, field, newValue, function (err, o) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-calcMoney-HSET err: %j, order: %j, payInfo: %j", new Date().toLocaleString(), err, order, payInfo);
					return cb(err);
				}
				return cb(null, o);
			});
		}],
		minusCv: ["calcMoney", function (cb) {       //扣除余额
			if (payInfo.spend <= userCv) {  //红包金额小于余额，一次全反
				payInfo.firstSpend = payInfo.spend;
			}
			else {
				payInfo.firstSpend = userCv;
			}
			var mallId = order._id.toString();
			var note = typeConfig.fromMap[order.from] + ":" + order.order_id + " 返现扣除";
			lotteryApi.minusVirtualCurrency(payInfo.yyyappId, payInfo.openId, mallId, userCv, payInfo.spend, note, function (err, data) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-calcMoney-minusCv err: %j, order: %j, payInfo: %j", new Date().toLocaleString(), err, order, payInfo);
					return cb(err);
				}
				payInfo.cV = +(data.body ? data.body.virtualCurrency || 0 : 0);
				return cb(null, data);
			});
		}]
	}, function (err, results) {
		console.log("[%j] unionMallOrderConsumer-preCheck err: %j, results: %j, order: %j", new Date().toLocaleString(), err, results, order);
		if (!!err) {
			return cb(err);
		}
		return cb(null, payInfo);
	});
}

function sendWxRed(order, cb) {     //发送微信红包
	var act_name = "去购物得返现活动";
	var remark = util.format("返现%s元到账。订单来源:%s %s %s", (+order.redInfo.firstSpend / 100).toFixed(2), typeConfig.fromMap[order.from], order.order_id, order.product_name);
	mWxhb.sendHb(1, order._id.toString(), order.yyyapp_id, order.yyy_openid, +order.redInfo.firstSpend, order.open_id, act_name, remark, function (err, doc) {
		if (!!err) {
			console.log("[%j] unionMallOrderConsumer-sendWxRed err: %j, order: %j", new Date().toLocaleString(), err, order);
			return cb(err);
		}
		return cb(null, doc)
	});
}

function updateOrder(order, offset) {       //订单更新
	var uniqueId = order.uniqueId;          //订单唯一性id

	var unionOrder;
	async.auto({
		findOrder: function (cb) {      //获取已存order
			findOrderByuniqueId(uniqueId, function (err, data) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-findOrderByuniqueId err: %j, order: %j, offset: %j", new Date().toLocaleString(), err, order, offset);
					return cb(err);
				}
				unionOrder = data;
				return cb(null, data);
			});
		},
		/*isFirstOrder: ["findOrder", function (cb) {
		 if (!unionOrder) {      //订单不存在
		 return cb("update_order_not_exists");
		 }

		 if (order.status != mUnionOrderPaySate.pay) {   //未支付
		 return cb(null, "not pay " + order.status);
		 }

		 //if (order.fromstatus != typeConfig.lifanState[unionOrder.from]) {    //不是立返状态
		 // return cb(null, "not liFan");
		 // }
		 if (unionOrder.from != "yhd") {     //一号店立返
		 return cb(null, "not from yhd");
		 }

		 if (unionOrder.expect_cash <= 0) {
		 return cb(null, "expect_cash=0");
		 }
		 var key = "union_mall_order_first_list";
		 var field = unionOrder.yyy_openid;
		 redisClient.HINCRBY(key, field, 1, function (err, data) {
		 if (!!err) {
		 console.log("[%j] unionMallOrderConsumer-updateOrder-isFirstOrder err: %j, order: %j, offset: %j",
		 new Date().toLocaleString(), err, order, offset);
		 return cb(null, "mongoerr: " + err);
		 }
		 if (data == 1) {    //首单
		 order.sendRedDate = new Date();
		 }
		 return cb(null, data);
		 });
		 }],*/
		minusUserCv: ["findOrder", function (cb) {      //扣除用户余额
			if (!unionOrder) {      //订单不存在
				return cb("update_order_not_exists");
			}
			if (unionOrder.expect_cash <= 0 ||      //无需返现情况
				order.status == mUnionOrderPaySate.refund ||
				order.status == mUnionOrderPaySate.cancel) {
				return cb(null, "not minusUserCv");
			}
			if (order.status != mUnionOrderPaySate.pay) {
				return cb(null, "no pay");
			}
			if (unionOrder.status == mUnionOrderPaySate.pay) {
				return cb(null, "already pay");
			}






			if (unionOrder.redInfo) {   //订单存在支付参数，说明已经扣除
				return cb(null, "already minusUserCv");
			}
			minusCv(unionOrder, function (err, o) {
				if (!!err || !o) {
					return cb(null, o);
				}
				order.redInfo = o;
				return cb(null, o);
			});
		}],
		revertCv: ["findOrder", function (cb) {     //恢复用户余额及欠款
			if (!unionOrder) {      //订单不存在
				return cb("update_order_not_exists");
			}
			revertUserCv(unionOrder, order, function (err, data) {
				if (!!err || !data) {
					return cb(null, data);
				}
				order["redInfo.revertUserCv"] = "finish";
				return cb(null, data);
			});
		}],
		updateOrder: ["isFirstOrder", "minusUserCv", "revertCv", function (cb) {      //更新订单
			if (!unionOrder) {      //订单不存在则执行保存逻辑
				return cb("update_order_not_exists");
				/*var sendRedDate = new Date(new Date(order.order_date).getTime() + (order.back_time || 0) * 1000);
				 order.sendRedDate = sendRedDate;
				 order.redState = typeConfig.unionMallOrderState.wait;   //红包状态
				 if (order.expect_cash <= 0) {   //无需返现
				 order.redState = typeConfig.unionMallOrderState.not_need_cash;
				 }
				 order.dateTime = new Date();
				 order.dateTimeStr = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
				 delete order._id;
				 unionOrderCollection.save(order, function (err, data) {
				 if (!!err) {
				 console.log("[%j] unionMallOrderConsumer-updateOrder-save err: %j, order: %j, offset: %j", new Date().toLocaleString(), err, order, offset);
				 return cb(err);
				 }
				 return cb(null, data);
				 });*/
			}
			delete order._id;
			delete order.order_date;
			delete order.back_time;
			if (unionOrder.redState != typeConfig.unionMallOrderState.success) {    //如果红包未发送成功更改红包状态
				order.redState = typeConfig.unionMallOrderState.wait;   //红包状态
				if (unionOrder.expect_cash <= 0 || order.status != mUnionOrderPaySate.pay) {   //无需返现
					order.redState = typeConfig.unionMallOrderState.not_need_cash;
				}
			}
			var UPDOC = {$set: order};

			unionOrderCollection.updateById(unionOrder._id, UPDOC, function (err, data) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-updateOrder-updateById err: %j, order: %j, unionOrder: %j, offset: %j",
						new Date().toLocaleString(), err, order, unionOrder, offset);
					return cb(err);
				}
				if (unionOrder.status == mUnionOrderPaySate.pay
					&& (order.status == mUnionOrderPaySate.refund || order.status == mUnionOrderPaySate.cancel)) {    //退货状态
					//退款订单处理流程
					dealRefundOrder(unionOrder);
				}
				return cb(null, data);
			});
		}]
	}, function (err, results) {
		if (!!err) {
			return console.log("[%j] unionMallOrderConsumer updateOrder err: %j, order: %j, unionOrder: %j, offset: %j",
				new Date().toLocaleString(), err, order, unionOrder, offset);
		}
		mUnionMallRed.sendMsg(unionOrder, order.status);
		return console.log("[%j] ================= update unionMallOrderConsumer success offset: %j, results: %j", new Date().toLocaleString(), offset, results);
	});
}

function findOrderByuniqueId(uniqueId, cb) {        //根据uniqueId获取order
	if (!uniqueId) {
		return cb("param_incomplete");
	}
	unionOrderCollectionSlave.findOne({uniqueId: uniqueId}, function (err, data) {
		return cb(err, data);
	});
}

function popOrder() {
	newredisClient.BRPOP("unionMallOrderConsumer", 0, function (err, data) {
		if (data && _.isArray(data) && data.length > 1) {
			var doc = JSON.parse(data[1]);
			saveOrder(doc);
		}
		setTimeout(popOrder, 500);
	});
}

function dealRefundOrder(order) {
	if (order.from == "self") {     //自营的不处理退货欠款
		return;
	}
	if (order.redState != typeConfig.unionMallOrderState.success) {     //未发红包不处理
		return;
	}
	if (!order.redInfo || !order.redInfo.spend) {       //没有红包信息
		return;
	}
	var key = "union_mall_order_refund_red_money";
	var field = order.open_id;
	var value = order.redInfo.spend || 0;
	redisClient.HINCRBY(key, field, value, function (err, o) {
		console.log("[%j] dealRefundOrder err: %j, o: %j, field: %j, value: %j, id: %j",
			new Date().toLocaleString(), err, o, field, value, order._id.toString());
	});
}

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
		getRefundNum: function (cb) {       //获取用户欠款
			var key = "union_mall_order_refund_red_money";
			var field = order.open_id;
			redisClient.HGET(key, field, function (err, value) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-minusCv-HGET err: %j, order: %j", new Date().toLocaleString(), err, order);
					return cb(err);
				}
				value = +(value || 0);
				if (value <= 0) {   //欠款为0
					payInfo.spend = order.expect_cash;     //返现金额
					payInfo.RefundNum = 0;                  //扣除用户欠款金额
					return cb(null, value);
				}
				var newValue = 0;   //设置最新欠款金额
				if (order.expect_cash <= value) {      //返现金额小于欠款
					newValue = value - order.expect_cash;
					payInfo.spend = 0;
					payInfo.RefundNum = order.expect_cash;
				}
				else {      //返现金额大于欠款
					newValue = 0;
					payInfo.RefundNum = value;
					payInfo.spend = (order.expect_cash - value >= 100) ? (order.expect_cash - value) : 0;
				}
				redisClient.HSET(key, field, newValue, function (err, o) {
					if (!!err) {
						console.log("[%j] unionMallOrderConsumer-minusCv-HSET err: %j, newValue: %j, order: %j", new Date().toLocaleString(), err, newValue, order);
						return cb(err);
					}
					return cb(null, value);
				});
			});
		},
		getUserCv: function (cb) {          //获取用户余额
			lotteryApi.getVirtualCurrency(payInfo.yyyappId, payInfo.openId, function (err, num) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-getUserCv err: %j, order: %j, payInfo: %j", new Date().toLocaleString(), err, order, payInfo);
					return cb(err);
				}
				userCv = +num || 0;
				if (userCv < 100) {
					console.log("[%j] unionMallOrderConsumer-getUserCv less userCv: %j, order: %j, payInfo: %j", new Date().toLocaleString(), userCv, order, payInfo);
					return cb("user_daypay_notenough");
				}
				return cb(null, userCv);
			});
		},
		minusCv: ["getRefundNum", "getUserCv", function (cb) {      //扣除用户余额
			if (payInfo.spend > userCv) {
				payInfo.spend = userCv;
			}
			var mallId = order._id.toString();
			var note = typeConfig.fromMap[order.from] + ":" + order.order_id + " 返现扣除";
			lotteryApi.minusVirtualCurrency(payInfo.yyyappId, payInfo.openId, mallId, userCv, payInfo.spend, note, function (err, data) {
				if (!!err) {
					console.log("[%j] unionMallOrderConsumer-minusCv err: %j, order: %j, payInfo: %j, userCv: %j", new Date().toLocaleString(), err, order, payInfo, userCv);
					return cb(err);
				}
				payInfo.cV = +(data.body ? data.body.virtualCurrency || 0 : 0);
				return cb(null, data);
			});
		}]
	}, function (err, results) {
		console.log("[%j] unionMallOrderConsumer minusCv err: %j, results: %j, order: %j", new Date().toLocaleString(), err, results, order);
		if (!!err) {
			return cb(err);
		}
		return cb(null, payInfo);
	});
}

function revertUserCv(order, updateDoc, cb) {   //当用户退款或者取消订单且余额已扣恢复用户余额
	var redInfo = order.redInfo;
	if (!redInfo) {     //没有支付参数
		return cb ? cb(null, null) : "";
	}
	if (order.redState == typeConfig.unionMallOrderState.success) {     //红包已发
		return cb ? cb(null, null) : "";
	}
	if (-1 == [typeConfig.unionOrderPaySate.unknown,
			typeConfig.unionOrderPaySate.noPay,
			typeConfig.unionOrderPaySate.pay].indexOf(order.status)) {   //原订单状态不是0、1、2
		return cb ? cb(null, null) : "";
	}
	if (updateDoc.status != typeConfig.unionOrderPaySate.cancel &&
		updateDoc.status != typeConfig.unionOrderPaySate.refund) {      //新订单状态不是取消或退款
		return cb ? cb(null, null) : "";
	}
	if (redInfo.revertUserCv == "finish") {     //当用户退款或取消订单且已恢复用户余额不再继续
		return cb ? cb(null, null) : "";
	}
	var spendUserCv = redInfo.spend;    //扣除的用户余额
	var refundUserCv = redInfo.RefundNum;   //扣除的用户欠款

	var key = "union_mall_order_refund_red_money";
	var field = order.open_id;
	async.parallel({
		revertCv: function (cb) {       //恢复余额
			var mallId = order._id.toString() + "_revert";
			var note = typeConfig.fromMap[order.from] + ":" + order.order_id + " 返现扣除返还";
			lotteryApi.addVirtualCurrency(redInfo.yyyappId, redInfo.openId, mallId, spendUserCv, 0, note, function (err, data) {
				if (!!err) {
					console.log("[%j] revertUserCv-revertCv err: %j, order: %j", new Date().toLocaleString(), err, order);
					return cb(err);
				}
				return cb(null, data);
			});
		},
		revertRefund: function (cb) {   //恢复欠款
			redisClient.HINCRBY(key, field, refundUserCv, function (err, data) {
				if (!!err) {
					console.log("[%j] revertUserCv-revertRefund err: %j, order: %j", new Date().toLocaleString(), err, order);
					return cb(err);
				}
				return cb(null, data);
			});
		}
	}, function (err, resulsts) {
		console.log("[%j] revertUserCv err: %j, resulsts: %j", new Date().toLocaleString(), err, resulsts);
		if (!!err) {
			return cb ? cb(err) : "";
		}
		return cb ? cb(null, "finish") : "";
	});
}

function satisticsBuyNumPerProduct(order) {     //统计一个人谋个产品的购买数量(退货、取消不减)
	var from = order.from || "";                    //来源
	var openId = order.yyy_openid || "";            //yOpenId
	var buyNum = order.product_num || 1;            //购买数量
	var productId = order.product_id || "";         //产品id

	var key = "satisticsBuyNumPerProduct_" + from;
	var field = moment(new Date()).format('YYYYMMDD') + "_" + productId + "_" + openId;

	redisClient.HINCRBY(key, field, +buyNum, function (err, data) {
		if (!!err) {
			console.log("[%j] satisticsBuyNumPerProduct err: %j, order: %j", new Date().toLocaleString(), err, order);
		}
	});
}

popOrder();