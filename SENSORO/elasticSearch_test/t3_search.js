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
		id: 1
	};
	client.get(condition, function (err, response) {
		console.log(arguments);
		console.log(response._source);
	});
}

function test2() {
	let condition = {
		index: 'megacorp',    //db
		type: 'employee',     //table
		q: "first_name: Jane"
	};
	client.search(condition, function (err, response) {
		console.log(arguments);
		console.log(response.hits.hits[0]._source);
	});
}

function test3() {
	let condition = {
		index: 'megacorp',    //db
		type: 'employee',     //table
		body: {
			query: {
				match: {
					"last_name": "Smith"
				}
			}
		}
	};
	client.search(condition, function (err, response) {
		console.log(arguments);
		console.log("=====================");
		console.log(response.hits.total);
		console.log("=====================");
		console.log(response.hits.hits);
	});
}

function test4() {
	/*let condtion = {
		index: "megacorp",
		type: "employee",
		body: {
			query: {
				filtered: {
					filter: {
						range: {
							age: {gt: 30}
						}
					},
					query: {
						match: {
							last_name: "smith"
						}
					}
				}
			}
		}
	};*/
	let condtion = {
		index: "megacorp",
		type: "employee",
		body: {
			query: {
				bool: {
					must: {
						match: {
							last_name: "smith"
						}
					},
					filter: {
						range: {
							age: {
								gt: 30
							}
						}
					}
				}
			}
		}
	};
	client.search(condtion, function (err, response) {
		console.log(arguments);
		console.log("==================");
		console.log(response.hits.total);
		console.log("==================");
		console.log(response.hits.hits);
	});
}
test4();
