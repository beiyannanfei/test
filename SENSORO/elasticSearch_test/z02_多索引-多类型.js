/**
 * Created by wyq on 17/6/14.
 * 如果没有mytest01、mytest02两个索引和数据,调用z00_准备数据.js插入数据到es
 */
"use strict";
const client = require("./esClient.js").esClient;


function toSearch1() {
	let condtion = {
		index: "mytest01,	mytest02"    //在两个索引中查询
	};

	client.search(condtion).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 1,
			"timed_out": false,
			"_shards": {"total": 10, "successful": 10, "failed": 0},
			"hits": {
				"total": 8,
				"max_score": 1,
				"hits": [
					{
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYs",
						"_score": 1,
						"_source": {"price": 15000, "color": "blue", "make": "toyota", "sold": "2014-07-02"}
					}, {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYv",
						"_score": 1,
						"_source": {"price": 80000, "color": "red", "make": "bmw", "sold": "2014-01-01"}
					}, {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYw",
						"_score": 1,
						"_source": {"price": 25000, "color": "blue", "make": "ford", "sold": "2014-02-12"}
					}, {
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYp",
						"_score": 1,
						"_source": {"price": 10000, "color": "red", "make": "honda", "sold": "2014-10-28"}
					}, {
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYq",
						"_score": 1,
						"_source": {"price": 20000, "color": "red", "make": "honda", "sold": "2014-11-05"}
					}, {
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYr",
						"_score": 1,
						"_source": {"price": 30000, "color": "green", "make": "ford", "sold": "2014-05-18"}
					}, {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYt",
						"_score": 1,
						"_source": {"price": 12000, "color": "green", "make": "toyota", "sold": "2014-08-19"}
					}, {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYu",
						"_score": 1,
						"_source": {"price": 20000, "color": "red", "make": "honda", "sold": "2014-11-05"}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function toSearch2() {
	let condtion = {
		index: "mytest*"    //在任何以 mytest 开头的索引中搜索所有的类型
	};
	client.search(condtion).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 2,
			"timed_out": false,
			"_shards": {"total": 10, "successful": 10, "failed": 0},
			"hits": {
				"total": 8,
				"max_score": 1,
				"hits": [
					{
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYs",
						"_score": 1,
						"_source": {"price": 15000, "color": "blue", "make": "toyota", "sold": "2014-07-02"}
					}, {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYv",
						"_score": 1,
						"_source": {"price": 80000, "color": "red", "make": "bmw", "sold": "2014-01-01"}
					}, {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYw",
						"_score": 1,
						"_source": {"price": 25000, "color": "blue", "make": "ford", "sold": "2014-02-12"}
					}, {
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYp",
						"_score": 1,
						"_source": {"price": 10000, "color": "red", "make": "honda", "sold": "2014-10-28"}
					}, {
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYq",
						"_score": 1,
						"_source": {"price": 20000, "color": "red", "make": "honda", "sold": "2014-11-05"}
					}, {
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYr",
						"_score": 1,
						"_source": {"price": 30000, "color": "green", "make": "ford", "sold": "2014-05-18"}
					}, {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYt",
						"_score": 1,
						"_source": {"price": 12000, "color": "green", "make": "toyota", "sold": "2014-08-19"}
					}, {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYu",
						"_score": 1,
						"_source": {"price": 20000, "color": "red", "make": "honda", "sold": "2014-11-05"}
					}]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}
toSearch2();
