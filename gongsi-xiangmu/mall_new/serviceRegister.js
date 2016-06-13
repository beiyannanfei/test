var Etcd   = require('node-etcd');
var path   = require('path');
var _      = require('underscore');
var os = require('os');

var config = require('./config');

function getLocalMachineEth0Ip() {
	var ipAddress = '127.0.0.1';
	var ifaces = os.networkInterfaces();
	if(ifaces['eth0']) {
		ipAddress =  _.find(ifaces['eth0'],function(iface) {
			return 'IPv4' === iface.family && iface.internal === false;
		}).address;
	}
	console.log('服务发现使用ip地址: ' + ipAddress);
	if(config.NODE_ENV == 'dev'){
		return '10.10.42.25';
	} else {
		return ipAddress;
	}
}

function getSetTtlFunttion(etcd,key,value,ttl) {
	return function setTtlOnService() {
		etcd.set(key, value, {ttl: ttl});
		setTimeout(setTtlOnService, 8000);
	};
}

var self = module.exports = {
	initApp:function() {
		var etcd = new Etcd(config.openApi.ip, config.openApi.port);
		etcd.create('/services/mallApi',JSON.stringify(
			{
				address:'http://' + getLocalMachineEth0Ip() + ':' + 6002 + '/open',
				methods:[
					{path:'/lottery/add/times', name:'addLotteryTimes', http_method:'POST'},
					{path:'/lottery/draw', name:'doLottery', http_method:'POST'},
					{path:'/lottery/record/list', name:'lotteryRecord', http_method:'GET'},
					{path:'/activity/goods', name:'ActivityGoods', http_method:'GET'},
					{path:'/activity/info', name:'ActivityInfo', http_method: 'GET'},
					{path:'/activity/goods/lottery/count', name:'ActivityGoodsCount', http_method: 'GET'},
					{path:'/activity/lottery/count', name:'ActivityLotteryCount', http_method: 'GET'},
					{path:'/lottery/exchange/goods', name:'LotteryExchangeGoods', http_method: 'POST'},
				]
			}
			),function(err, d) {
				if(!err) {
					getSetTtlFunttion(etcd,d.node.key,d.node.value,10)();
				}else {
					console.error('向etcd服务器注册服务失败');
				}
			}
		);
	}
};

self.__module = {
    provides: ['initApp']
};

self.initApp()