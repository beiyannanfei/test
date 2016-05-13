var CronJob = require('cron').CronJob;

var start = function () {
	console.log("===========: %j", new Date().toLocaleString())
};

var cronStr = "20 */5 * * * *";
new CronJob(cronStr, function () {
	start();
}, null, true);