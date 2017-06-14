/**
 * Created by wyq on 17/6/14.
 * 如果没有mytest01、mytest02两个索引和数据,调用z00_准备数据.js插入数据到es
 */
"use strict";
const client = require("./esClient.js").esClient;

let condtion = {
	index: "mytest01",
	body: {
		size: 2,    //每页数量
		from: 2     //跳过数量
	}
};

client.search(condtion).then(response => {
	console.log("response = %j", response);
	response = {
		"took": 2,
		"timed_out": false,
		"_shards": {"total": 5, "successful": 5, "failed": 0},
		"hits": {
			"total": 4,
			"max_score": 1,
			"hits": [
				{
					"_index": "mytest01",
					"_type": "cars",
					"_id": "AVyl13A32dNT6M0pjpYq",
					"_score": 1,
					"_source": {"price": 20000, "color": "red", "make": "honda", "sold": "2014-11-05"}
				},
				{
					"_index": "mytest01",
					"_type": "cars",
					"_id": "AVyl13A32dNT6M0pjpYr",
					"_score": 1,
					"_source": {"price": 30000, "color": "green", "make": "ford", "sold": "2014-05-18"}
				}
			]
		}
	}
}).catch(err => {
	console.log("err: %j", err.message || err);
});


