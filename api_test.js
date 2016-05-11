/**
 * Created by wyq on 2016/3/23.
 */

var util = require("util");
var tls = require('tls');
var os = require('os');

console.log("__filename: %s", __filename);
console.log("__dirname: %s", __dirname);

process.on('exit', function () {
	// 设置一个延迟执行
	setTimeout(function () {
		console.log('主事件循环已停止，所以不会执行');
	}, 0);
	console.log('退出前执行');
});

console.log('当前目录：' + process.cwd());
try {
	process.chdir('f:\\work\\tianmaijuyuan');
	console.log('新目录：' + process.cwd());
}
catch (err) {
	console.log('chdir: ' + err);
}

if (process.getuid) {   //适用于Unix、Linux等平台
	console.log('当前 uid: ' + process.getuid());
}

console.log('版本: ' + process.version);      //版本: v4.0.0

console.log("process.versions: %j", process.versions);  //process.versions: {"http_parser":"2.5.0","node":"4.0.0","v8":"4.5.103.30","uv":"1.7.3","zlib":"1.2.8","ares":"1.10.1-DEV","modules":"46","openssl":"1.0.2d"}

console.log('当前进程 id: ' + process.pid); //当前进程 id: 29800

console.log('当前CPU架构是：' + process.arch);    //当前CPU架构是：x64

console.log('当前系统平台是： ' + process.platform);    //当前系统平台是： win32

console.log(util.inspect(process.memoryUsage()));       //{ rss: 16773120, heapTotal: 9275392, heapUsed: 4031312 }

console.log('开始');
process.nextTick(function () {
	console.log('nextTick 回调');
});
console.log('已设定');

console.log("Node 程序已运行的秒数: %j", process.uptime()); //Node 程序已运行的秒数: 0.236

console.log("SSL加密器: %j", tls.getCiphers());

console.log("操作系统默认的临时文件目录: %s", os.tmpdir());

console.log("CPU 的字节序: %s", os.endianness());

console.log("操作系统的主机名: %s", os.hostname());

console.log("操作系统名称: %s", os.type());

console.log("操作系统平台: %s", os.platform());



