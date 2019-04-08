/**
 * Created by wyq on 2019/1/18.
 * 中午12点
 1
 推送条目：小屋礼包
 推送时间：每天中午12点
 推送条件：若中午12点前玩家未触发过小屋礼包（开启倒计时算触发）
 实现逻辑
 标签A

 推送消息：XX（当前小屋设置男主名称）有话想对你说，他在这里等了你很久，点这里快点到他身边......
 其中XX为玩家当前小屋设置男主名称，若玩家未设置则显示为男主

 2
 推送条目：每日签到奖励
 推送时间：每天中午12点
 推送条件：若中午12点前玩家签到奖励未领取
 实现逻辑
 标签B

 推送信息：您有奖励未领取！点击这里快来领取今日奖励！

 二者均满足则仅推送1，二者均不满足则不推送
 */

/*
const JPushAsync = require("jpush-async").JPushAsync;

let clientAsync = JPushAsync.buildClient("aaa", "bbb", 5);

run().then(response => {
	console.log("run script response: %j", response);
	return setTimeout(process.exit, 1000, 0);
}).catch(err => {
	console.log("run err: %j", err.stack || err.message || err);
	return setTimeout(process.exit, 1000, 0);
});

async function run() {
	let response = await clientAsync
		.push()
		.setPlatform("android")
		.setAudience(JPushAsync.alias("3486725455106"))
		.setNotification("msg");
	return response;
}*/


const JPush = require("jpush-async").JPush;
let client = JPush.buildClient("aaa", "bbb", 5);
client
	.push()
	.setPlatform("android") //设置 platform，本方法接收 JPush.ALL, android, ios这几个参数
	.setAudience(JPush.alias("10000", "10001")) //const client = JPush.buildClient("aaa", "bbb", 5);
	// .setAudience(JPush.alias("3486722424596")) //const client = JPush.buildClient("aaa", "bbb", 5);
	.setNotification('Hi, JPush testaaaaaabbbbb')
	.setOptions(null, 60)  //设置 options，本方法接收 5 个参数，sendno(int), time_to_live(int), override_msg_id(int), apns_production(boolean), big_push_duration(int)
	.send(function (err, res) {
		if (err) {
			if (err instanceof JPush.APIConnectionError) {
				console.log(err.message)
			} else if (err instanceof JPush.APIRequestError) {
				console.log(err.message)
			}
		} else {
			console.log('Sendno: ' + res.sendno);
			console.log('Msg_id: ' + res.msg_id);
		}
	});
return;


