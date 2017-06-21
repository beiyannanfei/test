/**
 * Created by wyq on 17/6/20.
 * 数据来源于z16_xxx 文件 toSave 函数
 */
"use strict";
const client = require("./esClient.js").esClient;

function search() {
	let condition = {
		index: "my_index",
		type: "my_type",
		body: {
			query: {
				bool: {
					must: {
						match: {title: "quick"}
					},
					must_not: {
						match: {title: "lazy"}
					},
					should: [
						{
							match: {title: "brown"}
						},
						{
							match: {title: "dog"}
						}
					]
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 3,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 2,
				"max_score": 0.6159991,
				"hits": [
					{
						"_index": "my_index",
						"_type": "my_type",
						"_id": "3",
						"_score": 0.6159991,
						"_source": {"title": "The quick brown fox jumps over the quick dog"}  //有更高评分是因为它同时包含 brown 和 dog
					}, {
						"_index": "my_index",
						"_type": "my_type",
						"_id": "1",
						"_score": 0.30219644,
						"_source": {"title": "The quick brown fox"}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function matchPersent() { //控制精度
	let condition = {
		index: "my_index",
		type: "my_type",
		body: {
			query: {
				bool: {
					should: [
						{match: {title: "brown"}},
						{match: {title: "fox"}},
						{match: {title: "dog"}}
					],
					minimum_should_match: 2
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 12,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 4,
				"max_score": 1.2691375,
				"hits": [{
					"_index": "my_index",
					"_type": "my_type",
					"_id": "4",
					"_score": 1.2691375,
					"_source": {"title": "Brown fox brown dog"}   //评分最高包含三个字段且最短
				}, {
					"_index": "my_index",
					"_type": "my_type",
					"_id": "2",
					"_score": 0.69697833,
					"_source": {"title": "The quick brown fox jumps over the lazy dog"}
				}, {
					"_index": "my_index",
					"_type": "my_type",
					"_id": "3",
					"_score": 0.54126585,
					"_source": {"title": "The quick brown fox jumps over the quick dog"}
				}, {
					"_index": "my_index",
					"_type": "my_type",
					"_id": "1",
					"_score": 0.30219644,
					"_source": {"title": "The quick brown fox"}
				}]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}
matchPersent();
