/**
 * Created by wyq on 16/10/9.
 */
//需要首先执行t2
"use strict";
const client = require("./esClient.js").esClient;

function test1() {
	let condition = {
		index: 'megacorp',    //db
		type: 'employee',     //table
		body: {
			query: {
				match: {
					about: "rock climbing"    //全文搜索(类似模糊搜索)
				}
			}
		}
	};
	client.search(condition, function (err, response) {
		console.log(arguments);
		console.log(response.hits.total);
		console.log(response.hits.hits);
	});
}

function test2() {
	let condition = {
		index: 'megacorp',    //db
		type: 'employee',     //table
		body: {
			query: {
				match_phrase: {
					about: "rock climbing"    //查询同时包含"rock"和"climbing"（并且是相邻的）
				}
			}
		}
	};
	client.search(condition, function (err, response) {
		console.log(arguments);
		console.log(response.hits.total);
		console.log(response.hits.hits);
	});
}

function test3() {
	let condition = {
		index: 'megacorp',    //db
		type: 'employee',     //table
		body: {
			query: {
				match_phrase: {about: "rock climbing"}
			},
			highlight: {
				fields: {about: {}}
			}
		}
	};
	client.search(condition, function (err, response) {
		console.log(arguments);
		console.log(response.hits.total);
		console.log(response.hits.hits);
		console.log(response.hits.hits[0].highlight);
	});
}

test3();





