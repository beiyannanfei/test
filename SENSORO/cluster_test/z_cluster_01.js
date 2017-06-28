/**
 * Created by wyq on 17/6/28.
 */
const cluster = require("cluster");

let w = cluster.fork();
for (let i in w) {
	console.log(i, typeof w[i]);
}

