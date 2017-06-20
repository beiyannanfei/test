/**
 * Created by wyq on 17/6/20.
 * 准备新数据
 */
"use strict";
const client = require("./esClient.js").esClient;
const superagent = require('superagent');

let struct = {
	"mappings": {
		"products": {
			"properties": {
				"productID": {
					"type": "string",
					"index": "not_analyzed"
				}
			}
		}
	}
};

superagent.put("http://localhost:9200/my_store")
	.send(struct)
	.accept("text/json")
	.end(function (err, xhr) {
		if (!!err) {
			return console.log("http err: %j", err.message || err);
		}
		if (xhr.statusCode != 200) {
			return console.log("statusCode err: %j", xhr.statusCode);
		}
		if (!xhr.body) {
			return console.log("no xhr.body, xhr: %j", xhr);
		}
		let body;
		try {
			body = JSON.parse(xhr.text);
		}
		catch (e) {
			console.log(e.message);
			body = xhr.text;
		}
		console.log("success body: %j", body);
		return toSave();
	});

function toSave() {
	let condtion = {
		index: "my_store",
		type: "products",
		body: [
			{"index": {"_id": 1}},
			{"price": 10, "productID": "XHDK-A-1293-#fJ3"},
			{"index": {"_id": 2}},
			{"price": 20, "productID": "KDKE-B-9947-#kL5"},
			{"index": {"_id": 3}},
			{"price": 30, "productID": "JODL-X-1937-#pV7"},
			{"index": {"_id": 4}},
			{"price": 30, "productID": "QQPX-R-3956-#aD8"}
		]
	};
	client.bulk(condtion, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response: %j", response);
	});
}

