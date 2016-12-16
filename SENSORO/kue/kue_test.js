/**
 ** Created by wyq on 16/12/12.
 **/
"use strict";

var redis = require("ioredis");
var redisClient = redis.createClient();
var kue = require("kue");
var queue = kue.createQueue();
var Job = kue.Job;

/**
 * 删除redis中的所有key
 * @returns {*}
 */
function flushRedis() {
	queueEvents();
	return redisClient.flushall();
}

/**
 * 队列事件
 */
function queueEvents() {
	queue.on("job enqueue", id => {
		console.log("[%j] ****job enqueue id: %s", new Date().toLocaleString(), id);
	}).on("job start", id => {
		console.log("[%j] ****job start id: %s", new Date().toLocaleString(), id);
	}).on("job promotion", id => {
		console.log("[%j] ****job promotion id: %s", new Date().toLocaleString(), id);
	}).on("job progress", id => {
		console.log("[%j] ****job progress id: %s", new Date().toLocaleString(), id);
	}).on("job failed attempt", id => {
		console.log("[%j] ****job failed attempt id: %s", new Date().toLocaleString(), id);
	}).on("job failed", id => {
		console.log("[%j] ****job failed id: %s", new Date().toLocaleString(), id);
	}).on("job complete", id => {
		console.log("[%j] ****job complete id: %s", new Date().toLocaleString(), id);
	}).on("job remove", id => {
		console.log("[%j] ****job remove id: %s", new Date().toLocaleString(), id);
	});
}

/**
 * 任务事件
 * @param job
 */
function jobEvents(job) {
	job.on("enqueue", id => {
		console.log("[%j] **enqueue id: %s", new Date().toLocaleString(), job.id);
	}).on("start", id => {
		console.log("[%j] **start id: %s", new Date().toLocaleString(), job.id);
	}).on("promotion", id => {
		console.log("[%j] **promotion id: %s", new Date().toLocaleString(), job.id);
	}).on("progress", id => {
		console.log("[%j] **progress id: %s", new Date().toLocaleString(), job.id);
	}).on("failed attempt", id => {
		console.log("[%j] **failed attempt id: %s", new Date().toLocaleString(), job.id);
	}).on("failed", errorMessage => {
		console.log("[%j] **failed id: %s, err: %j", new Date().toLocaleString(), job.id, errorMessage);
	}).on("complete", id => {
		console.log("[%j] **complete id: %s", new Date().toLocaleString(), job.id);
	}).on("remove", id => {
		console.log("[%j] **remove id: %s", new Date().toLocaleString(), job.id);
	});
}

/**
 * 根据id获取job内容
 * @param id
 */
function getJobById(id) {
	Job.get(id, (err, job) => {
		if (!!err) {
			return console.log("[%j] getJobById err: %j, id: %s", new Date().toLocaleString(), err, id);
		}
		return console.log("[%j] getJobById success jobId: %s, jobInfo: %j", new Date().toLocaleString(), id, job);
	});
}

/**
 * 创建一个任务
 */
function createJob() {
	let data = {
		title: 'welcome email for tj', to: 'tj@learnboost.com', template: 'welcome-email'
	};
	flushRedis().then(val => {
		let job = queue.create("email", data).save(err => {
			if (!!err) {
				return console.log("[%j] createJob err: %j", new Date().toLocaleString(), err);
			}
			console.log("[%j] createJob success jobId: %s", new Date().toLocaleString(), job.id);
			return getJobById(job.id);
		});
	});
}

/**
 * 创建一个有优先级的任务
 * 优先级取值可以是字符串也可以是数值{low: 10, normal: 0, medium: -5, high: -10, critical: -15};
 */
function createJobWithPriority() {
	let data = {
		title: 'welcome email for tj', to: 'tj@learnboost.com', template: 'welcome-email'
	};
	flushRedis().then(val => {
		let job = queue.create("email", data).priority("high").save(err => {
			if (!!err) {
				return console.log("[%j] createJobWithPriority err: %j", new Date().toLocaleString(), err);
			}
			console.log("[%j] createJobWithPriority success jobId: %s", new Date().toLocaleString(), job.id);
			return getJobById(job.id);
		});
	});
}

/**
 * 创建有失败重试的任务(失败后立即重试)
 */
function jobWithFailureAttempts() {
	let data = {title: 'welcome email for tj', to: 'tj@learnboost.com', template: 'welcome-email'};
	flushRedis().then(val => {
		let job = queue.create("email", data).priority(-10).attempts(3);
		job.save(err => {
			if (!!err) {
				return console.log("[%j] jobWithFailureAttempts err: %j", new Date().toLocaleString(), err);
			}
			console.log("[%j] jobWithFailureAttempts success jobId: %s", new Date().toLocaleString(), job.id);
			return getJobById(job.id);
		});
	});
}

/**
 * 创建有失败重试的任务(延时重试)
 */
function jobWithFailureBackoff() {
	let data = {title: 'welcome email for tj', to: 'tj@learnboost.com', template: 'welcome-email'};
	//延时方案
	let offPlan = {delay: 60 * 1000, type: 'fixed'}; //指数延迟 {type:'exponential'}
	flushRedis().then(val => {
		let job = queue.create("email", data);
		job.attempts(3);  //重试次数
		job.priority(-10);  //优先级
		job.backoff(offPlan); //延时重试
		job.save(err => {
			if (!!err) {
				return console.log("[%j] jobWithFailureBackoff err: %j", new Date().toLocaleString(), err);
			}
			console.log("[%j] jobWithFailureBackoff success jobId: %s", new Date().toLocaleString(), job.id);
			return getJobById(job.id);
		});
	});
}

