/**
 * Created by chenjie on 2015/1/5.
 */

var _ = require('underscore')
var NODE_ENV = require('./env-config.js')
NODE_ENV = NODE_ENV.toString().toUpperCase()

var DEV_CONFIG = {
    "NODE_ENV": "dev",
    "domain":"http://mall.dev.tvm.cn",
    "userHost":"http://mb.dev.tvm.cn",
    "wmhUrl":"http://mtq.dev.tvm.cn",
    "wmhAuth": {appId: "wsc", secret: "29d6f426482c01337a87758da91a425d", redirect_uri: "http://mall.dev.tvm.cn/admin/auth", loginUrl: 'http://10.10.32.90/passport/login'},
    "bussinessDomain": "http://business.dev.tvm.cn",
    "yaoHost": "http://t9.dev.tvm.cn",
    "mongodb":{
        "master": {url: "mongodb://mall:mall_pass@10.10.42.25:27017/mall", opts: {}},
        "slave": {url: "mongodb://mall:mall_pass@10.10.42.25:27017/mall", opts: {}}
    },
    "redis":{
        "host":"10.10.42.25",
        "port":6379
    },
    "cache_redis":[
        {"host":"10.10.32.101", "port":6379},
        {"host":"10.10.32.101", "port":6380},
        {"host":"10.10.32.101", "port":6379},
        {"host":"10.10.32.101", "port":6380},
        {"host":"10.10.32.101", "port":6379},
        {"host":"10.10.32.101", "port":6380},
        {"host":"10.10.32.101", "port":6379},
        {"host":"10.10.32.101", "port":6380},
        {"host":"10.10.32.101", "port":6379},
        {"host":"10.10.32.101", "port":6380}
    ],
    "userGroupRedis":{
        "host":"10.20.30.61",
        "port":6380
    },
    "pvRedis": {
        "host":"10.10.42.25",
        "port":6379
    },
	"queueRedis":{
		"host":"10.10.42.25",
		"port":6379
	},
	couponRedis: {
		"host": "10.10.42.25",
		"port": 6379
	},
    openApi: {
        ip: '10.10.42.25',
        port: 2379
    },
    menuHTML: 'menu_dev.html',   //  views/layouts
    log4jsconfig:{
        "appenders": [{
            "type": "dateFile",
            "absolute": true,
            "filename": "logs/log.log",
            "pattern": "-yyyy-MM-dd"
        }, {
            "type": "dateFile",
            "absolute": true,
            "filename": "logs/access.log",
            "pattern": "-yyyy-MM-dd",
            "category":"Express"
        },{
            "type": "console"
        }
        ],
        "levels": {
            "logger": "trace"
        },
        replaceConsole: true
    }
}

var QA_CONFIG = {
    "NODE_ENV": "qa",
    "domain":"http://qa.tmall.mtq.tvm.cn",
    "userHost":"http://qa.mb.mtq.tvm.cn",
    "wmhUrl":"http://qa.www.mtq.tvm.cn",
    "wmhAuth": {appId: "wsc", secret: "29d6f426482c01337a87758da91a425d", redirect_uri: "http://qa.tmall.mtq.tvm.cn/admin/auth", loginUrl: 'http://qa.sso.mtq.tvm.cn/passport/login'},
    "bussinessDomain": "http://qa.business.mtq.tvm.cn",
    "mongodb":{
        "master": {url: "mongodb://mall:mall_pass@10.105.66.116:27017/mall", opts: {}},
        "slave": {url: "mongodb://10.105.66.115:27001/mall", opts: {slaveOk: true}}
    },
    "redis":{
        "host":"10.105.51.52",
        "port":6385
    },
    "cache_redis":[
        {"host":"10.105.51.52", "port":6387},
        {"host":"10.105.51.52", "port":6388}
    ],
    "userGroupRedis":{
        "host":"10.105.51.52",
        "port":6385
    },
    "pvRedis": {
        "host":"10.105.51.52",
        "port":6379
    },
	"queueRedis":{
		"host":"10.105.51.52",
		"port":6385
	},
	couponRedis: {
		"host":"10.105.51.52",
		"port":6385
	},
    openApi: {
        ip: '10.105.15.110',
        port: 8080
    },
    menuHTML: 'menu_qa.html'   //  views/layouts
}

var QCLOUD_CONFIG = {
    "NODE_ENV": "qcloud",
    "domain":"http://tmall.mtq.tvm.cn",
    "userHost":"http://mb.mtq.tvm.cn",
    "wmhUrl":"http://www.mtq.tvm.cn",
    "wmhAuth": {appId: "wsc", secret: "29d6f426482c01337a87758da91a425d", redirect_uri: "http://tmall.mtq.tvm.cn/admin/auth", loginUrl: 'http://sso.mtq.tvm.cn/passport/login'},
    "bussinessDomain": "http://business.mtq.tvm.cn",
    "mongodb":{
        "master": {url: "mongodb://mall:mall_pass@10.131.226.169:27017/mall", opts: {}},
        "slave": {url: "mongodb://10.131.184.52:27001/mall", opts: {slaveOk: true}}
    },
    "redis":{
        "host":"10.105.35.129",
        "port":6385
    },
    "cache_redis":[
        {"host":"10.105.35.129", "port":6387},
        {"host":"10.105.35.129", "port":6388},
        {"host":"10.105.35.129", "port":6387},
        {"host":"10.105.35.129", "port":6388},
        {"host":"10.105.35.129", "port":6387},
        {"host":"10.105.35.129", "port":6388},
    ],
    "userGroupRedis":{
        "host":"10.105.35.129",
        "port":6385
    },
    "pvRedis": {
        "host":"10.105.35.129",
        "port":6385
    },
	"queueRedis":{
		"host":"10.105.35.129",
		"port":6385
	},
	couponRedis: {
		"host":"10.105.35.129",
		"port":6385
	},
    openApi: {
        ip: '10.105.15.110',
        port: 8081
    },
    menuHTML: 'menu_qcloud.html'   //  views/layouts
}

var CONFIG = {
    "scan":{
        "recommend":1000
    },
    "integral":1000,
    "path":"/pointMall",
    "fileUploadDir":"/mnt/pic",
    "nginxFileDir":"/pic",
    "token":"7fda67277f",
    "tvmMallToken": "10663ea56754", //35o4zts2mwgdenkvpqrf0u
    "port": 6002,
    "tvmcloudDomain":  "http://api.pan.tvmcloud.com",
    "log4jsconfig" :{
        "appenders": [{
            "type": "dateFile",
            "absolute": true,
            "filename": "/opt/logs/tmall.log",
            "pattern": "-yyyy-MM-dd"
        }, {
            "type": "dateFile",
            "absolute": true,
            "filename": "/opt/logs/access.log",
            "pattern": "-yyyy-MM-dd",
            "category":"Express"
        },{
            "type": "console"
        }
        ],
        "levels": {
            "logger": "trace"
        },
        replaceConsole: true
    }
}

if (NODE_ENV == 'QA'){
    CONFIG = _.extend(CONFIG, QA_CONFIG)
} else if (NODE_ENV == 'QCLOUD'){
    CONFIG = _.extend(CONFIG, QCLOUD_CONFIG)
} else {
    CONFIG = _.extend(CONFIG, DEV_CONFIG)
}
module.exports = CONFIG