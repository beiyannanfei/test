//需要首先执行t2
"use strict";
const client = require("./esClient.js").esClient;

function test1() {
	let condition = {
		body: [
			{
				index: {_index: "megacorp", _type: "employee", _id: 4}
			},
			{title: "foo"}
		]
	};
	client.bulk(condition, function (err, response) {
		console.log(err);
		console.log("%j", response);
	});
}

function test2() {
	let condition = {
		body: [
			{
				delete: {_index: "megacorp", _type: "employee", _id: 4}
			}
		]
	};
	client.bulk(condition, function (err, response) {
		console.log(err);
		console.log("%j", response);
	});
}

function test3() {
	let con = {
		index: "megacorp",
		type: "employee",
		body: {
			query: {
				match: {
					"last_name": "Smith"
				}
			}
		}
	};
	client.count(con, function (err, response, status) {
		console.log(arguments);
	});
}

test3();