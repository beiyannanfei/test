/**
 * Created by wyq on 17/6/14.
 * 如果没有mytest01、mytest02两个索引和数据,调用z00_准备数据.js插入数据到es
 */
"use strict";
const client = require("./esClient.js").esClient;

let condtion = {
};

client.search(condtion).then(response => {
	console.log("response = %j", response);
	response = {
		"took": 2,  //值告诉我们执行整个搜索请求耗费了多少毫秒
		"timed_out": false,   //值告诉我们查询是否超时
		"_shards": {
			"total": 5,     //在查询中参与分片的总数
			"successful": 5,  //分片成功了多少个
			"failed": 0     //失败了多少个
		},
		"hits": {
			"total": 8, //匹配到的文档总数
			"max_score": 1, //与查询所匹配文档的 _score 的最大值
			"hits": [
				{
					"_index": "cars",
					"_type": "transactions",
					"_id": "AVygI2XeXc1i0y_01Iik",
					"_score": 1,    //衡量了文档与查询的匹配程度
					"_source": {"price": 25000, "color": "blue", "make": "ford", "sold": "2014-02-12"}
				}, {
					"_index": "cars",
					"_type": "transactions",
					"_id": "AVygI2XeXc1i0y_01Iid",
					"_score": 1,
					"_source": {"price": 10000, "color": "red", "make": "honda", "sold": "2014-10-28"}
				}, {
					"_index": "cars",
					"_type": "transactions",
					"_id": "AVygI2XeXc1i0y_01Iii",
					"_score": 1,
					"_source": {"price": 20000, "color": "red", "make": "honda", "sold": "2014-11-05"}
				}, {
					"_index": "cars",
					"_type": "transactions",
					"_id": "AVygI2XeXc1i0y_01Iie",
					"_score": 1,
					"_source": {"price": 20000, "color": "red", "make": "honda", "sold": "2014-11-05"}
				}, {
					"_index": "cars",
					"_type": "transactions",
					"_id": "AVygI2XeXc1i0y_01Iig",
					"_score": 1,
					"_source": {"price": 15000, "color": "blue", "make": "toyota", "sold": "2014-07-02"}
				}, {
					"_index": "cars",
					"_type": "transactions",
					"_id": "AVygI2XeXc1i0y_01Iij",
					"_score": 1,
					"_source": {"price": 80000, "color": "red", "make": "bmw", "sold": "2014-01-01"}
				}, {
					"_index": "cars",
					"_type": "transactions",
					"_id": "AVygI2XeXc1i0y_01Iif",
					"_score": 1,
					"_source": {"price": 30000, "color": "green", "make": "ford", "sold": "2014-05-18"}
				}, {
					"_index": "cars",
					"_type": "transactions",
					"_id": "AVygI2XeXc1i0y_01Iih",
					"_score": 1,
					"_source": {"price": 12000, "color": "green", "make": "toyota", "sold": "2014-08-19"}
				}
			]
		}
	};
}).catch(err => {
	console.log("err: %j", err.message || err);
});
