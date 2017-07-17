/**
 * Created by wyq on 17/6/15.
 * 如果没有mytest01、mytest02两个索引和数据,调用z00_准备数据.js插入数据到es
 */
"use strict";
const client = require("./esClient.js").esClient;

function match() {
	let condition = {
		body: {
			query: {
				match: {    //使用 match 查询语句 来查询 remark 字段中包含 ford 的 remark (match不是精确匹配)
					remark: "ford"
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 28,
			"timed_out": false,
			"_shards": {"total": 15, "successful": 15, "failed": 0},
			"hits": {
				"total": 1,
				"max_score": 0.15342641,
				"hits": [
					{
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVymD0CD2dNT6M0pjpZC",
						"_score": 0.15342641,
						"_source": {
							"price": 30000,
							"color": "green",
							"make": "ford",
							"sold": "2014-05-18",
							"remark": "make by ford company"
						}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}
function bool() {
	let condition = {
		body: {
			query: {
				bool: {
					must: {
						match: {
							remark: "honda"
						}
					},
					must_not: {
						match: {
							make: "honda"
						}
					}
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 3,
			"timed_out": false,
			"_shards": {"total": 15, "successful": 15, "failed": 0},
			"hits": {
				"total": 1,
				"max_score": 0.15342641,
				"hits": [
					{
						"_index": "mytest02",
						"_type": "cars",
						"_id": "AVymD0CD2dNT6M0pjpZH",
						"_score": 0.15342641,
						"_source": {
							"price": 25000,
							"color": "blue",
							"make": "ford",
							"sold": "2014-02-12",
							"remark": "make by honda company"
						}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function filter() {
	let condition = {
		body: {
			query: {
				bool: {
					must: {
						match: {
							remark: "honda"
						}
					},
					must_not: {
						match: {
							make: "ford"
						}
					},
					filter: {
						range: {
							price: {
								lt: 20000
							}
						}
					}
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 21,
			"timed_out": false,
			"_shards": {"total": 15, "successful": 15, "failed": 0},
			"hits": {
				"total": 1,
				"max_score": 0.15342641,
				"hits": [
					{
						"_index": "mytest01",
						"_type": "cars",
						"_id": "AVymD0CD2dNT6M0pjpZA",
						"_score": 0.15342641,
						"_source": {
							"price": 10000,
							"color": "red",
							"make": "honda",
							"sold": "2014-10-28",
							"remark": "make by honda company"
						}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}

function should() {
	let condition = {
		body: {
			/*_source: {    //返回指定字段
				includes: ["price", "color"]
			},*/
			/*_source: {    //返回结果不包含字段
				excludes: ["price", "remark"]
			},*/
			// _source: false,   //返回值没有具体内容,只有_id
			query: {
				bool: {
					should: {
						match: {
							price: 25000
						}
					}
				}
			}
		}
	};
	client.search(condition).then(response => {
		console.log("response = %j", response);
		response = {
			"took": 4,
			"timed_out": false,
			"_shards": {"total": 15, "successful": 15, "failed": 0},
			"hits": {
				"total": 1,
				"max_score": 0.30685282,
				"hits": [{
					"_index": "mytest02",
					"_type": "cars",
					"_id": "AVymD0CD2dNT6M0pjpZH",
					"_score": 0.30685282,
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
should();

let egCondition = { //找出信件正文包含 business opportunity 的星标邮件，或者在收件箱正文包含 business opportunity 的非垃圾邮件：
	body: {
		query: {
			bool: {
				must: {
					match: {
						email: "business opportunity"   //找出信件正文包含 business opportunity
					}
				},
				should: [
					{
						match: {
							starred: true   //星标邮件
						}
					},
					{
						bool: {   //非垃圾邮件
							must: {
								match: {
									folder: "inbox"
								}
							},
							must_not: {
								match: {
									spam: true
								}
							}
						}
					}
				],
				minimum_should_match: 1  //should数组中的条件满足一个即可
			}
		}
	}
};







