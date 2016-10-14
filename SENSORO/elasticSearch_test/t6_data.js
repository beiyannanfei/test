"use strict";
const client = require("./esClient.js").esClient;

function test1() {    //创建文档(制定id)
	let data = {
		index: "website",
		type: "blog",
		id: 123,
		body: {
			"title": "My first blog entry",
			"text": "Just trying this out...",
			"date": "2014/01/01"
		}
	};
	client.create(data, function (err, response) {
		console.log(arguments);
		/*response = {
		 _index: 'website',
		 _type: 'blog',
		 _id: '123',
		 _version: 1,
		 _shards: {total: 2, successful: 1, failed: 0},
		 created: true
		 };*/
	});
}

function test2() {    //创建文档(自动生成id)
	let data = {
		index: "website",
		type: "blog",
		body: {
			"title": "My second blog entry",
			"text": "Still trying this out...",
			"date": "2014/01/01"
		}
	};
	client.create(data, function (err, response) {
		console.log(arguments);
		/*response = {
		 _index: 'website',
		 _type: 'blog',
		 _id: 'AVeoVKurEikJYrqac9t8',
		 _version: 1,
		 _shards: {total: 2, successful: 1, failed: 0},
		 created: true
		 };*/
	});
}

function test3() {
	let condition = {
		index: "website",
		type: "blog",
		id: 123
	};
	client.get(condition, function (err, response) {
		console.log(arguments);
	});
}

test3();
