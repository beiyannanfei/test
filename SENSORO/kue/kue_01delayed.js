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
}).delay(minute * 2).priority('high').save(function (err) {
	console.log("[%j] jobs.create err: %j, id: %j", new Date().toLocaleString(), err, test2.id);
});

test1.on('promotion', function () {
	console.log('[%j] test1 renewal job promoted %j', new Date().toLocaleString(), this.id);
});

test1.on('complete', function () {
	console.log('[%j] test1 renewal job completed %j', new Date().toLocaleString(), this.id);
	test1.remove(function (err) { //删除已完成的任务
		console.log("[%j] test1 remove", new Date().toLocaleString());
	});
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

jobs.on("job enqueue", id => {
	console.log("[%j] *job enqueue id: %s", new Date().toLocaleString(), id);
}).on("job start", id => {
	console.log("[%j] *job start id: %s", new Date().toLocaleString(), id);
}).on("job promotion", id => {
	console.log("[%j] *job promotion id: %s", new Date().toLocaleString(), id);
}).on("job progress", id => {
	console.log("[%j] *job progress id: %s", new Date().toLocaleString(), id);
}).on("job failed attempt", id => {
	console.log("[%j] *job failed attempt id: %s", new Date().toLocaleString(), id);
}).on("job failed", id => {
	console.log("[%j] *job failed id: %s", new Date().toLocaleString(), id);
}).on("job complete", id => {
	console.log("[%j] *job complete id: %s", new Date().toLocaleString(), id);
}).on("job remove", id => {
	console.log("[%j] *job remove id: %s", new Date().toLocaleString(), id);
});

jobs.watchStuckJobs();  //检测是否有还未完成的任务
// start the UI
kue.app.listen(3000);
console.log('[%j] UI started on port 3000', new Date().toLocaleString());

process.on('SIGINT', function () {
	console.log("====== SIGTERM: ");
	jobs.shutdown(5000, function (err) {  //优雅停机方式
		console.log("kue shutdown: ", err || "");
		process.exit(0);
	});
});

