/**
 * Created by wyq on 16/10/8.
 */
"use strict";
const client = require("./esClient.js").esClient;

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
		"first_name" :  "Jane",
		"last_name" :   "Smith",
		"age" :         32,
		"about" :       "I like to collect rock albums",
		"interests":  [ "music" ]
	}
};

let con3 = {
	index: 'megacorp',    //db
	type: 'employee',     //table
	id: '3',
	body: {
		"first_name" :  "Douglas",
		"last_name" :   "Fir",
		"age" :         35,
		"about":        "I like to build cabinets",
		"interests":  [ "forestry" ]
	}
};

client.create(con1, function (err, val) {
	console.log(err, val);
});

client.create(con2, function (err, val) {
	console.log(err, val);
});

client.create(con3, function (err, val) {
	console.log(err, val);
});




