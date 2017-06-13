/**
 * Created by wyq on 17/6/13.
 */
//需要首先执行t2
"use strict";
const client = require("./esClient.js").esClient;

function mget() {
	let condition = {
		body: {
			docs: [
				{_index: "megacorp", _type: "employee", _id: 1},    //可以指定不同的index和type
				{_index: "megacorp", _type: "employee", _id: 1},
				{_index: "megacorp", _type: "employee", _id: 1},
			]
		}
	};

	client.mget(condition, function (err, response, status) {
		console.log(arguments);
		console.log("================");
		console.log(response.docs);
	});
}

function mget1() {
	let condition = {
		index: 'megacorp',    //db
		type: 'employee',     //table
		body: {
			ids: [1, 2, 3, 4]   //found: false  id:4的文档不存在
		}
	};
	client.mget(condition, function (err, response, status) {
		console.log(arguments);
		console.log("================");
		console.log(response.docs);
	});
}
mget1();
1641433878
