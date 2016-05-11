var CronJob = require('cron').CronJob;

var job = '*/2 * * * * *';
new CronJob(job, function() {
    console.log("%j, aaaa", new Date().toLocaleString());
}, null, true);