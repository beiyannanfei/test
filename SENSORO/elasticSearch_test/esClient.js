/**
 * Created by wyq on 16/10/8.
 */

"use strict";
const es = require("elasticsearch");
exports.esClient = new es.Client({
	host: "localhost:9200",
	log: 'debug', //trace debug info warning warning
	apiVersion: '2.3',
	requestTimeout: 100 * 1000,
	deadTimeout: 10 * 1000
});

