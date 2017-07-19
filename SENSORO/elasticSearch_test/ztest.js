/**
 * Created by wyq on 17/7/17.
 */
"use strict";
const client = require("./esClient.js").esClient;
const _ = require("underscore");

let condition0 = {
	body: {
		_source: false,   //返回值没有具体内容,只有_id
		query: {
			constant_score: {
				filter: {
					term: {
						// color: "red"
						price: 0
					}
				}
			}
			/*bool: {
			 should: {
			 constant_score: {
			 term: {
			 color: "red"
			 // price: 0
			 }
			 }
			 }
			 }*/
		}
	}
};
client.search(condition0).then(response => {
	console.log("response = %j", response);
	response = {
		"took": 67,
		"timed_out": false,
		"_shards": {"total": 25, "successful": 25, "failed": 0},
		"hits": {
			"total": 5,
			"max_score": 0.71231794,
			"hits": [
				{
					"_index": "mytest02",
					"_type": "cars",
					"_id": "AV1PPBh-Gkm9qmMRja1F",
					"_score": 0.71231794
				},
				{
					"_index": "mytest02",
					"_type": "cars",
					"_id": "AV1PPBh-Gkm9qmMRja1G",
					"_score": 0.71231794
				},
				{
					"_index": "mytest02",
					"_type": "cars",
					"_id": "AV1PPBh-Gkm9qmMRja1I",
					"_score": 0.71231794
				},
				{
					"_index": "mytest01",
					"_type": "cars",
					"_id": "AV1PPBh9Gkm9qmMRja0_",
					"_score": 0.5945348
				},
				{
					"_index": "mytest01", "_type": "cars", "_id": "AV1PPBh-Gkm9qmMRja1A", "_score": 0.5945348
				}
			]
		}
	}
	let condition = {body: []};
	response.hits.hits.forEach(item => {
		console.log("=== item: %j", item);
		condition.body.push({delete: _.pick(item, "_index", "_type", "_id")});
	});

	console.log("=== condition: %j", condition);
	client.bulk(condition, function (err, response) {
		console.log(err);
		console.log("%j", response);
		response = {
			"took": 149,
			"errors": false,
			"items": [
				{
					"delete": {
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AV1PPBh9Gkm9qmMRja0_",
						"_version": 2,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 200,
						"found": true
					}
				}, {
					"delete": {
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AV1PPBh-Gkm9qmMRja1A",
						"_version": 2,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 200,
						"found": true
					}
				}, {
					"delete": {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AV1PPBh-Gkm9qmMRja1F",
						"_version": 2,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 200,
						"found": true
					}
				}, {
					"delete": {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AV1PPBh-Gkm9qmMRja1G",
						"_version": 2,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 200,
						"found": true
					}
				}, {
					"delete": {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AV1PPBh-Gkm9qmMRja1I",
						"_version": 2,
						"_shards": {"total": 2, "successful": 1, "failed": 0},
						"status": 200,
						"found": true
					}
				}]
		}
	});
}).catch(err => {
	console.log("err: %j", err.message || err);
});
