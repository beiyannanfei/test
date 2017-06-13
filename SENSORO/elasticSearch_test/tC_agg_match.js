/**
 * Created by wyq on 17/6/13.
 * 范围限定的聚合
 */
"use strict";
const client = require("./esClient.js").esClient;

function toAggs_match() {
	let condition = {
		index: "cars",
		type: "transactions",
		body: {
			query: {    //查询条件
				match: {
					make: "ford"
				}
			},
			aggs: {
				colors: {
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
		console.log("response= %j", response);
		response = {
			"took": 25,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 2,
				"max_score": 1,
				"hits": [     //查询结果 因为我们没有指定 "size" : 0 ，所以搜索结果和聚合结果都被返回了
					{
						"_index": "cars",
						"_type": "transactions",
						"_id": "AVygI2XeXc1i0y_01Iif",
						"_score": 1,
						"_source": {"price": 30000, "color": "green", "make": "ford", "sold": "2014-05-18"}
					},
					{
						"_index": "cars",
						"_type": "transactions",
						"_id": "AVygI2XeXc1i0y_01Iik",
						"_score": 0.30685282,
						"_source": {"price": 25000, "color": "blue", "make": "ford", "sold": "2014-02-12"}
					}
				]
			},
			"aggregations": {
				"colors": {
					"doc_count_error_upper_bound": 0,
					"sum_other_doc_count": 0,
					"buckets": [
						{"key": "blue", "doc_count": 1},
						{"key": "green", "doc_count": 1}
					]
				}
			}
		}
	});
}

function toAggSingle_All() {    //全局桶
	let condition = {
		index: "cars",
		type: "transactions",
		body: {
			query: {    //查询条件
				match: {
					make: "ford"
				}
			},
			size: 0,
			aggs: {
				single_avg_price: {
					avg: {field: "price"}   //聚合操作在查询范围内（例如：所有文档匹配 ford ）
				},
				all: {
					global: {},     //global 全局桶没有参数
					aggs: {
						avg_price: {
							avg: {field: "price"}   //聚合操作针对所有文档，忽略汽车品牌
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
			"took": 7,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {"total": 2, "max_score": 0, "hits": []},
			"aggregations": {
				"all": {"doc_count": 8, "avg_price": {"value": 26500}},
				"single_avg_price": {"value": 27500}
			}
		}
	});
}
toAggSingle_All();
