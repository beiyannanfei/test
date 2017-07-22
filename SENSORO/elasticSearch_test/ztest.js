/**
 * Created by wyq on 17/7/17.
 */
"use strict";
const client = require("./esClient.js").esClient;
const _ = require("underscore");

/*let condition0 = {
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
 /!*bool: {
 should: {
 constant_score: {
 term: {
 color: "red"
 // price: 0
 }
 }
 }
 }*!/
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
 });*/

function toSave() {
	let condtion = {
		index: "aaa",
		type: "bbbb",
		body: [
			{"index": {"_id": 1}},
			{"price": 10, "productID": "XHDK-A-1293-#fJ3", iDate: new Date("2015-12-12 23:45:12")},
			{"index": {"_id": 2}},
			{"price": 20, "productID": "KDKE-B-9947-#kL5", iDate: new Date("2015-05-12 23:45:12")},
			{"index": {"_id": 3}},
			{"price": 30, "productID": "JODL-X-1937-#pV7", iDate: new Date("2015-10-12 23:45:12")},
			{"index": {"_id": 4}},
			{"price": 40, "productID": "QQPX-R-3956-#aD8", iDate: new Date("2015-03-12 23:45:12")},
			{"index": {"_id": 5}},
			{"price": 50, "productID": "QQPX-R-3956-#aD8", iDate: new Date("2015-11-12 23:45:12")},
			{"index": {"_id": 6}},
			{"price": 60, "productID": "QQPX-R-3956-#aD8", iDate: new Date("2015-06-12 23:45:12")},
			{"index": {"_id": 7}},
			{"price": 70, "productID": "QQPX-R-3956-#aD8", iDate: new Date("2015-01-12 23:45:12")},
			{"index": {"_id": 8}},
			{"price": 80, "productID": "QQPX-R-3956-#aD8", iDate: new Date("2015-09-12 23:45:12")},
			{"index": {"_id": 9}},
			{"price": 90, "productID": "QQPX-R-3956-#aD8", iDate: new Date("2015-08-20 20:45:12")}
		]
	};
	client.bulk(condtion, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response: %j", response);
	});
}

function search() {
	let condition = {
		index: "aaa",
		type: "bbbb",
		body: {
			size: 6,
			query: {
				constant_score: {
					filter: {
						range: {
							price: {
								gte: 20
							}
						}
					}
				}
			},
			sort: {
				iDate: {
					order: "desc"
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 81,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 8,
				"max_score": null,
				"hits": [
					{
						"_index": "aaa",
						"_type": "bbbb",
						"_id": "5",
						"_score": null,
						"_source": {"price": 50, "productID": "QQPX-R-3956-#aD8", "iDate": "2015-11-12T15:45:12.000Z"},
						"sort": [1447343112000]
					}, {
						"_index": "aaa",
						"_type": "bbbb",
						"_id": "3",
						"_score": null,
						"_source": {"price": 30, "productID": "JODL-X-1937-#pV7", "iDate": "2015-10-12T15:45:12.000Z"},
						"sort": [1444664712000]
					}, {
						"_index": "aaa",
						"_type": "bbbb",
						"_id": "8",
						"_score": null,
						"_source": {"price": 80, "productID": "QQPX-R-3956-#aD8", "iDate": "2015-09-12T15:45:12.000Z"},
						"sort": [1442072712000]
					}, {
						"_index": "aaa",
						"_type": "bbbb",
						"_id": "9",
						"_score": null,
						"_source": {"price": 90, "productID": "QQPX-R-3956-#aD8", "iDate": "2015-08-20T12:45:12.000Z"},
						"sort": [1440074712000]
					}, {
						"_index": "aaa",
						"_type": "bbbb",
						"_id": "6",
						"_score": null,
						"_source": {"price": 60, "productID": "QQPX-R-3956-#aD8", "iDate": "2015-06-12T15:45:12.000Z"},
						"sort": [1434123912000]
					}, {
						"_index": "aaa",
						"_type": "bbbb",
						"_id": "2",
						"_score": null,
						"_source": {"price": 20, "productID": "KDKE-B-9947-#kL5", "iDate": "2015-05-12T15:45:12.000Z"},
						"sort": [1431445512000]
					}
				]
			}
		}
		let data = _.pluck(response.hits.hits, "_source");
		console.log("data = %j", data);
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

search();







