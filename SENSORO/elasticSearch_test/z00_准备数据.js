/**
 * Created by wyq on 17/6/14.
 */
"use strict";
const client = require("./esClient.js").esClient;

function toSave() {
	let condtion = {
		body: [
			{index: {_index: "mytest01", _type: "cars"}},
			{price: 10000, color: "red", make: "honda", sold: "2014-10-28", remark: "make by honda company"},
			{index: {_index: "mytest01", _type: "cars"}},
			{price: 20000, color: "red", make: "honda", sold: "2014-11-05", remark: "make by honda company"},
			{index: {_index: "mytest01", _type: "cars"}},
			{price: 30000, color: "green", make: "ford", sold: "2014-05-18", remark: "make by ford company"},
			{index: {_index: "mytest01", _type: "cars"}},
			{price: 15000, color: "blue", make: "toyota", sold: "2014-07-02", remark: "make by toyota company"},
			{index: {_index: "mytest02", _type: "cars"}},
			{price: 12000, color: "green", make: "toyota", sold: "2014-08-19", remark: "make by toyota company"},
			{index: {_index: "mytest02", _type: "cars"}},
			{price: 20000, color: "red", make: "honda", sold: "2014-11-05", remark: "make by honda company"},
			{index: {_index: "mytest02", _type: "cars"}},
			{price: 80000, color: "red", make: "bmw", sold: "2014-01-01", remark: "make by bmw company"},
			{index: {_index: "mytest02", _type: "cars"}},
			{price: 25000, color: "blue", make: "ford", sold: "2014-02-12", remark: "make by honda company"}
		]
	};
	client.bulk(condtion, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response: %j", response);
	});
}

toSave();