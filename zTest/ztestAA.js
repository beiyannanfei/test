a = {
	"id": "VE56b2b44f0fe69cec678c6e48",
	"goodsId": "PR56b2b3e90fe69cec678c6e47",
	"openId": "oxWE2s_3y2RcuEb1r6XSp2u9rZnQ",
	"yyyappId": "wx44490bbc768ce355",
	"mallOpenId": "om8H8sywLVo950fyUy8VtZODD2EE",
	"sigExpire": "1454552184",
	"sig": "e29a3581d6be544879495e3d7883d1c5",
	"user": {
		"city": "East",
		"nickname": "北艳难菲",
		"sex": "1",
		"openid": "oxWE2s_3y2RcuEb1r6XSp2u9rZnQ",
		"country": "CN",
		"resTime": "1454552431",
		"sourceCache": "slave",
		"status": "ok",
		"headimgurl": "http://wx.qlogo.cn/mmopen/IUaibdeWqdlyu2nEoIvk7J9icvYEl2Yh79r4yibgq0VXG6kWiaSNgibgRxkkrXN8riawRxnMQ6TZrX77k3PcsGXn20dHxicpdoOV3hm",
		"ret": "0",
		"province": "Beijing"
	},
	"u_name": "王艳强",
	"u_phone": "18810776836",
	"u_address": "123",
	"u_province": "北京市",
	"u_city": "北京市",
	"u_county": "东城区",
	"auth_phone": "18810776836",
	"buyNum": "1",
	"remark": "",
	"useDayPay": "0"
}

function getSaleNum(id, goodConfData, openId, cb) {
	var totalSaleField = "totalSaleNum_" + goodConfData.goodsId;  //这个商品的总销量
	var planSaleField = "planSaleNum_" + id + "_" + goodConfData.goodsId;     //该商品在这个配置中的销量
	var userSaleField = "userSaleNum_" + id + "_" + goodConfData.goodsId + "_" + openId;      //用户在本玩法中本商品的销量
	async.parallel({
		totalSale: function (cb) {
			stockControl.getCount(totalSaleField, function (count) {
				return cb(null, count);
			});
		},
		planSale: function (cb) {
			stockControl.getCount(planSaleField, function (count) {
				return cb(null, count);
			});
		},
		skuSale: function (cb) {
			if (!goodConfData.sku) {
				return cb(null, null);
			}
			var datas = {};
			async.eachSeries(_.keys(goodConfData.sku), function (item, cb) {
				var skuSaleField = planSaleField + "_" + item;
				stockControl.getCount(skuSaleField, function (count) {
					datas[item] = count;
					return cb(null);
				});
			}, function (err) {
				return cb(null, datas);
			});
		},
		userSale: function (cb) {
			stockControl.getCount(userSaleField, function (count) {
				return cb(null, count);
			});
		}
	}, function (err, results) {
		var totalSaleNum = results.totalSale || 0;      //总销量
		var planSaleNum = results.planSale || 0;        //方案销量
		var userSaleNum = results.userSale || 0;        //用户销量
		var skuSaleNum = results.skuSale;               //sku销量
		if (goodConfData.sku && !planSaleNum) {
			for (var index in skuSaleNum) {
				planSaleNum += +skuSaleNum[index] || 0;
			}
		}
		return cb(err, {
			totalSaleNum: totalSaleNum,
			planSaleNum: planSaleNum,
			userSaleNum: userSaleNum,
			skuSaleNum: skuSaleNum
		});
	});
}