/**
 * 创建有生存时间的任务
 */
function jobWithTTL() {
	let data = {title: 'welcome email for tj', to: 'tj@learnboost.com', template: 'welcome-email'};
	flushRedis().then(val => {
		let job = queue.create("email", data);
		job.ttl(5000);
		job.save(err => {
			if (!!err) {
				return console.log("[%j] jobWithTTL err: %j", new Date().toLocaleString(), err);
			}
			console.log("[%j] jobWithTTL success jobId: %s", new Date().toLocaleString(), job.id);
			jobEvents(job);
			return getJobById(job.id);
		});
	});
}

/**
 * 步进式任务
 */
function jobProgress() {
	let job = queue.create("test", {title: "test progress", user: 1, frames: 100});
	job.save(err => {
		if (!err) {
			console.log("[%j] jobProgress save finish id: %j", new Date().toLocaleString(), job.id);
		}
	});
	job.on("progress", function (progress) {
		console.log("[%j] job progress #%s %s% complete", new Date().toLocaleString(), job.id, progress);
	}).on("complete", function () {
		console.log("[%j] job complete #%s", new Date().toLocaleString(), job.id);
	});
	queue.on("job progress", id => {
		getJobById(id);
	});

	queue.process("test", 1, (job, done) => {
		let frames = job.data.frames;

		function next(i) {
			job.progress(i, frames);
			if (i >= frames) {
				return done();
			}
			setTimeout(next, 1000, i + 5);
		}

		next(0);
	});
}

/**
 * 延时完成任务
 */
function delayJob() {
	let data = {title: 'Account renewal required', to: 'tj@learnboost.com', template: 'renewal-email'};
	flushRedis().then(val => {
		let job = queue.create("email", data);
		job.priority("high");
		job.delay(5000);    //延时5s
		job.save(function () {
			console.log("[%j] job create finish jobId: %j", new Date().toLocaleString(), job.id);
		});
		jobEvents(job);
		queue.process("email", 1, function (job, done) {
			console.log("[%j] queue.process jobId: %s", new Date().toLocaleString(), job.id);
			setTimeout(done, 5000);
		});
	});
}

/**
 * 暂停队列
 */
function pauseProcess() {
	flushRedis().then(val => {
		let job1 = queue.create("email", {a: 10, b: 20}).priority("high").save(err => {
			console.log("[%j] job create finish jobId: %j", new Date().toLocaleString(), job1.id);
		});
		let job2 = queue.create("email", {a: 30, b: 40}).priority("high").save(err => {
			console.log("[%j] job create finish jobId: %j", new Date().toLocaleString(), job2.id);
		});
		jobEvents(job1);
		jobEvents(job2);

		queue.process("email", (job, ctx, done) => {
			console.log("[%j] queue.process jobId: %s", new Date().toLocaleString(), job.id);
			ctx.pause(5000, function (err) {
				console.log("worker is pause... ");
				setTimeout(function () {
					console.log("worker is resume... ");
					ctx.resume();
				}, 2000);
			});
		});
	});
}

/**
 * 优雅关机方式
 */
function gracefulShutdown() {
	process.on('SIGINT', function () {
		console.log("====== SIGTERM: ");
		queue.shutdown(5000, function (err) {  //优雅停机方式
			console.log("kue shutdown finish: ", err || "");
			process.exit(0);
		});
	});
}

/**
 * 清除已完成任务
 */
function jobCleanup() {
	flushRedis().then(val => {
		let data = {a: 10, b: 20};
		let job = queue.create("email", data);
		job.priority("high");
		job.delay(5000);
		job.removeOnComplete(true);   //完成后自动移除任务
		job.save(err => {
			console.log("[%j] job save finish jobId: %j", new Date().toLocaleString(), job.id);
		});
		jobEvents(job);

		queue.process("email", 1, function (job, done) {
			console.log("[%j] queue.process jobId: %j", new Date().toLocaleString(), job.id);
			setTimeout(done, 5000);   //执行done后才会自动执行remove操作
		});
	});
}

function jobRemove() {
	flushRedis().then(() => {
		let data = {a: 10, b: 20};
		let job = queue.create("email", data);
		job.priority("high");
		job.delay(5000);
		job.save(err => {
			console.log("[%j] job save finish jobId: %j", new Date().toLocaleString(), job.id);
		});
		jobEvents(job);
		job.on("complete", result => {
			console.log("[%j] job complete done id: %j, result: %j", new Date().toLocaleString(), job.id, result);
			job.remove(() => {  //移除任务
				console.log("[%j] job remove finish id: %j, arguments: %j", new Date().toLocaleString(), job.id, arguments);
			});
		});
		queue.process("email", 1, function (job, done) {
			console.log("[%j] queue.process jobId: %j", new Date().toLocaleString(), job.id);
			setTimeout(done, 5000);   //执行done后才会自动执行remove操作
		});
	});
}










