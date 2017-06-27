let a = {
	"mongodb": {
		"host": "192.168.209.4",
		"database": "city",
		"username": "sensoro",
		"password": "testpass",
		"replsets": [{
			"host": "192.168.209.5:27017"
		}]
	},

	"redis": {
		"host": "localhost",
		"port": 6379,
		"databaseIndex": 6,
		"dataDvIndex": 7
	},

	"redis_config": {
		"expireTime_time": 300
	},

	"bcrypt": {
		"rounds": 1
	},

	"sessionSecret": "smart_city",

	"sensoro": {
		"appId": "zUTCaSuFGSo0",
		"appKey": "QP3Pg6TxdqwSY4eCE7iLJylAzh08bAL0iA28CpFEA17",
		"appSecret": "KwgE15FRGndxSZgnozz9cJryxiZ2ete6"
	},

	"qiniu": {
		"bucketname": "sensoro-city",
		"ACCESS_KEY": "ds-uUH_gLTmmdWvXIcIIUxCIgM6LZ6MKJlBbxoJs",
		"SECRET_KEY": "AGLX0HQDa9HCHzbACtWrNUznUV5GepKSTlT8t6rU",
		"domain": "https://resource-city.sensoro.com/"
	},

	"baseURL": "iot-api.sensoro.com",
	"yunpian": {
		// 短信发送host
		"sms_host": "sms.yunpian.com",
		// 指定模板发送接口https地址
		"send_tpl_sms_uri": "/v1/sms/tpl_send.json",
		"alarm_tpl_id": "1643548", //报警模板id
		"ok_tpl_id": "1643906", // 恢复正常模板id

		//用户key
		"api_key": "a6b6f48579b1c5a237d2874467b3f3e3",
		"system": {
			"alarm_tpl_id": "1699228",
			"ok_tpl_id": "1699230"
		}
	},

	"crontab": {
		"nodeCommand": "NODE_ENV=production /usr/bin/node",
		"shellCommand": "/bin/bash",
		"logTidy": "0 1 * * *"
	},
	"logger": {
		"logDir": "/logs",
		"level": "debug",
		"output": true
	}
}