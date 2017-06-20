/**
 * Created by wyq on 17/6/20.
 * 数据依赖 z10_准备数据.js
 */
"use strict";
const client = require("./esClient.js").esClient;

function bool() {   //布尔过滤器
	let condition = {
		index: "my_store",
		type: "products",
		body: {
			query: {
				filtered: {
					filter: {
						bool: {
							should: [   //至少有一个语句要匹配，与 OR 等价
								{
									term: {price: 20}
								},
								{
									term: {productID: "XHDK-A-1293-#fJ3"}
								}
							],
							must_not: {
								term: {
									price: 30
								}
							}
						}
					}
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 51,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 2,
				"max_score": 1,
				"hits": [
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "2",
						"_score": 1,
						"_source": {"price": 20, "productID": "KDKE-B-9947-#kL5"} //与 term 过滤器中 price = 20 条件匹配
					},
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "1",
						"_score": 1,
						"_source": {"price": 10, "productID": "XHDK-A-1293-#fJ3"} //与 term 过滤器中 productID = "XHDK-A-1293-#fJ3" 条件匹配
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}


function filter() {   //嵌套布尔过滤器
	let condition = {
		index: "my_store",
		type: "products",
		body: {
			query: {
				filtered: {
					filter: {
						bool: {
							should: [
								{
									term: {productID: "KDKE-B-9947-#kL5"}
								},
								{
									bool: {
										must: [
											{
												term: {productID: "JODL-X-1937-#pV7"}
											},
											{
												term: {price: 30}
											}
										]
									}
								}
							]
						}
					}
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 7,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 2,
				"max_score": 1,
				"hits": [
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "2",
						"_score": 1,
						"_source": {"price": 20, "productID": "KDKE-B-9947-#kL5"} //这个 productID 与外层的 bool 过滤器 should 里的唯一一个 term 匹配
					},
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "3",
						"_score": 1,
						"_source": {"price": 30, "productID": "JODL-X-1937-#pV7"} //这两个字段与嵌套的 bool 过滤器 must 里的两个 term 匹配
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

filter();


