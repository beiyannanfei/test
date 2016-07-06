var fs = require('fs');

var filePath = "F:/工作积累/天脉聚源/test/fs_test_dir/a1.txt";
var dirPath = "F:/工作积累/天脉聚源/test/fs_test_dir/";

var f1 = function () {  //删除文件
	fs.unlink(filePath, function (err) {
		console.log("err: %j", err)
	});

	fs.unlinkSync(filePath);
	console.log("delete success");
};

var f2 = function () {
	fs.rename("F:/工作积累/天脉聚源/test/fs_test_dir/a12.txt", filePath, function (err) {
		console.log("err: %j", err);
	});
};

var f3 = function () {
	fs.stat(filePath, function (err, results) {
		console.log("err: %j, results: %j", err, results);
	});
};

var f4 = function () {
	fs.readdir(dirPath, function (err, results) {
		console.log("err: %j, results: %j", err, results);
	});
};

var f5 = function () {
	fs.readFile(filePath, {encoding: "Utf8"}, function (err, results) {
		console.log("err: %j, results: \n%s", err, results);
	});
};

var f6 = function () {
	fs.writeFile("F:/工作积累/天脉聚源/test/fs_test_dir/a2.txt",
		'\n' + filePath,
		{encoding: 'utf8', mode: 438, flag: 'a+'},
		function (err, results) {
			console.log("err: %j, results: %j", err, results);
		});
};

var f7 = function () {
	fs.watchFile(filePath, {interval: 1000}, function (curr, prev) {
		console.log('the current mtime is: %j', curr);
		console.log('the previous mtime was: %j', prev);
	});
};

var f8 = function () {
	fs.watch(dirPath, function (event, filename) {
		console.log('event is: ' + event);
		if (filename) {
			console.log('filename provided: ' + filename);
		} else {
			console.log('filename not provided');
		}
	});
};
/*
 var filename = require.resolve("./ztest0.js");
 console.log("**** filename: %j", filename);
 fs.watchFile(filename, function (current, previous) {
 console.log("current: %j", current);
 console.log("previous: %j", previous);

 current = {
 "dev": 2019400077,
 "mode": 33206,
 "nlink": 1,
 "uid": 0,
 "gid": 0,
 "rdev": 0,
 "ino": 6755399441071153,
 "size": 1,
 "atime": "2015-11-26T04:07:53.025Z",        //访问时间 - 文件的最后访问时间
 "mtime": "2015-11-26T04:07:53.025Z",        //修改时间 - 文件的最后修改时间
 "ctime": "2015-11-26T04:07:53.026Z",        //改变时间 - 文件状态(inode)的最后修改时间
 "birthtime": "2015-11-26T04:07:53.025Z"     //文件创建时间，文件创建时生成
 };
 previous = {
 "dev": 2019400077,
 "mode": 33206,
 "nlink": 1,
 "uid": 0,
 "gid": 0,
 "rdev": 0,
 "ino": 7881299347913804,
 "size": 0,
 "atime": "2015-11-26T04:03:09.864Z",
 "mtime": "2015-11-26T04:03:09.864Z",
 "ctime": "2015-11-26T04:03:09.865Z",
 "birthtime": "2015-11-26T04:03:09.864Z"
 };
 });*/

var fileCon = fs.readFileSync(__filename, "utf-8");
console.log(fileCon);


