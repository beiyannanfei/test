/**
 * Created by wyq on 16/10/9.
 */
//需要首先执行t2
"use strict";
const client = require("./esClient.js").esClient;

function test1() {
	let conditon = {
		index: 'megacorp',    //db
		type: 'employee',     //table
		body: {
			aggs: {
				all_interests: {
					terms: {field: "interests"}   //按照兴趣爱好分组
				}
			}
		}
	};
	client.search(conditon, function (err, response) {
		console.log(arguments);
		console.log(response.aggregations.all_interests);
	});
}

function test2() {
	let condition = {
		index: 'megacorp',    //db
		type: 'employee',     //table
		body: {
			query: {
				match: {last_name: 'smith'}   //过滤条件
			},
			aggs: {
				all_interests: {
					terms: {
						field: "interests"    //分组条件
					}
				}
			}
		}
	};
	client.search(condition, function (err, response) {
		console.log(arguments);
		console.log(response.aggregations.all_interests);
	});
}

function test3() {
	let condition = {   //统计每种兴趣下职员的平均年龄
		index: 'megacorp',    //db
		type: 'employee',     //table
		body: {
			aggs: {
				all_interests: {
					terms: {field: "interests"},
					aggs: {
						avg_age: {
							avg: {field: "age"}
						}
					}
				}
			}
		}
	};
	client.search(condition, function (err, response) {
		console.log(arguments);
		console.log(response.aggregations.all_interests);
		console.log(response.aggregations.all_interests.buckets[0].avg_age);
		console.log(response.aggregations.all_interests.buckets[1].avg_age);
		console.log(response.aggregations.all_interests.buckets[2].avg_age);
	});
}

test3();