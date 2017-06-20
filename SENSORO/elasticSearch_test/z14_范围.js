/**
 * Created by wyq on 17/6/20.
 * 数据依赖 z10_准备数据.js
 */
"use strict";
const client = require("./esClient.js").esClient;

function range() {
	let condition = {
		index: "my_store",
		type: "products",
		body: {
			query: {
				constant_score: {
					filter: {
						range: {
							price: {
								gte: 20,
								lt: 40
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
			"took": 16,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {
				"total": 3,
				"max_score": 1,
				"hits": [
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "2",
						"_score": 1,
						"_source": {"price": 20, "productID": "KDKE-B-9947-#kL5"}
					},
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "4",
						"_score": 1,
						"_source": {"price": 30, "productID": "QQPX-R-3956-#aD8"}
					},
					{
						"_index": "my_store",
						"_type": "products",
						"_id": "3",
						"_score": 1,
						"_source": {"price": 30, "productID": "JODL-X-1937-#pV7"}
					}
				]
			}
		}
	}).catch(err => {
		console.log("err: %j", err.message || err);
	});
}
range();

let con1 = {
	index: "my_store",
	type: "products",
	body: {
		query: {
			constant_score: {
				filter: {
					range: {
						timestamp: {    //日期范围
							gt: "2014-01-01 00:00:00",
							lt: "2014-01-07 00:00:00"
						}
					}
				}
			}
		}
	}
};

let con2 = {
	index: "my_store",
	type: "products",
	body: {
		query: {
			constant_score: {
				filter: {
					range: {
						timestamp: {
							gt: "now-1h"  //查找时间戳在过去一小时内的所有文档
						}
					}
				}
			}
		}
	}
};

let con3 = {
	index: "my_store",
	type: "products",
	body: {
		query: {
			constant_score: {
				filter: {
					range: {    //早于 2014 年 1 月 1 日加 1 月（2014 年 2 月 1 日 零时）
						timestamp: {
							gt: "2014-01-01 00:00:00",
							lt: "2014-01-01 00:00:00||+1M"  //只要在某个日期后加上一个双管符号 (||) 并紧跟一个日期数学表达式就能做到
						}
					}
				}
			}
		}
	}
};

let con4 = {
	index: "my_store",
	type: "products",
	body: {
		query: {
			constant_score: {
				filter: {
					range: {  //如果我们想查找从 a 到 b （不包含）的字符串，同样可以使用 range 查询语法
						title: {
							gte: "a",
							lt: "b"
						}
					}
				}
			}
		}
	}
};