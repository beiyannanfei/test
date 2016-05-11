/**
 * Created by wyq on 2015/9/1.
 */
var redis = require("redis");
var async = require("async");
var _ = require("underscore");


var sourceRedisConf = {hosts: "10.10.42.25", port: 6379};
var destRedisConf = {hosts: "127.0.0.1", port: 6379};


var sourceRedisClient = redis.createClient(sourceRedisConf.port, sourceRedisConf.hosts);
var destRedisClient = redis.createClient(destRedisConf.port, destRedisConf.hosts);


var key = "count_pv_and_uv";    //redis key
var pvKey = "count_pv";         //统计pv的key












