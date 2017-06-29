/**
 * Created by wyq on 17/6/29.
 */
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
	input: fs.createReadStream('/Users/sensoro/bynf/test/fs_逐行读取文件内容.js')
});

rl.on('line', (line) => {
	rl.pause();
	console.log(`文件的单行内容：${line}`);
	setTimeout(function () {
		rl.resume();
	}, 1000);
});