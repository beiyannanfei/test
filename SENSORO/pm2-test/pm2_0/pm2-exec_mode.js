/**
 * Created by wyq on 17/5/26.
 * 练习通过使用processes.json来启动(只启动一个实例)
 */
let port = process.env.PORT;
let pid = process.pid;
let env = process.env.NODE_ENV;
setInterval(() => {
	console.log("[%j]=========== port: %j, pid: %j, env: %j", new Date().toLocaleString(), port, pid, env);
}, 1000);

// /Users/sensoro/bynf/test/SENSORO/pm2-test/pm2_0/pm2-exec_mode.js