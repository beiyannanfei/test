/**
 * Created by wyq on 18/1/9.
 */
process.on('uncaughtException', function (err) {
	//打印出错误
	console.log(err);
	//打印出错误的调用栈方便调试
	console.log(err.stack);
});

let a = {};
console.log(a.b.c);