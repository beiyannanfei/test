/**
 * Created by wyq on 17/6/20.
 * 数据依赖 z10_准备数据.js
 */
"use strict";
const client = require("./esClient.js").esClient;

function terms() {
	let condition = {
		index: "my_store",
		type: "products",
		body: {
			query: {
				constant_score: {
					filter: {
						terms: {
							price: [20, 30] //包含，而不是相等
						}
					}
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 160,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 3,
				"max_score": 1,
				"hits": [
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "2",
						"_score": 1,
						"_source": {"price": 20, "productID": "KDKE-B-9947-#kL5"}
					},
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "4",
						"_score": 1,
						"_source": {"price": 30, "productID": "QQPX-R-3956-#aD8"}
					},
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "3",
						"_score": 1,
						"_source": {"price": 30, "productID": "JODL-X-1937-#pV7"}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

terms();


