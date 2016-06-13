/**
 * Created by nice on 2015/6/23.
 */

var _ = require('underscore');
var NODE_ENV = require('./env-config.js');
NODE_ENV = NODE_ENV.toString().toUpperCase();

var DEV_CONFIG = {
    "NODE_ENV": "dev",
    "domain":"http://hudong-qa.tvmining.com",
    "userHost":"http://mb.dev.tvm.cn",
    "wtopicUrl":"http://218.241.171.213:8888",
    "searchUrl":"http://10.20.20.186:9010",
    "searchUrlTimeout":"http://10.20.20.186:9010",
    "wmhUrl":"http://t8.dev.tvm.cn",
    "h5Url":"http://h5.mtq.tvm.cn",
    "mongodb":{
        "links":"mongodb://integral:integral@10.10.42.25:37017/pointMall"
    },
    "redis":{
        "host":"10.10.42.25",
        "port":6379
    },
    "wmhSessionRedis":{
        "host":"10.10.32.81",
        "port":6379
    },
    "userGroupRedis":{
        "host":"10.20.30.61",
        "port":6380
    }
};

var PROD_CONFIG = {
    "NODE_ENV": "prod",
    "domain":"http://wx.mall.mtq.tvm.cn",
    "userHost":"http://wx.mb.mtq.tvm.cn",
    "wtopicUrl":"http://wx.wtopic.mtq.tvm.cn",
    "searchUrl":"http://10.20.30.71:9010",
    "searchUrlTimeout":"http://10.20.30.72:9010",
    "wmhUrl":"http://wx.iwmh.mtq.tvm.cn",
    "h5Url":"http://wx.h5.mtq.tvm.cn",
    "mongodb":{
        "links":"mongodb://integral:integral@10.20.30.59:37017/pointMall,integral:integral@10.20.30.60:37017/pointMall"
    },
    "redis":{
        "host":"10.20.30.33",
        "port":6382
    },
    "wmhSessionRedis":{
        "host":"10.20.30.33",
        "port":6384
    },
    "userGroupRedis":{
        "host":"10.20.30.61",
        "port":6379
    }
};

var ALI_CONFIG = {
    "NODE_ENV": "ali",
    "domain":"http://mall.mtq.tvm.cn",
    "userHost":"http://mb.mtq.tvm.cn",
    "wtopicUrl":"http://wtopic.mtq.tvm.cn",
    "wmhUrl":"http://iwmh.mtq.tvm.cn",
    "searchUrl":"http://10.171.199.136:9010",
    "searchUrlTimeout":"http://121.40.105.199:9010",
    "h5Url":"http://h5.mtq.tvm.cn",
    "mongodb":{
        //"links":"mongodb://integral:integral@10.251.235.156:27017/pointMall,integral:integral@10.168.165.175:27017/pointMall"
        "links":"mongodb://integral:integral@10.51.19.34:27017/pointMall"
    },
    "redis":{
        "host":"10.168.50.241",
        "port":6383
    },
    "wmhSessionRedis": {
        "host": "10.168.206.104",
        "port": 6382
    },
    "userGroupRedis":{
        "host":"10.168.249.158",
        "port":6379
    }
};

var US_CONFIG = {
    "NODE_ENV": "us",
    "domain":"http://us.mall.mtq.tvm.cn",
    "path":"/pointMall",
    "userHost":"http://us.mb.mtq.tvm.cn",
    "wtopicUrl":"http://wtopic.mtq.tvm.cn",
    "wmhUrl":"http://us.iwmh.mtq.tvm.cn",
    "searchUrl":"http://10.20.30.71:9010",
    "searchUrlTimeout":"http://10.20.30.72:9010",
    "mongodb":{
        "links":"mongodb://integral:integral@127.0.0.1:27017/pointMall"
    },
    "redis":{
        "host":"127.0.0.1",
        "port":6382
    },
    "wmhSessionRedis":{
        "host":"127.0.0.1",
        "port":6384
    },
    "userGroupRedis":{
        "host":"127.0.0.1",
        "port":6380
    }
};

var AUS_CONFIG = {
    "NODE_ENV": "aus",
    "domain":"http://aus.mall.mtq.tvm.cn",
    "path":"/pointMall",
    "userHost":"http://aus.mb.mtq.tvm.cn",
    "wtopicUrl":"http://wtopic.mtq.tvm.cn",
    "wmhUrl":"http://aus.iwmh.mtq.tvm.cn",
    "searchUrl":"http://10.20.30.71:9010",
    "searchUrlTimeout":"http://10.20.30.72:9010",
    "mongodb":{
        "links":"mongodb://integral:integral@127.0.0.1:27017/pointMall"
    },
    "redis":{
        "host":"127.0.0.1",
        "port":6382
    },
    "wmhSessionRedis":{
        "host":"127.0.0.1",
        "port":6384
    },
    "userGroupRedis":{
        "host":"127.0.0.1",
        "port":6380
    }
};

var QA_CONFIG = {
    "NODE_ENV": "qa",
    "domain":"http://qa.mall.mtq.tvm.cn",
    "userHost":"http://qa.mb.mtq.tvm.cn",
    "wtopicUrl":"http://qa.wtopic.mtq.tvm.cn",
    "wmhUrl":"http://qa.iwmh.mtq.tvm.cn",
    "h5Url":"http://h5.mtq.tvm.cn",
    "mongodb":{
        "links":"mongodb://integral:integral@10.173.229.225:27017/pointMall"
    },
    "redis":{
        "host":"10.173.229.225",
        "port":6383
    },
    "wmhSessionRedis":{
        "host":"10.173.229.225",
        "port":6385
    },
    "userGroupRedis":{
        "host":"10.173.229.225",
        "port":6381
    }
};

var CONFIG = {
    "scan":{
        "recommend":1000
    },
    "integral":1000,
    "path":"/pointMall",
    "fileUploadDir":"/mnt/pic",
    "nginxFileDir":"/pic",
    "token":"7fda67277f",
    "mallDomain":"http://a.yaotv.mtq.tvm.cn",
    "userHostUS":"http://us.mb.mtq.tvm.cn",
    "wmhUrlUS":"http://us.iwmh.mtq.tvm.cn",
    "tvmMallToken": "35o4zts2mwgdenkvpqrf0u"
};

if (NODE_ENV == 'PROD'){
    CONFIG = _.extend(CONFIG, PROD_CONFIG)
} else if (NODE_ENV == 'ALI'){
    CONFIG = _.extend(CONFIG, ALI_CONFIG)
} else if (NODE_ENV == 'US'){
    CONFIG = _.extend(CONFIG, US_CONFIG)
} else if (NODE_ENV == 'AUS'){
    CONFIG = _.extend(CONFIG, AUS_CONFIG)
} else if (NODE_ENV == 'QA'){
    CONFIG = _.extend(CONFIG, QA_CONFIG)
}else {
    CONFIG = _.extend(CONFIG, DEV_CONFIG)
}
module.exports = CONFIG;