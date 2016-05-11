/**
 * Created by wyq on 2016/2/3.
 */
var Step = require("step");
var fs = require("fs");

var waterfall = function () {
	Step(
		function readFile1() {
			fs.readFile('test.txt', 'utf-8', this);
		},
		function readFile2(err, content) {
			console.log("arguments0: %j", arguments);
			fs.readFile('dir.txt', 'utf-8', this);
		},
		function done(err, content) {
			console.log("arguments1: %j", arguments);
		}
	);

};

var parallel = function () {
	Step(
		function readFile() {
			fs.readFile('dir.txt', 'utf-8', this.parallel());
			fs.readFile('test.txt', 'utf-8', this.parallel());
		},
		function done() {
			console.log(arguments);
		}
	);
};

Step(
	function readDir() {
		fs.readdir(__dirname, this);
	},
	function readFiles(err, results) {
		console.log("=== err: %j, results: %j", err, results);
		if (err) throw err;
// Create a new group
		var group = this.group();
		results.forEach(function (filename) {
			if (/\.js$/.test(filename)) {
				fs.readFile(__dirname + "/" + filename, 'utf8', group());
			}
		});
	},
	function showAll(err, files) {
		if (err) throw err;
		console.dir(files);
	}
);