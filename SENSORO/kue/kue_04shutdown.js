/**
 * Created by wyq on 16/12/12.
 */
var kue = require("kue");

var jobs = kue.createQueue();


function generateJobs() {
	for (var i = 0; i < 12; i++) {
		console.log('Creating Job #' + i);
		jobs.create('long render', {
			title: 'rendering frame #' + i
		}).save();
	}
}


jobs.process('long render', 4, function (job, done) {
	console.log('Starting ' + job.data.title);
	setTimeout(function () {
		console.log('Finished ' + job.data.title);
		done();
	}, 3000);
});


generateJobs();

setTimeout(function () {
	console.log('[ Shutting down when all jobs finish... ]');
	jobs.shutdown(function (err) {  //会在已执行但是还未完成的job完成后执行
		console.log('[ All jobs finished. Kue is shut down. ]');
		process.exit(0);
	})
}, 4200);


