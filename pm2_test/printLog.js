/**
 * Created by wyq on 2016/5/24.
 */

setInterval(function () {
	console.log("%j -- info timeStamp", new Date().toLocaleString(), +new Date());
	console.error("%j -- error timeStamp", new Date().toLocaleString(), +new Date());
}, 1000);

//pm2 start printLog.js -l pm2_log.log
//pm2 list
//pm2 monit
//pm2 stop ID