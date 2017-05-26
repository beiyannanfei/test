/**
 * Created by wyq on 17/5/26.
 * watch-文件变化pm2自动重载
 */
// /Users/sensoro/bynf/test/SENSORO/pm2-test/pm2_2/app/pm2-watch.js

console.log("******* start");

function show() {
	let port = process.env.PORT;
	let pid = process.pid;
	let env = process.env.NODE_ENV;
	console.log("======= port: %j, pid: %j, env: %j", port, pid, env);
}

setInterval(show, 1000);