/**
 * Created by wyq on 17/6/28.
 */
const cluster = require("cluster");
const cpuNum = require('os').cpus().length;

if (cluster.isMaster) {
	for (let i = 0; i < cpuNum; ++i) {
		cluster.fork();
	}
}
else {
	require("./show");
}