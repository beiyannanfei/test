/**
 * Created by wyq on 17/7/4.
 */
"use strict";
const es = require("elasticsearch");
var esClient = exports.esClient = new es.Client({
	host: [
		"http://127.0.0.1:9200/",
		"http://localhost:9200/"
	],
	log: 'info', //trace debug info warning warning
	apiVersion: '2.3',
	requestTimeout: 100 * 1000,
	deadTimeout: 10 * 1000
});


function findAll() {
	let condition1 = {
		"query": {
			"match_all": {}
		}
	};
	esClient.search(condition1, function (err, val) {
		console.log(val);
		console.log(val.hits.hits);
	});
}

function create() {
	let con1 = {
		index: 'megacorp',    //db
		type: 'employee',     //table
		id: '1',
		body: {
			"first_name": "John",
			"last_name": "Smith",
			"age": 25,
			"about": "I love to go rock climbing",
			"interests": ["sports", "music"]
		}
	};

	let con2 = {
		index: 'megacorp',    //db
		type: 'employee',     //table
		id: '2',
		body: {
			"first_name": "Jane",
			"last_name": "Smith",
			"age": 32,
			"about": "I like to collect rock albums",
			"interests": ["music"]
		}
	};

	let con3 = {
		index: 'megacorp',    //db
		type: 'employee',     //table
		id: '3',
		body: {
			"first_name": "Douglas",
			"last_name": "Fir",
			"age": 35,
			"about": "I like to build cabinets",
			"interests": ["forestry"]
		}
	};

	esClient.create(con1, function (err, val) {
		console.log(err, val);
	});

	esClient.create(con2, function (err, val) {
		console.log(err, val);
	});

	esClient.create(con3, function (err, val) {
		console.log(err, val);
	});
}

setTimeout(create, 2000);
setTimeout(findAll, 10000);