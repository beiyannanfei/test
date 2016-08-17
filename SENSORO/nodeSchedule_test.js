/**
 * Created by sensoro on 16/8/17.
 */
'use strict';
var schedule = require("node-schedule");

var t1 = function () {  //固定时间执行
	let date = new Date(2016, 7, 17, 15, 42, 0);
	let j0 = schedule.scheduleJob(date, function () {
		console.log("[%j] begin run", new Date().toLocaleString()); //["8/17/2016, 3:42:00 PM"] begin run
	});
};

var t2 = function () {  //每分钟的20秒执行
	let rule = new schedule.RecurrenceRule();
	rule.second = 20;
	let j = schedule.scheduleJob(rule, function () {
		console.log('[%j] run....', new Date().toLocaleString());
	});
};

var t3 = function () {  //在 第20 51~59秒执行
	let rule = new schedule.RecurrenceRule();
	rule.second = [20, new schedule.Range(51, 59)];
	let j = schedule.scheduleJob(rule, function () {
		console.log("[%j] run ... ", new Date().toLocaleString());
	});
};

var t4 = function () {  //每隔5秒执行
	let j = schedule.scheduleJob("*/5 * * * * *", function () {
		console.log('[%j] run ... ', new Date().toLocaleString());
	});
};

var t5 = function () {  //error 没有找到原因(后来发现是lib/schedule.js错误,用github上的替换即可成功执行)
	console.log("[%j] --- begin ---", new Date().toLocaleString());
	let startTime = new Date(Date.now() + 5000);
	let endTime = new Date(Date.now() + 10000);
	var j = schedule.scheduleJob({start: startTime, end: endTime, rule: '*/1 * * * * *'}, function () {
		console.log('[%j] Time for tea!', new Date().toLocaleString());
	});
};

t5();