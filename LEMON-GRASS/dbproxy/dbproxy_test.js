'use strict';

const path = require('path');
const fs = require('fs');
const msgpack = require("msgpack-lite");
const Uint64BE = require("int64-buffer").Uint64BE;

const FPClient = require('./fpnn-sdk-nodejs/src/FPClient');

let client = new FPClient({host: '182.254.147.76', port: 12321, autoReconnect: true, connectionTimeout: 10 * 1000});

client.connect();


client.on('connect', function () {
	console.log("=========================== on client.connect: %j", +new Date());
	/*let uid = +new Date();
	let options = {
		flag: 1,
		method: 'iQuery',
		payload: msgpack.encode({
			"hintIds": [new Uint64BE(uid)],
			"sql": "insert into user (`uid`, `nickname`, `regainTime`, `headFrame`) values (?, '?', '?', ?)",
			"params": [uid.toString(), "1529487865", "2018-06-20 17:44:25", "160001"]
		}),
	};
	console.log('================== uid: %j', uid);*/

	let hintId = 1529489894425;
	let options = {
		flag: 1,
		method: 'iQuery',
		payload: msgpack.encode({
			"hintIds": [new Uint64BE(hintId)],
			"sql": "select * from user",
		}),
	};

	client.sendQuest(options, function (data) {
		console.log(data);
		console.log(msgpack.decode(data.payload));
	}, 10 * 1000);
});

client.on('error', function (err) {
	console.error(err);
});