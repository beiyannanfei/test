/**
 * Created by wyq on 17/10/13.
 * 更新es文档,包括修改字段和添加字段
 */
"use strict";
const client = require("./esClient.js").esClient;
const async = require("async");
const co = require("co");
const Bluebird = require("bluebird");

function createDoc() {    //1
	let condition = {
		body: [
			{index: {_index: "update_test", _type: "logs"}},
			{a: 10, b: 20},
			{index: {_index: "update_test", _type: "logs"}},
			{a: 11.2, b: 21.458},
			{index: {_index: "update_test", _type: "logs"}},
			{a: 58, b: 98},
			{index: {_index: "update_test", _type: "logs"}},
			{a: 47, b: 21},
			{index: {_index: "update_test", _type: "logs"}},
			{a: 23, b: 78}
		]
	};
	client.bulk(condition, function (err, response) {
		console.log("%j", arguments);
	});
}

function getAll() {
	let condition = {
		index: "update_test",
		type: "logs"
	};
	client.search(condition, function (err, response) {
		if (!!err) {
			return console.log("es err: %j", err.message || err);
		}
		console.log("response = %j", response);
		response = {
			"took": 8,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 5,
				"max_score": 1,
				"hits": [
					{
						"_index": "update_test",
						"_type": "logs",
						"_id": "AV8UuJIFxija-M_x1woj",
						"_score": 1,
						"_source": {"a": 47, "b": 21}
					},
					{
						"_index": "update_test",
						"_type": "logs",
						"_id": "AV8UuJIExija-M_x1wog",
						"_score": 1,
						"_source": {"a": 10, "b": 20}
					},
					{
						"_index": "update_test",
						"_type": "logs",
						"_id": "AV8UuJIFxija-M_x1woh",
						"_score": 1,
						"_source": {"a": 11.2, "b": 21.458}
					},
					{
						"_index": "update_test",
						"_type": "logs",
						"_id": "AV8UuJIFxija-M_x1woi",
						"_score": 1,
						"_source": {"a": 58, "b": 98}
					},
					{
						"_index": "update_test",
						"_type": "logs",
						"_id": "AV8UuJIFxija-M_x1wok",
						"_score": 1,
						"_source": {"a": 23, "b": 78}
					}
				]
			}
		};
		// inc14A(response.hits.hits);
		makeField4C(response.hits.hits);
	});
}

function makeField4C(docList) {   //生成新字段c
	co(function *() {
		for (let index = 0; index < docList.length; ++index) {
			let doc = docList[index];
			let upDoc = {
				index: doc._index,
				type: doc._type,
				id: doc._id,
				body: {
					script: 'ctx._source.d = ctx._source.a + ctx._source.b + ctx._source.c'
				}
			};
			console.log("updoc: %j", upDoc);
			let response = yield esUpdateSync(upDoc);
			console.log("makeField4C response: %j", response);
		}
	}).catch(err => {
		console.log("makeField4C es err: %s", err.message || err);
	});
}

function inc14A(docList) {    //为doc中的a字段加1
	co(function *() {
		for (let index = 0; index < docList.length; ++index) {
			let doc = docList[index];
			let upDoc = {
				index: doc._index,
				type: doc._type,
				id: doc._id,
				body: {
					script: 'ctx._source.a += tag',
					params: {tag: 1}
				}
			};
			console.log("updoc: %j", upDoc);
			let response = yield esUpdateSync(upDoc);
			console.log("inc14A response: %j", response);
		}
	}).catch(err => {
		console.log("inc14A es err: %s", err.message || err);
	});
}

function esUpdateSync(upDoc) {
	if (!upDoc) {
		return Bluebird.reject("params error");
	}
	return new Bluebird((resolve, reject) => {
		client.update(upDoc, function (err, response) {
			if (!!err) {
				return reject(err);
			}
			return resolve(response);
		});
	});
}

getAll();

