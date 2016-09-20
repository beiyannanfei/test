"use strict";
var Rx = require("rx");

var config = {
	"database": Rx.Observable.return("db config"),
	"cache": Rx.Observable.return("cache config"),
	"picCDN": Rx.Observable.return("cdn config")
};

Rx.Observable.case(() => "database", config, Rx.Observable.empty())
	.subscribe(dbConfig => {
		console.log("dbConfig: %j", dbConfig);
	});

Rx.Observable.case(() => "picCDN", config, Rx.Observable.empty())
	.subscribe(picConfig => {
		console.log("picConf: %j", picConfig);
	});
