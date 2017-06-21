/**
 * Created by wyq on 17/6/20.
 */
"use strict";
const client = require("./esClient.js").esClient;

function toSave() {
	let condition = {
		index: "my_index",
		type: "my_type",
		body: [
			{index: {_id: 1}},
			{title: "The quick brown fox"},
			{index: {_id: 2}},
			{title: "The quick brown fox jumps over the lazy dog"},
			{index: {_id: 3}},
			{title: "The quick brown fox jumps over the quick dog"},
			{index: {_id: 4}},
			{title: "Brown fox brown dog"}
		]
	};
	client.bulk(condition, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response= %j", response);
		response = {
			"took": 51,
			"errors": false,
			"items": [
				{
					"index": {
						"_index": "my_index",
						"_type": "my_type",
						"_id": "1",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				},
				{
					"index": {
						"_index": "my_index",
						"_type": "my_type",
						"_id": "2",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				},
				{
					"index": {
						"_index": "my_index",
						"_type": "my_type",
						"_id": "3",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				},
				{
					"index": {
						"_index": "my_index",
						"_type": "my_type",
						"_id": "4",
						"_version": 1,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 201
					}
				}
			]
		}
	});
}

function match() {  //单个词查询
	let condition = {
		index: "my_index",
		type: "my_type",
		body: {
			query: {
				match: {
					title: "QUICK!"
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
				"total": 3,
				"max_score": 0.5291085,
				"hits": [
					{
						"_index": "my_index",
						"_type": "my_type",
						"_id": "2",
						"_score": 0.5291085,
						"_source": {"title": "The quick brown fox jumps over the lazy dog"}
					},
					{
						"_index": "my_index",
						"_type": "my_type",
						"_id": "1",
						"_score": 0.5,
						"_source": {"title": "The quick brown fox"}
					},
					{
						"_index": "my_index",
						"_type": "my_type",
						"_id": "3",
						"_score": 0.44194174,
						"_source": {"title": "The quick brown fox jumps over the quick dog"}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function multiWorld() { //多词查询
	let condition = {
		index: "my_index",
		type: "my_type",
		body: {
			query: {
				match: {
					title: "BROWN DOG!"
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 1,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 4,
				"max_score": 1.0991054,
				"hits": [
					{
						"_index": "my_index",
						"_type": "my_type",
						"_id": "4",
						"_score": 1.0991054,
						"_source": {"title": "Brown fox brown dog"} //最相关，因为它包含词 "brown" 两次以及 "dog" 一次
					}, {
						"_index": "my_index",
						"_type": "my_type",
						"_id": "2",
						"_score": 0.5690805,
						"_source": {"title": "The quick brown fox jumps over the lazy dog"}
					}, {
						"_index": "my_index",
						"_type": "my_type",
						"_id": "3",
						"_score": 0.44194174,
						"_source": {"title": "The quick brown fox jumps over the quick dog"}
					}, {
						"_index": "my_index",
						"_type": "my_type",
						"_id": "1",
						"_score": 0.12713557,
						"_source": {"title": "The quick brown fox"}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function matchAnd() { //提高精度
	let condition = {
		index: "my_index",
		type: "my_type",
		body: {
			query: {
				match: {
					title: {
						query: "BROWN DOG!",
						operator: "and"   //match 查询还可以接受 operator 操作符作为输入参数，默认情况下该操作符是 or 。我们可以将它修改成 and 让所有指定词项都必须匹配：
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
				"total": 3,
				"max_score": 1.0991054,
				"hits": [
					{
						"_index": "my_index",
						"_type": "my_type",
						"_id": "4",
						"_score": 1.0991054,
						"_source": {"title": "Brown fox brown dog"}
					}, {
						"_index": "my_index",
						"_type": "my_type",
						"_id": "2",
						"_score": 0.5690805,
						"_source": {"title": "The quick brown fox jumps over the lazy dog"}
					}, {
						"_index": "my_index",
						"_type": "my_type",
						"_id": "3",
						"_score": 0.44194174,
						"_source": {"title": "The quick brown fox jumps over the quick dog"}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function matchPersent() { //match 查询支持 minimum_should_match 最小匹配参数， 这让我们可以指定必须匹配的词项数用来表示一个文档是否相关。我们可以将其设置为某个具体数字，更常用的做法是将其设置为一个百分数，因为我们无法控制用户搜索时输入的单词数量
	let condition = {
		index: "my_index",
		type: "my_type",
		body: {
			query: {
				match: {
					title: {
						query: "quick brown dog",
						minimum_should_match: "75%"
					}
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 9,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 4,
				"max_score": 0.7770511,
				"hits": [{
					"_index": "my_index",
					"_type": "my_type",
					"_id": "2",
					"_score": 0.7770511,
					"_source": {"title": "The quick brown fox jumps over the lazy dog"}
				}, {
					"_index": "my_index",
					"_type": "my_type",
					"_id": "3",
					"_score": 0.6159991,
					"_source": {"title": "The quick brown fox jumps over the quick dog"}
				}, {
					"_index": "my_index",
					"_type": "my_type",
					"_id": "4",
					"_score": 0.5366266,
					"_source": {"title": "Brown fox brown dog"}
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

