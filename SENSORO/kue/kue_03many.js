/**
 * Created by wyq on 16/12/12.
 */
var kue = require("kue");
// create our job queue

var jobs = kue.createQueue();

function create() {
	var name = ['tobi', 'loki', 'jane', 'manny'][Math.random() * 4 | 0];
	var job = jobs.create('video conversion', {
		title: 'converting ' + name + '\'s to avi', user: 1, frames: 200
	}).save(function () {
		console.log("[%j] video #%j create finish", new Date().toLocaleString(), job.id);
	});

	job.on('complete', function () {
		console.log("[%j] video #%j complete", new Date().toLocaleString(), job.id);
	});
	// setTimeout( create, Math.random() * 3000 | 0 );
	setTimeout(create, 1000);
}

create();

function create2() {
	var name = ['tobi', 'loki', 'jane', 'manny'][Math.random() * 4 | 0];
	jobs.create('email', {
		title: 'emailing ' + name + '', body: 'hello'
	}).save();
	// setTimeout(create2, Math.random() * 1000 | 0);
	setTimeout(create2, 333);
}

// create2();

// process video conversion jobs, 2 at a time.

jobs.process('video conversion', 2, function (job, done) {
	console.log('[%j] video #%j', new Date().toLocaleString(), job.id);
	// setTimeout(done, Math.random() * 5000);
	setTimeout(done, 2000);
});

// process 10 emails at a time

jobs.process('email', 10, function (job, done) {
	console.log('email #%j', job.id);
	// setTimeout(done, Math.random() * 2000);
	setTimeout(done, 2000);
});

// start the UI
kue.app.listen(3000);
console.log('UI started on port 3000');