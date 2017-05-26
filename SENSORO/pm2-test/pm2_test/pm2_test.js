/**
 * Created by wyq on 2016/5/24.
 */

setInterval(function () {
	console.log("%j -- info timeStamp", new Date().toLocaleString(), +new Date());
	console.error("%j -- error timeStamp", new Date().toLocaleString(), +new Date());
}, 1000);

//pm2 start printLog.js -l pm2_log.log
//pm2 list
//pm2 monit   查看cpu使用情况
//pm2 stop ID
//pm2 flush   清除日志
//pm2 desc ID  查看详情
//pm2 delete <pm2-exec_mode|0>    从列表中删除

