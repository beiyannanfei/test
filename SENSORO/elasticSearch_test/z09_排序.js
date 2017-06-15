/**
 * Created by wyq on 17/6/15.
 * 如果没有mytest01、mytest02两个索引和数据,调用z00_准备数据.js插入数据到es
 */
"use strict";
const client = require("./esClient.js").esClient;


function sort() {
	let condition = {
		index: "mytest*",
		body: {
			query: {
				bool: {
					filter: {
						term: {
							make: "honda"
						}
					}
				}
			},
			sort: {
				sold: {
					order: "desc"
				}
			}
		}
	};

	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 3,
			"timed_out": false,
			"_shards": {"total": 10, "successful": 10, "failed": 0},
			"hits": {
				"total": 3,
				"max_score": null,
				"hits": [
					{
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyqaDsY2dNT6M0pjpZd",
						"_score": null,
						"_source": {
							"price": 20000,
							"color": "red",
							"make": "honda",
							"sold": "2014-11-05",
							"remark": "make by honda company"
						},
						"sort": [1415145600000]
					}, {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVyqaDsY2dNT6M0pjpZi",
						"_score": null,
						"_source": {
							"price": 20000,
							"color": "red",
							"make": "honda",
							"sold": "2014-11-05",
							"remark": "make by honda company"
						},
						"sort": [1415145600000]
					}, {
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyqaDsY2dNT6M0pjpZc",
						"_score": null,
						"_source": {
							"price": 10000,
							"color": "red",
							"make": "honda",
							"sold": "2014-10-28",
							"remark": "make by honda company"
						},
						"sort": [1414454400000]
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

