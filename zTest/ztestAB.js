var order = {
	"first_categoryid": "cat10000000",
	"secend_categoryid": "cat10000033",
	"third_categoryid": "cat22836924",
	"first_categoryname": "数码",
	"secend_categoryname": "时尚数码",
	"third_categoryname": "智能穿戴设备",
	"order_date": "2016-03-22 10:38:18",
	"order_id": "10370570399",
	"product_id": "8006723725",
	"product_num": 1,
	"product_name": "大粤传奇 Smart 智能手表 蓝牙QQ微信同步 可插SIM卡 苹果安卓通用",
	"_feedback": "0",
	"product_price": 468,
	"commission": 4.68,
	"website": "GOME",
	"from": "gome",
	"expect_cash": null,
	"back_time": 1,
	"_id": {"$id": "56f0b508fb62cd042500002d"},
	"sendRedDate": "2016-03-22T02:38:19.000Z",
	"redState": 1
}
offset = 0
order = {
	"first_categoryid": "cat10000000",
	"secend_categoryid": "cat10000033",
	"third_categoryid": "cat22836924",
	"first_categoryname": "数码",
	"secend_categoryname": "时尚数码",
	"third_categoryname": "智能穿戴设备",
	"order_date": "2016-03-22 10:38:18",
	"order_id": "10370570399",
	"product_id": "8006723725",
	"product_num": 1,
	"product_name": "大粤传奇 Smart 智能手表 蓝牙QQ微信同步 可插SIM卡 苹果安卓通用",
	"_feedback": "0",
	"product_price": 468,
	"commission": 4.68,
	"website": "GOME",
	"from": "gome",
	"expect_cash": null,
	"back_time": 1,
	"_id": {"$id": "56f0b508fb62cd042500002d"},
	"sendRedDate": "2016-03-22T02:38:19.000Z",
	"redState": 1
}
uniqueId = undefined
offset = 0
order = {
	"first_categoryid": "cat10000018",
	"secend_categoryid": "cat21445746",
	"third_categoryid": "cat21445752",
	"first_categoryname": "家装建材",
	"secend_categoryname": "墙地材料",
	"third_categoryname": "净化除味",
	"order_date": "2016-03-22 11:32:15",
	"order_id": "10370740657",
	"product_id": "8000419402",
	"product_num": 1,
	"product_name": "锐巢活性炭冰箱除味炭包150克冰箱除味剂清洁除臭竹炭活性炭包去除异味剂消毒",
	"_feedback": "1111a",
	"product_price": 18.8,
	"commission": 0.564,
	"website": "GOME",
	"from": "gome",
	"expect_cash": null,
	"back_time": null,
	"_id": {"$id": "56f0c004fb62cd0425000032"},
	"sendRedDate": "2016-03-22T03:32:15.000Z",
	"redState": 1
}
offset = 1


var a = {
	"topic": "cps_occur_oder",
	"value": {
		first_categoryid: 'cat10000000',
		secend_categoryid: 'cat10000033',
		third_categoryid: 'cat22836924',
		first_categoryname: '数码',
		secend_categoryname: '时尚数码',
		third_categoryname: '智能穿戴设备',
		order_date: '2016-03-22 10:38:18',
		order_id: '10370570399',
		product_id: '8006723725',
		product_num: 1,
		product_name: '大粤传奇 Smart 智能手表 蓝牙QQ微信同步 可插SIM卡 苹果安卓通用',
		_feedback: '0',
		product_price: 468,
		commission: 4.68,
		website: 'GOME',
		from: 'gome',
		expect_cash: null,
		back_time: true,
		_id: {'$id': '56f0b508fb62cd042500002d'}
	},
	"offset": 0,
	"partition": 0,
	"key": []
}
var b = {
	"topic": "cps_occur_oder",
	"value": {
		first_categoryid: 'cat10000018',
		secend_categoryid: 'cat21445746',
		third_categoryid: 'cat21445752',
		first_categoryname: '家装建材',
		secend_categoryname: '墙地材料',
		third_categoryname: '净化除味',
		order_date: '2016-03-22 11:32:15',
		order_id: '10370740657',
		product_id: '8000419402',
		product_num: 1,
		product_name: '锐巢活性炭冰箱除味炭包150克冰箱除味剂清洁除臭竹炭活性炭包去除异味剂消毒',
		_feedback: '1111a',
		product_price: 18.8,
		commission: 0.564,
		website: 'GOME',
		from: 'gome',
		expect_cash: null,
		back_time: null,
		_id: {'$id': '56f0c004fb62cd0425000032'}
	},
	"offset": 1,
	"partition": 0,
	"key": []
}

console.log(JSON.parse(b.value));