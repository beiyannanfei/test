/**
 * Created by wyq on 16/12/12.
 */
var kue = require("kue");

// create our job queue

var jobs = kue.createQueue();

// start redis with $ redis-server

// create some jobs at random,
// usually you would create these
// in your http processes upon
// user input etc.

function create() {
	var name = ['tobi', 'loki', 'jane', 'manny'][Math.random() * 4 | 0];
	var job = jobs.create('video conversion', {
		title: 'converting ' + name + '\'s to avi', user: 1, frames: 200
	});

	job.on('complete', function () {
		console.log(" === %s Job complete", job.id);
	}).on('failed', function () {
		console.log(" Job failed");
	}).on('progress', function (progress) {
		// process.stdout.write('\r  job #' + job.id + ' ' + progress + '% complete');
		console.log('  job #' + job.id + ' ' + progress + '% complete');
	});

	job.save(function (err) {
		console.log("job #%s save finish", job.id);
	});

	// setTimeout(create, Math.random() * 2000 | 0);
}

create();
setTimeout(create, 100);
setTimeout(create, 200);


//在同一时间执行的任务个数
jobs.process('video conversion', 2, function (job, done) {
	var frames = job.data.frames;

	function next(i) {
		// pretend we are doing some work
		convertFrame(i, function (err) {
			if (err) {
				return done(err);
			}
			// report progress, i/frames complete
			job.progress(i, frames);
			if (i >= frames) {
				done();
			}
			else {
				next(i + Math.random() * 10);
			}
		});
	}

	next(0);
});

function convertFrame(i, fn) {
	setTimeout(fn, 500);
}

// start the UI
kue.app.listen(3000);
console.log('UI started on port 3000');
