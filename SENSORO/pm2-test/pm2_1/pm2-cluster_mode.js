/**
 * Created by wyq on 17/5/26.
 * 集群启动方式
 */
let port = process.env.PORT;
let pid = process.pid;
let env = process.env.NODE_ENV;
setInterval(() => {
	console.log("[%j]=========== port: %j, pid: %j, env: %j", new Date().toLocaleString(), port, pid, env);
}, 1000);

// /Users/sensoro/bynf/test/SENSORO/pm2-test/pm2_1/pm2-cluster_mode.js
