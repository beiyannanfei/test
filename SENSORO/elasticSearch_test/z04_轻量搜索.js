/**
 * Created by wyq on 17/6/14.
 * 如果没有mytest01、mytest02两个索引和数据,调用z00_准备数据.js插入数据到es
 */
"use strict";
const client = require("./esClient.js").esClient;

function q() {
	let condtion = {
		index: "mytest*",
		q: "honda"    //查找所有包含honda单词的文档(任何字段包含都可以)
	};
	client.search(condtion).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 3,
			"timed_out": false,
			"_shards": {"total": 10, "successful": 10, "failed": 0},
			"hits": {
				"total": 4,
				"max_score": 0.13561106,
				"hits": [
					{
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVymD0CD2dNT6M0pjpZA",
						"_score": 0.13561106,
						"_source": {
							"price": 10000,
							"color": "red",
							"make": "honda",
							"sold": "2014-10-28",
							"remark": "make by honda company"
						}
					},
					{
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVymD0CD2dNT6M0pjpZB",
						"_score": 0.13561106,
						"_source": {
							"price": 20000,
							"color": "red",
							"make": "honda",
							"sold": "2014-11-05",
							"remark": "make by honda company"
						}
					},
					{
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVymD0CD2dNT6M0pjpZF",
						"_score": 0.13561106,
						"_source": {
							"price": 20000,
							"color": "red",
							"make": "honda",
							"sold": "2014-11-05",
							"remark": "make by honda company"
						}
					},
					{
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVymD0CD2dNT6M0pjpZH",
						"_score": 0.095891505,
						"_source": {
							"price": 25000,
							"color": "blue",
							"make": "ford",
							"sold": "2014-02-12",
							"remark": "make by honda company"
						}
					}]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function q2() {
	let condtion = {
		index: "mytest*",
		q: "+make: honda price: 10000" //+ 前缀表示必须与查询条件匹配。类似地， - 前缀表示一定不与查询条件匹配。没有 + 或者 - 的所有其他条件都是可选的——匹配的越多，文档就越相关。
	};
	client.search(condtion).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 4,
			"timed_out": false,
			"_shards": {"total": 10, "successful": 10, "failed": 0},
			"hits": {
				"total": 3,
				"max_score": 1.724915,
				"hits": [
					{
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYp",
						"_score": 1.724915,
						"_source": {"price": 10000, "color": "red", "make": "honda", "sold": "2014-10-28"}  //两个条件都匹配
					},
					{
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYq",
						"_score": 0.28986934,
						"_source": {"price": 20000, "color": "red", "make": "honda", "sold": "2014-11-05"}  //只会匹配一个查询条件
					},
					{
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVyl13A32dNT6M0pjpYu",
						"_score": 0.25427115,
						"_source": {"price": 20000, "color": "red", "make": "honda", "sold": "2014-11-05"}  //只会匹配一个查询条件
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function q3() {
	let condtion = {
		index: "mytest*",
		q: "+make:(toyota bmw honda) +sold:<2014-10-29"   //查找make为toyota bmw honda,销售时间小于2014-10-29的文档
	};
	client.search(condtion).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 16,
			"timed_out": false,
			"_shards": {"total": 10, "successful": 10, "failed": 0},
			"hits": {
				"total": 4,
				"max_score": 0.5863407,
				"hits": [
					{
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVymD0CD2dNT6M0pjpZA",
						"_score": 0.5863407,
						"_source": {
							"price": 10000,
							"color": "red",
							"make": "honda",
							"sold": "2014-10-28",
							"remark": "make by honda company"
						}
					}, {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVymD0CD2dNT6M0pjpZG",
						"_score": 0.5863407,
						"_source": {
							"price": 80000,
							"color": "red",
							"make": "bmw",
							"sold": "2014-01-01",
							"remark": "make by bmw company"
						}
					}, {
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVymD0CD2dNT6M0pjpZE",
						"_score": 0.5863407,
						"_source": {
							"price": 12000,
							"color": "green",
							"make": "toyota",
							"sold": "2014-08-19",
							"remark": "make by toyota company"
						}
					}, {
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVymD0CD2dNT6M0pjpZD",
						"_score": 0.5863407,
						"_source": {
							"price": 15000,
							"color": "blue",
							"make": "toyota",
							"sold": "2014-07-02",
							"remark": "make by toyota company"
						}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}


