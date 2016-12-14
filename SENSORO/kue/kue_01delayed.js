/**
 * Created by wyq on 16/12/14.
 */
"use strict";

var kue = require("kue");

// create our job queue

var jobs = kue.createQueue();

// one minute

var minute = 10000;

var test1 = jobs.create('test', {
	a: 1, b: 2, c: 3
}).delay(minute).priority('high').save(function (err) {
	console.log("[%j] jobs.create err: %j, id: %j", new Date().toLocaleString(), err, test1.id);
});

var test2 = jobs.create('test', {
	a: 4, b: 5, c: 6
}).delay(minute).priority('high').save(function (err) {
	console.log("[%j] jobs.create err: %j, id: %j", new Date().toLocaleString(), err, test2.id);
});

test1.on('promotion', function () {
	console.log('[%j] test1 renewal job promoted %j', new Date().toLocaleString(), this.id);
});

test1.on('complete', function () {
	console.log('[%j] test1 renewal job completed %j', new Date().toLocaleString(), this.id);
});

test2.on('promotion', function () {
	console.log('[%j] test2 renewal job promoted %j', new Date().toLocaleString(), this.id);
});

test2.on('complete', function () {
	console.log('[%j] test2 renewal job completed %j', new Date().toLocaleString(), this.id);
});

jobs.process('test', 10, function (job, done) {
	console.log("[%j] jobs.process job: %j", new Date().toLocaleString(), job);
	setTimeout(function () {
		console.log("[%j] jobs.process id: %j done", new Date().toLocaleString(), job.id);
		done();
	}, 5000);
});

// start the UI
kue.app.listen(3000);
console.log('[%j] UI started on port 3000', new Date().toLocaleString());
