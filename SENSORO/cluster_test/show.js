/**
 * Created by wyq on 17/6/28.
 */
setInterval(function () {
	console.log("[%j] ==== %j", new Date().toLocaleString(), process.pid);
}, 1000);