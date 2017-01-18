/**
 * Created by wyq on 17/1/11.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var options = {
	user: "",
	pass: "",
	server: {
		auto_reconnect: true,
		poolSize: 5,
		socketOptions: {socketTimeoutMS: 300000}
	},
	db: {
		readPreference: 'secondaryPreferred'
	},
	promiseLibrary: require("bluebird")
};

mongoose.connect("mongodb://localhost/test", options, function (err) {
	if (!!err) {
		return console.error("mongoose.connect err: %j", err);
	}
});

mongoose.connection.on('connected', function () {
	console.log("============= connected =============");
});

mongoose.connection.on('error', function (err) {
	console.log("============= error: %j =============", err);
});

mongoose.connection.on('disconnected', function () {
	console.log("============= disconnected =============");
});

process.on('SIGINT', function () {
	console.log("=== SIGINT ===");
	mongoose.connection.close(function () {
		console.log("============= close =============");
		process.exit(0);
	});
});

function get() {
	console.log("====== get");
	console.log(mongoose.get());
}

setTimeout(get, 2000);

