var val = {
	//srcData、response
	data: {
		appId: '123456789ABC',
		sn: '0117C9XXXX',
		type: 'text',         // 消息类型, text 普通消息
		deviceType: 'node',
		createdTime: '',
		msgId: '',                     //消息 id
		//updateDevice->data
		data: {                        // 明文
			id: "任务id",                //A
			cmdRet: "任务结果",          //A
			appParam: {
				uploadInterval: "传输周期",//A
				nodeState: "运动状态"      //B
			},
			battery: "电量",             //A
			gps: {
				latitude: "纬度",          //B
				longitude: "经度"          //B
			}
		},
		encryptData: ''   // 安全模式开启后的加密密文
	},
	createdTime: new Date()
};

let taskId = 1;
while (-1 !== [1, 2, 3, 9, 5, 6].indexOf(taskId)) {    //创建一个不重复的taskId
	taskId = taskId + 1;
}
console.log(taskId);