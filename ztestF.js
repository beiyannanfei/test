{
	"mongodb": {
	"host": "localhost",
		"database": "smart-city-api"
},

	"redis": {
	"host": "localhost",
		"port": 6379,
		"databaseIndex": 1
},
	"redis_config": {
	"expireTime_time": 5
},

	"bcrypt": {
	"rounds": 1
},

	"sessionSecret": "test",

	"yunpian": {
	// 短信发送host
	"sms_host":"sms.yunpian.com",
		// 指定模板发送接口https地址
		"send_tpl_sms_uri":"/v1/sms/tpl_send.json",
		//用户key
		"api_key": "26d4084c4cc0902925459f20ead5604a",
		"system": {
		"alarm_tpl_id": "1699228", //报警模板id
			"ok_tpl_id": "1699230" // 恢复正常模板id
	}
},
	"logger": {
	"logDir": "/logs",
		"level": "debug",
		"output": true
},
	"qiniu": {
	"bucketname": "sensoro-wechat",
		"ACCESS_KEY": "ds-uUH_gLTmmdWvXIcIIUxCIgM6LZ6MKJlBbxoJs",
		"SECRET_KEY": "AGLX0HQDa9HCHzbACtWrNUznUV5GepKSTlT8t6rU",
		"domain": "http://7u2jeb.com1.z0.glb.clouddn.com/"
}
}