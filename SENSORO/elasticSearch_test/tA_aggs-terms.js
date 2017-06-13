/**
 * Created by wyq on 17/6/13.
 *聚合联系
 */
"use strict";
const client = require("./esClient.js").esClient;

function toSave() {
	let condtion = {
		index: "cars",
		type: "transactions",
		body: [
			{"index": {}},
			{price: 10000, color: "red", make: "honda", sold: "2014-10-28"},
			{"index": {}},
			{price: 20000, color: "red", make: "honda", sold: "2014-11-05"},
			{"index": {}},
			{price: 30000, color: "green", make: "ford", sold: "2014-05-18"},
			{"index": {}},
			{price: 15000, color: "blue", make: "toyota", sold: "2014-07-02"},
			{"index": {}},
			{price: 12000, color: "green", make: "toyota", sold: "2014-08-19"},
			{"index": {}},
			{price: 20000, color: "red", make: "honda", sold: "2014-11-05"},
			{"index": {}},
			{price: 80000, color: "red", make: "bmw", sold: "2014-01-01"},
			{"index": {}},
			{price: 25000, color: "blue", make: "ford", sold: "2014-02-12"}
		]
	};
	client.bulk(condtion, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response: %j", response);
		response = {
			"took": 246,
			"errors": false,
			"items": [
				{
					"create": {
						"_index": "cars",
						"_type": "transactions",
						"_id": "AVygI2XeXc1i0y_01Iid",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				},
				{
					"create": {
						"_index": "cars",
						"_type": "transactions",
						"_id": "AVygI2XeXc1i0y_01Iie",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				},
				{
					"create": {
						"_index": "cars",
						"_type": "transactions",
						"_id": "AVygI2XeXc1i0y_01Iif",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				},
				{
					"create": {
						"_index": "cars",
						"_type": "transactions",
						"_id": "AVygI2XeXc1i0y_01Iig",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				},
				{
					"create": {
						"_index": "cars",
						"_type": "transactions",
						"_id": "AVygI2XeXc1i0y_01Iih",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				},
				{
					"create": {
						"_index": "cars",
						"_type": "transactions",
						"_id": "AVygI2XeXc1i0y_01Iii",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				},
				{
					"create": {
						"_index": "cars",
						"_type": "transactions",
						"_id": "AVygI2XeXc1i0y_01Iij",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				},
				{
					"create": {
						"_index": "cars",
						"_type": "transactions",
						"_id": "AVygI2XeXc1i0y_01Iik",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				}
			]
		}
	});
}

function aggColors() {  //根据颜色聚合
	let condition = {
		index: "cars",
		type: "transactions",
		body: {
			size: 0,  //将返回记录数设置为 0 来提高查询速度
			aggs: {
				popular_colors: {
					terms: {
						field: "color"
					}
				}
			}
		}
	};
	client.search(condition, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response: %j", response);
		response = {  //执行结果
			"took": 99,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {"total": 8, "max_score": 0, "hits": []},
			"aggregations": {
				"popular_colors": {
					"doc_count_error_upper_bound": 0,
					"sum_other_doc_count": 0,
					"buckets": [
						{"key": "red", "doc_count": 4},
						{"key": "blue", "doc_count": 2},
						{"key": "green", "doc_count": 2}
					]
				}
			}
		}
	});
}

function toAggsColor_AvgPrice() {
	let condition = {
		index: "cars",
		type: "transactions",
		body: {
			size: 0,
			aggs: {
				colors: {
					terms: {    //按颜色分组统计
						field: "color"
					},
					aggs: {   //统计每种颜色的均价
						avg_price: {
							avg: {
								field: "price"
							}
						}
					}
				}
			}
		}
	};
	client.search(condition, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response= %j", response);
		response = {
			"took": 2,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {"total": 8, "max_score": 0, "hits": []},
			"aggregations": {
				"colors": {
					"doc_count_error_upper_bound": 0,
					"sum_other_doc_count": 0,
					"buckets": [
						{"key": "red", "doc_count": 4, "avg_price": {"value": 32500}},
						{"key": "blue", "doc_count": 2, "avg_price": {"value": 20000}},
						{"key": "green", "doc_count": 2, "avg_price": {"value": 21000}}]
				}
			}
		}
	});
}

function toAggsColor_AvgPrice_make() {
	let condition = {
		index: "cars",
		type: "transactions",
		body: {
			size: 0,
			aggs: {
				colors: {
					terms: {    //按颜色分组统计
						field: "color"
					},
					aggs: {   //统计每种颜色的均价
						avg_price: {
							avg: {
								field: "price"
							}
						},
						make: {
							terms: {  //每个颜色的汽车制造商的分布
								field: "make"
							}
						}
					}
				}
			}
		}
	};
	client.search(condition, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response= %j", response);
		response = {
			"took": 8,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {"total": 8, "max_score": 0, "hits": []},
			"aggregations": {
				"colors": {
					"doc_count_error_upper_bound": 0,
					"sum_other_doc_count": 0,
					"buckets": [
						{
							"key": "red",
							"doc_count": 4,
							"avg_price": {"value": 32500},
							"make": {
								"doc_count_error_upper_bound": 0,
								"sum_other_doc_count": 0,
								"buckets": [
									{"key": "honda", "doc_count": 3},
									{"key": "bmw", "doc_count": 1}
								]
							}
						},
						{
							"key": "blue",
							"doc_count": 2,
							"avg_price": {"value": 20000},
							"make": {
								"doc_count_error_upper_bound": 0,
								"sum_other_doc_count": 0,
								"buckets": [
									{"key": "ford", "doc_count": 1},
									{"key": "toyota", "doc_count": 1}
								]
							}
						},
						{
							"key": "green",
							"doc_count": 2,
							"avg_price": {"value": 21000},
							"make": {
								"doc_count_error_upper_bound": 0,
								"sum_other_doc_count": 0,
								"buckets": [
									{"key": "ford", "doc_count": 1},
									{"key": "toyota", "doc_count": 1}
								]
							}
						}
					]
				}
			}
		}
	});
}

function toAggsColor_AvgPrice_make_min_max_price() {
	let condition = {
		index: "cars",
		type: "transactions",
		body: {
			size: 0,
			aggs: {
				colors: {
					terms: {field: "color"},
					aggs: {
						avg_price: {avg: {field: "price"}},
						make: {
							terms: {field: "make"},
							aggs: {
								min_price: {min: {field: "price"}},
								max_price: {max: {field: "price"}}
							}
						}
					}
				}
			}
		}
	};
	client.search(condition, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response= %j", response);
		response = {
			"took": 2,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {"total": 8, "max_score": 0, "hits": []},
			"aggregations": {
				"colors": {
					"doc_count_error_upper_bound": 0,
					"sum_other_doc_count": 0,
					"buckets": [
						{
							"key": "red",
							"doc_count": 4,
							"avg_price": {"value": 32500},
							"make": {
								"doc_count_error_upper_bound": 0,
								"sum_other_doc_count": 0,
								"buckets": [
									{"key": "honda", "doc_count": 3, "max_price": {"value": 20000}, "min_price": {"value": 10000}},
									{"key": "bmw", "doc_count": 1, "max_price": {"value": 80000}, "min_price": {"value": 80000}}
								]
							}
						},
						{
							"key": "blue",
							"doc_count": 2,
							"avg_price": {"value": 20000},
							"make": {
								"doc_count_error_upper_bound": 0,
								"sum_other_doc_count": 0,
								"buckets": [
									{"key": "ford", "doc_count": 1, "max_price": {"value": 25000}, "min_price": {"value": 25000}},
									{"key": "toyota", "doc_count": 1, "max_price": {"value": 15000}, "min_price": {"value": 15000}}
								]
							}
						},
						{
							"key": "green",
							"doc_count": 2,
							"avg_price": {"value": 21000},
							"make": {
								"doc_count_error_upper_bound": 0,
								"sum_other_doc_count": 0,
								"buckets": [
									{"key": "ford", "doc_count": 1, "max_price": {"value": 30000}, "min_price": {"value": 30000}},
									{"key": "toyota", "doc_count": 1, "max_price": {"value": 12000}, "min_price": {"value": 12000}}
								]
							}
						}
					]
				}
			}
		}
	});
}