/*

setTimeout(function () {    //为防止不能正常终结，一个小时后自动杀掉进程
	logger.info("stop script");
	return setTimeout(process.exit, 1000, 0);
}, 3600 * 1000);

const pushTag1 = `push_1_${moment().format('YYYY_MM_DD')}`; //like push_1_2018_03_01
const pushTag2 = `push_2_${moment().format('YYYY_MM_DD')}`; //like push_1_2018_03_01

const pushTag1Msg = "我有话想对你说，在这里等着你。点击此处快速到他身边......";
const pushTag2Msg = "您有奖励未领取！点击这里快来领取今日奖励！";

run()
	.then(response => {
		logger.info("run script response: %s", response);
		return setTimeout(process.exit, 1000, 0);
	}).catch(err => {
	logger.error("run err: %s", err.stack || err.message || err);
	return setTimeout(process.exit, 1000, 0);
});

async function run() {
	for (let item of jPushSetting) {
		await sendJPushMsg1(item.AppKey, item.Master_Secret, pushTag1Msg);
		await sendJPushMsg2(item.AppKey, item.Master_Secret, pushTag2Msg);
	}

	return "===================== SUCCESS =====================";
}

//中午12点	1	1	record_push_001	{0}有话想对你说，他在这里等了你很久，点这里快点到他身边......	push_1_2018_03_01
async function sendJPushMsg1(jPushAppKey, jPushMaster_Secret, msg) {
	const JPushClient = JPush.buildClient(jPushAppKey, jPushMaster_Secret, 5);
	return new Bluebird((resolve, reject) => {
		JPushClient
			.push()
			.setPlatform(JPush.ALL)
			.setAudience(JPush.alias())   //not pushTag1
			.setNotification(msg)
			.setOptions(null, 60)
			.send(function (err, res) {
				if (!!err) {
					logger.error("sendJPushMsg err: %s, msg: %s", err.stack || err.message || err, msg);
					return reject(err)
				}

				logger.info("sendJPushMsg finish res: %s, msg: %s", res, msg);
				return resolve(res);
			});
	});
}

//中午12点	2	2	record_push_002	您有奖励未领取！点击这里快来领取今日奖励！	push_2_2018_03_01
async function sendJPushMsg2(jPushAppKey, jPushMaster_Secret, msg) {
	const JPushClient = JPush.buildClient(jPushAppKey, jPushMaster_Secret, 5);
	return new Bluebird((resolve, reject) => {
		JPushClient
			.push()
			.setPlatform(JPush.ALL)
			.setAudience(JPush.tag_and(pushTag1)) // pushTag1 AND (NOT pushTag2)
			.setAudience(JPush.tag_not(pushTag2))
			.setNotification(msg)
			.setOptions(null, 60)
			.send(function (err, res) {
				if (!!err) {
					logger.error("sendJPushMsg err: %s, msg: %s", err.stack || err.message || err, msg);
					return reject(err)
				}

				logger.info("sendJPushMsg finish res: %s, msg: %s", res, msg);
				return resolve(res);
			});
	});
}

const client = JPush.buildClient("aaa", "bbb", 5);
client
	.push()
	.setPlatform(JPush.ALL) //设置 platform，本方法接收 JPush.ALL, android, ios这几个参数

	// .setAudience(JPush.alias("3486725455106")) //const client = JPush.buildClient("aaa", "bbb", 5);
	.setAudience(JPush.alias("3486722424596")) //const client = JPush.buildClient("aaa", "bbb", 5);
	.setNotification('Hi, JPush test')
	.setOptions(null, 60)  //设置 options，本方法接收 5 个参数，sendno(int), time_to_live(int), override_msg_id(int), apns_production(boolean), big_push_duration(int)
	.send(function (err, res) {
		if (err) {
			if (err instanceof JPush.APIConnectionError) {
				console.log(err.message)
			} else if (err instanceof JPush.APIRequestError) {
				console.log(err.message)
			}
		} else {
			console.log('Sendno: ' + res.sendno);
			console.log('Msg_id: ' + res.msg_id);
		}
	});


const client = JPush.buildClient("aaa", "bbb", 5);
client
	.push()
	.setPlatform("android") //设置 platform，本方法接收 JPush.ALL, android, ios这几个参数

	.setAudience(JPush.alias("3486725455106")) //const client = JPush.buildClient("aaa", "bbb", 5);
	// .setAudience(JPush.alias("3486722424596")) //const client = JPush.buildClient("aaa", "bbb", 5);
	.setNotification('Hi, JPush test')
	.setOptions(null, 60)  //设置 options，本方法接收 5 个参数，sendno(int), time_to_live(int), override_msg_id(int), apns_production(boolean), big_push_duration(int)
	.send(function (err, res) {
		if (err) {
			if (err instanceof JPush.APIConnectionError) {
				console.log(err.message)
			} else if (err instanceof JPush.APIRequestError) {
				console.log(err.message)
			}
		} else {
			console.log('Sendno: ' + res.sendno);
			console.log('Msg_id: ' + res.msg_id);
		}
	});
return;


run().then(response => {
	logger.info("run script response: %s", response);
	return setTimeout(process.exit, 1000, 0);
}).catch(err => {
	logger.error("run err: %s", err.stack || err.message || err);
	return setTimeout(process.exit, 1000, 0);
});

async function run() {
	const client = JPush.buildClient("aaa", "bbb", 5);
	let res = await client
		.push()
		.setPlatform("android")
		.setAudience(JPush.alias("3486725455106", "3486722424596"))
		.setNotification('Hi, JPush test');
	console.log("%j", res);
	return res;
}*/