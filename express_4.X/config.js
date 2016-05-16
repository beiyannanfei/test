/**
 * Created by wyq on 2016/5/13.
 */
/**
 * Created by wyq on 2016/5/6.
 */

var _ = require("underscore");

var publicConfig = {
	port: 9002,
	log4jsconfig: {
		"appenders": [
			{
				"type": "dateFile",
				"absolute": true,
				"filename": "./logs/tmall.log",
				"pattern": "-yyyy-MM-dd"
			},
			{
				"type": "dateFile",
				"absolute": true,
				"filename": "./logs/access.log",
				"pattern": "-yyyy-MM-dd",
				"category": "Express"
			},
			{
				"type": "console"
			}
		],
		"levels": {
			"logger": "trace"
		},
		replaceConsole: true
	}
};

var DEV_CONFIG = {
	NODE_ENV: "dev",
	redis: {
		host: "127.0.0.1",
		port: 6379
	},
	mongo: {
		master: {url: "mongodb://127.0.0.1:27017/wyq_test", opts: {}},
		slave: {url: "mongodb://127.0.0.1:27017/wyq_test", opts: {}}
	}
};


var CONFIG = _.extend(publicConfig, DEV_CONFIG);

module.exports = CONFIG;
