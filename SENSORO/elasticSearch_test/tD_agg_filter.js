/**
 * Created by wyq on 17/6/13.
 * 过滤统计
 */
"use strict";
const client = require("./esClient.js").esClient;


client.ping({
	requestTimeout: Infinity,
	// undocumented params are appended to the query string
	hello: 'elasticsearch!'
}, function (error) {
	if (error) {
		console.error('Elasticsearch cluster is down!');
	} else {
		console.log('Elasticsearch is well');
	}
});

function toAggs_filter() {
	let condition = {
		index: "cars",
		type: "transactions",
		body: {
			size: 0,
			query: {
				constant_score: {
					filter: {
						range: {
							price: {
								gte: 10000
							}
						}
					}
				}
			},
			aggs: {
				single_avg_price: {
					avg: {field: "price"}
				}
			}
		}
	};
	client.search(condition, function (err, response) {
		if (!!err) {
			return console.log("err: %j", err.message || err);
		}
		console.log("response= %j", response);
		response = {
			"took": 2,
			"timed_out": false,
			"_shards": {"total": 5, "successful": 5, "failed": 0},
			"hits": {"total": 8, "max_score": 0, "hits": []},
			"aggregations": {"single_avg_price": {"value": 26500}}
		}
	});
}
