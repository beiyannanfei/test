/**
 * Created by wyq on 16/12/12.
 */
"use strict";

var kue = require("kue");
var queue = kue.createQueue();

function createJob() {  //创建任务
	var kueJob = kue.Job;
	var job = queue.create("email", {
		title: 'welcome email for tj',
		to: 'tj@learnboost.com',
		template: 'welcome-email'
	}).save(function (err) {
		if (!err) {
			console.log("createJob jobId: %j", job.id);
			kueJob.get(job.id, function (err, job) {
				console.log("== kueJob.get err: %j, job: %j", err, job);
			});
		}
	});
}

function jobWithPriority() {  //创建任务并设置优先级
	var job = queue.create("email", {
		title: 'welcome email for tj',
		to: 'tj@learnboost.com',
		template: 'welcome-email'
	}).priority("high").save(err => {
		if (!!err) {
			return console.log("jobWithPriority job err: %j", err);
		}
		console.log("jobWithPriority success jobId: %j", job.id);
	});
}

function jobWithAttempt() {   //失败重试
	var job = queue.create('email', {
		title: 'welcome email for tj',
		to: 'tj@learnboost.com',
		template: 'welcome-email'
	}).priority('high').attempts(5).save(err => {
		if (!!err) {
			return console.log("jobWithAttempt job err: %j", err);
		}
		console.log("jobWithAttempt success jobId: %j", job.id);
	});
}

function jobWithTTL() {   //设置任务生存周期
	var job = queue
		.create('email', {title: 'email job with TTL'})
		.ttl(10000)
		.save(err => {
			if (!!err) {
				return console.log("jobWithTTL job err: %j", err);
			}
			console.log("jobWithTTL success jobId: %j", job.id);
			job.log({key: 'some key', value: 10});
			job.log([1, 2, 3, 5, 8]);
			job.log(10.1);
		});
}

function jobEvent() {
	var job = queue.create('video conversion', {
		title: 'converting loki\'s to avi',
		user: 1,
		frames: 200
	});

	job.on('complete', function (result) {
		console.log('Job completed with data ', result);
	}).on('failed attempt', function (errorMessage, doneAttempts) {
		console.log('Job failed');
	}).on('failed', function (errorMessage) {
		console.log('Job failed');
	}).on('progress', function (progress, data) {
		console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data);
	});
}

function queueEvents() {  //队列事件
	queue.on('job enqueue', function (id, type) {
		console.log('Job %s got queued of type %s', id, type);
	}).on('job complete', function (id, result) {
		kue.Job.get(id, function (err, job) {
			if (err) return;
			job.remove(function (err) {
				if (err) throw err;
				console.log('removed completed job #%d', job.id);
			});
		});
	});
}



createJob();




