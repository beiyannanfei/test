/**
 * Created by chenjie on 2015/1/5.
 */

var _ = require('underscore')
var NODE_ENV = require('./env-config.js')
NODE_ENV = NODE_ENV.toString().toUpperCase()

var DEV_CONFIG = {
    "NODE_ENV": "dev",
    "domain":"http://ads-mall.dev.tvm.cn",
    "userHost":"http://mb.dev.tvm.cn",
    "yaoHost": "http://t9.dev.tvm.cn",
    "countHost": "http://ads.mtq.tvm.cn",
    "anaHost": "http://ana.mtq.tvm.cn",
    "wsqHost": "http://qa.wsq.mtq.tvm.cn",
    "DS_HOST": "http://qa.ana.mtq.tvm.cn",
    "blackTTL":{
        "AbnormalBehaviorUser": 1 * 60 * 40, //非互动时段黑名单时间
        "rate1Black": 1 * 60 * 40, //一等奖40分钟黑名单
        "rate2Black": 1 * 60 * 20  //二等奖20分钟黑名单
    },
    "mongodb":{
        "links":"mongodb://mall_ad:mall_ad_pass@10.10.42.25:27017/mall_ad"
    },
    "redis":{
        "host":"10.10.42.25",
        "port":6379
    },
    "cache_redis":[
        {"host":"10.10.32.101", "port":6379},
    ],
    lotteryRedis: {
        host: '10.10.42.25',
        port: 6379
    },
    sysLotteryRedis: {
        host: '10.20.30.68',
        port: 6379
    },
    sysLotteryMoneyRedis: {
        host: '10.20.30.68',
        port: 6379
    },
    queueRedis: {
        host: '10.10.42.25',
        port: 6379
    }
}

var QA_CONFIG = {
    "NODE_ENV": "qa",
    "domain":"http://qa.ads-mall.mtq.tvm.cn",
    "userHost":"http://qa.mb.mtq.tvm.cn",
    "countHost": "http://qa.ads.mtq.tvm.cn/",
    "yaoHost": "http://qa.yao.mtq.tvm.cn",
    "anaHost": "http://ana.mtq.tvm.cn",
    "wsqHost": "http://qa.wsq.mtq.tvm.cn",
    "DS_HOST": "http://qa.ana.mtq.tvm.cn",
    "blackTTL":{
        "AbnormalBehaviorUser": 1 * 60 * 1, //非互动时段黑名单时间
        "rate1Black": 1 * 60 * 2, //一等奖2分钟黑名单
        "rate2Black": 1 * 60 * 1  //二等奖1分钟黑名单
    },
    "mongodb":{
        "links":"mongodb://mall_ad:mall_ad_pass@10.105.66.115:27017/mall_ad"
    },
    "redis":{
        "host":"10.105.51.52",
        "port":6383
    },
    "cache_redis":[
        {"host":"10.105.51.52", "port":6391},
    ],
    lotteryRedis: {
        host: '10.105.51.52',
        port: 6383
    },
    sysLotteryRedis: {
        host: '10.105.51.52',
        port: 6383
    },
    sysLotteryMoneyRedis: {
        host: '10.105.51.52',
        port: 6392
    },
    queueRedis: {
        host: '10.105.51.52',
        port: 6383
    }
}

var QQ_CONFIG = {
    "NODE_ENV": "qq",
    "domain":"http://ads-mall.mtq.tvm.cn",
    "userHost":"http://mb.mtq.tvm.cn",
    "yaoHost": "http://yao.mtq.tvm.cn",
    "countHost": "http://ads.mtq.tvm.cn",
    "anaHost": "http://ana.mtq.tvm.cn",
    "wsqHost": "http://wsq.mtq.tvm.cn",
    "DS_HOST": "http://ana.mtq.tvm.cn",
    "blackTTL":{
        "AbnormalBehaviorUser": 1 * 60 * 60 * 24 * 2, //非互动时段黑名单时间
        "rate1Black": 1 * 60 * 60 * 24 * 2, //一等奖48小时黑名单
        "rate2Black": 1 * 60 * 60 * 24      //二等奖24小时三次
    },
    "mongodb":{
        "links":"mongodb://mall_ad:mall_ad_pass@10.131.226.169:27017/mall_ad"
    },
    "redis":{
        "host":"10.148.68.31",
        "port":6379
    },
    "cache_redis":[
        {"host":"10.148.68.31", "port":6380},
    ],
    lotteryRedis: {
        "host":"10.148.68.31",
        port: 6379
    },
    sysLotteryRedis: {
        host: '10.148.68.31',
        port: 6379
    },
    sysLotteryMoneyRedis: {
        host: '10.148.68.31',
        port: 6381
    },
    queueRedis: {
        host: '10.148.68.31',
        port: 6379
    }
}

var QQ_NEW_CONFIG = {
    "NODE_ENV": "qq_new",
    "domain":"http://mall.yaotv.tvm.cn",
    "userHost":"http://mb.mtq.tvm.cn",
    "yaoHost": "http://yaotv.tvm.cn",
    "countHost": "http://ad.yaotv.tvm.cn",
    "anaHost": "http://ana.mtq.tvm.cn",
    "wsqHost": "http://wsq.yaotv.tvm.cn",
    "DS_HOST": "http://ana.mtq.tvm.cn",
    "blackTTL":{
        "AbnormalBehaviorUser": 1 * 60 * 60 * 24 * 2, //非互动时段黑名单时间
        "rate1Black": 1 * 60 * 60 * 24 * 2, //一等奖48小时黑名单
        "rate2Black": 1 * 60 * 60 * 24      //二等奖24小时三次
    },
    "mongodb":{
        "links":"mongodb://mall_ad:mall_ad_pass@10.131.226.169:27017/mall_ad"
    },
    "redis":{
        "host":"10.148.68.31",
        "port":6379
    },
    "cache_redis":[
        {"host":"10.148.68.31", "port":6380},
    ],
    lotteryRedis: {
        "host":"10.148.68.31",
        port: 6379
    },
    sysLotteryRedis: {
        host: '10.148.68.31',
        port: 6379
    },
    sysLotteryMoneyRedis: {
        host: '10.148.68.31',
        port: 6381
    },
    queueRedis: {
        host: '10.148.68.31',
        port: 6379
    }
}

var CONFIG = {
    "fileUploadDir":"/mnt/pic",
    "nginxFileDir":"/pic",
    "token":"7fda67277f",
    "tvmMallToken": "35o4zts2mwgdenkvpqrf0u",
    "port": 6003
}

if (NODE_ENV == 'QQ'){
    CONFIG = _.extend(CONFIG, QQ_CONFIG)
} else if (NODE_ENV == 'QQ_NEW'){
    CONFIG = _.extend(CONFIG, QQ_NEW_CONFIG)
} else if (NODE_ENV == 'QA'){
    CONFIG = _.extend(CONFIG, QA_CONFIG)
} else {
    CONFIG = _.extend(CONFIG, DEV_CONFIG)
}
module.exports = CONFIG