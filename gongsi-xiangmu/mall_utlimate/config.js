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
    "mongodb":{
        "links":"mongodb://mall_ultimate:mall_ultimate_pass@10.10.42.25:27017/mall_ultimate"
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
    menuHTML: 'menu_dev.html',   //  views/layouts
    log4jsconfig:{
        "appenders": [{
            "type": "dateFile",
            "absolute": true,
            "filename": "log.log",
            "pattern": "-yyyy-MM-dd"
        }, {
            "type": "dateFile",
            "absolute": true,
            "filename": "access.log",
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

var CONFIG = {
    "fileUploadDir":"/mnt/pic",
    "nginxFileDir":"/pic",
    "token":"7fda67277f",
    "tvmMallToken": "35o4zts2mwgdenkvpqrf0u",
    "port": 6600,
    "log4jsconfig" :{
        "appenders": [{
            "type": "dateFile",
            "absolute": true,
            "filename": "/opt/logs/mall_ultimate.log",
            "pattern": "-yyyy-MM-dd"
        }, {
            "type": "dateFile",
            "absolute": true,
            "filename": "/opt/logs/mall_ultimate_access.log",
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

CONFIG = _.extend(CONFIG, DEV_CONFIG)
module.exports = CONFIG