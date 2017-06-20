/**
 * Created by wyq on 17/6/20.
 * 数据依赖 z10_准备数据.js
 */
"use strict";
const client = require("./esClient.js").esClient;

function term() { //term 查询数字
	let condition = {
		index: "my_store",
		type: "products",
		body: {
			query: {
				term: {
					price: 20
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 8,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 1,
				"max_score": 1,
				"hits": [
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "2",
						"_score": 1,
						"_source": {"price": 20, "productID": "KDKE-B-9947-#kL5"}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function constant_score() {   //使用 constant_score 查询以非评分模式来执行 term 查询并以一作为统一评分
	let condition = {
		index: "my_store",
		type: "products",
		body: {
			query: {
				constant_score: {
					filter: {
						term: {
							price: 20
						}
					}
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 2,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 1,
				"max_score": 1,
				"hits": [
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "2",
						"_score": 1,
						"_source": {"price": 20, "productID": "KDKE-B-9947-#kL5"}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function search_str() {   //字符串查找
	let condition = {
		index: "my_store",
		type: "products",
		body: {
			query: {
				constant_score: {
					filter: {
						term: {
							productID: "XHDK-A-1293-#fJ3"
						}
					}
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 13,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 1,
				"max_score": 1,
				"hits": [
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "1",
						"_score": 1,
						"_source": {"price": 10, "productID": "XHDK-A-1293-#fJ3"}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

