/**
 * Created by wyq on 17/6/13.
 * 按时间统计
 */
"use strict";
const client = require("./esClient.js").esClient;

function toAggsPreMonth() {
	let condition = {
		index: "cars",
		type: "transactions",
		body: {
			size: 0,
			aggs: {
				sales: {
					date_histogram: {
						field: "sold",
						interval: "month",    //`year`, `quarter`, `month`, `week`, `day`, `hour`, `minute`, `second`
						format: "yyyy-MM-dd"
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
			"took": 15,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {"total": 8, "max_score": 0, "hits": []},
			"aggregations": {
				"sales": {
					"buckets": [
						{"key_as_string": "2014-01-01", "key": 1388534400000, "doc_count": 1},
						{"key_as_string": "2014-02-01", "key": 1391212800000, "doc_count": 1},
						{"key_as_string": "2014-03-01", "key": 1393632000000, "doc_count": 0},
						{"key_as_string": "2014-04-01", "key": 1396310400000, "doc_count": 0},
						{"key_as_string": "2014-05-01", "key": 1398902400000, "doc_count": 1},
						{"key_as_string": "2014-06-01", "key": 1401580800000, "doc_count": 0},
						{"key_as_string": "2014-07-01", "key": 1404172800000, "doc_count": 1},
						{"key_as_string": "2014-08-01", "key": 1406851200000, "doc_count": 1},
						{"key_as_string": "2014-09-01", "key": 1409529600000, "doc_count": 0},
						{"key_as_string": "2014-10-01", "key": 1412121600000, "doc_count": 1},
						{"key_as_string": "2014-11-01", "key": 1414800000000, "doc_count": 2}   //没有12月的
					]
				}
			}
		}
	});
}

function toAggsPreMonth_completion() {    //日期补全
	let condition = {
		index: "cars",
		type: "transactions",
		body: {
			size: 0,
			aggs: {
				sales: {
					date_histogram: {
						field: "sold",
						interval: "month",
						format: "yyyy-MM-dd",
						min_doc_count: 0,       //这个参数强制返回空 buckets
						extended_bounds: {      //返回整年的数据
							min: "2014-01-01",
							max: "2014-12-31"
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
			"took": 24,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {"total": 8, "max_score": 0, "hits": []},
			"aggregations": {
				"sales": {
					"buckets": [
						{"key_as_string": "2014-01-01", "key": 1388534400000, "doc_count": 1},
						{"key_as_string": "2014-02-01", "key": 1391212800000, "doc_count": 1},
						{"key_as_string": "2014-03-01", "key": 1393632000000, "doc_count": 0},
						{"key_as_string": "2014-04-01", "key": 1396310400000, "doc_count": 0},
						{"key_as_string": "2014-05-01", "key": 1398902400000, "doc_count": 1},
						{"key_as_string": "2014-06-01", "key": 1401580800000, "doc_count": 0},
						{"key_as_string": "2014-07-01", "key": 1404172800000, "doc_count": 1},
						{"key_as_string": "2014-08-01", "key": 1406851200000, "doc_count": 1},
						{"key_as_string": "2014-09-01", "key": 1409529600000, "doc_count": 0},
						{"key_as_string": "2014-10-01", "key": 1412121600000, "doc_count": 1},
						{"key_as_string": "2014-11-01", "key": 1414800000000, "doc_count": 2},
						{"key_as_string": "2014-12-01", "key": 1417392000000, "doc_count": 0}
					]
				}
			}
		}
	});
}


function toAggs_date_count() {
	let condition = {
		index: "cars",
		type: "transactions",
		body: {
			size: 0,
			aggs: {
				sales: {
					date_histogram: {
						field: "sold",
						interval: "quarter",    //按季度
						format: "yyyy-MM-dd",
						min_doc_count: 0,
						extended_bounds: {
							min: "2014-01-01",
							max: "2014-12-31"
						}
					},
					aggs: {
						per_make_sum: {
							terms: {
								field: "make"
							},
							aggs: {
								sum_price: {
									sum: {field: "price"}
								}
							}
						},
						total_sum: {
							sum: {field: "price"}
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
			"took": 15,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {"total": 8, "max_score": 0, "hits": []},
			"aggregations": {
				"sales": {
					"buckets": [
						{
							"key_as_string": "2014-01-01",
							"key": 1388534400000,
							"doc_count": 2,
							"per_make_sum": {
								"doc_count_error_upper_bound": 0,
								"sum_other_doc_count": 0,
								"buckets": [
									{"key": "bmw", "doc_count": 1, "sum_price": {"value": 80000}},
									{"key": "ford", "doc_count": 1, "sum_price": {"value": 25000}}
								]
							},
							"total_sum": {"value": 105000}
						},
						{
							"key_as_string": "2014-04-01",
							"key": 1396310400000,
							"doc_count": 1,
							"per_make_sum": {
								"doc_count_error_upper_bound": 0,
								"sum_other_doc_count": 0,
								"buckets": [
									{"key": "ford", "doc_count": 1, "sum_price": {"value": 30000}}
								]
							},
							"total_sum": {"value": 30000}
						},
						{
							"key_as_string": "2014-07-01",
							"key": 1404172800000,
							"doc_count": 2,
							"per_make_sum": {
								"doc_count_error_upper_bound": 0,
								"sum_other_doc_count": 0,
								"buckets": [
									{"key": "toyota", "doc_count": 2, "sum_price": {"value": 27000}}
								]
							},
							"total_sum": {"value": 27000}
						},
						{
							"key_as_string": "2014-10-01",
							"key": 1412121600000,
							"doc_count": 3,
							"per_make_sum": {
								"doc_count_error_upper_bound": 0,
								"sum_other_doc_count": 0,
								"buckets": [
									{"key": "honda", "doc_count": 3, "sum_price": {"value": 50000}}
								]
							},
							"total_sum": {"value": 50000}
						}
					]
				}
			}
		};
	});
}

toAggs_date_count();


