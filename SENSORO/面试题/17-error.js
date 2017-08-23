/**
 * Created by wyq on 17/8/21.
 * 错误处理/调试
 */
const os = require("os");

function t1() {
	console.log(os.constants.errno);    //常见的系统错误列表
}
t1();