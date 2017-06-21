/**
 * Created by wyq on 17/6/20.
 */
"use strict";
const client = require("./esClient.js").esClient;

function toSave() {   //首先创建数据
	let condtion = {
		index: "my_index",
		type: "posts",
		body: [
			{"index": {"_id": "1"}},
			{"tags": ["search"]},
			{"index": {"_id": "2"}},
			{"tags": ["search", "open_source"]},
			{"index": {"_id": "3"}},
			{"other_field": "some data"},
			{"index": {"_id": "4"}},
			{"tags": null},
			{"index": {"_id": "5"}},
			{"tags": ["search", null]}
		]
	};
	client.bulk(condtion, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response= %j", response);
		response = {
			"took": 255,
			"errors": false,
			"items": [
				{
					"index": {
						"_index": "my_index",
						"_type": "posts",
						"_id": "1",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				}, {
					"index": {
						"_index": "my_index",
						"_type": "posts",
						"_id": "2",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				}, {
					"index": {
						"_index": "my_index",
						"_type": "posts",
						"_id": "3",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				}, {
					"index": {
						"_index": "my_index",
						"_type": "posts",
						"_id": "4",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				}, {
					"index": {
						"_index": "my_index",
						"_type": "posts",
						"_id": "5",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				}
			]
		}
	});
}

function exists() {
	let condition = {
		index: "my_index",
		type: "posts",
		body: {
			query: {
				constant_score: {
					filter: {
						exists: { //被设置过标签字段的文档
							field: "tags"
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
				"total": 3,
				"max_score": 1,
				"hits": [
					{
						"_index": "my_index",
						"_type": "posts",
						"_id": "5",
						"_score": 1,
						"_source": {"tags": ["search", null]}
					},
					{
						"_index": "my_index",
						"_type": "posts",
						"_id": "2",
						"_score": 1,
						"_source": {"tags": ["search", "open_source"]}
					},
					{
						"_index": "my_index",
						"_type": "posts",
						"_id": "1",
						"_score": 1,
						"_source": {"tags": ["search"]}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function missing() {
	let condition = {
		index: "my_index",
		type: "posts",
		body: {
			query: {
				constant_score: {
					filter: {
						missing: {  //缺失查询
							field: "tags"
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
						"_index": "my_index",
						"_type": "posts",
						"_id": "4",
						"_score": 1,
						"_source": {"tags": null}
					},
					{
						"_index": "my_index",
						"_type": "posts",
						"_id": "3",
						"_score": 1,
						"_source": {"other_field": "some data"}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}
missing();


let body = {
	query: {
		constant_score: {
			filter: {
				bool: {
					should: [
						{
							bool: {
								must: [
									{term: {folder: "inbox"}},
									{term: {read: false}}
								]
							}
						},
						{
							bool: {
								must_not: {
									term: {folder: "inbox"}
								},
								must: {
									term: {important: true}
								}
							}
						}
					]
				}
			}
		}
	}
};