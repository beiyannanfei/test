/**
 * Created by wyq on 2016/5/6.
 * 生成支持es6的redis连接
 */

var Q = require('q');
var redislib = require("redis");
var log4js = require('log4js');
var config = require("../../config.js");
var co = require("co");
var logger = log4js.getLogger(__filename);

module.exports = function (redis) {
	if (!redis) {
		redis = redislib.createClient(config.redis.port, config.redis.host);
	}
	return new client(redis);
};

var client = function (redis) {
	this.redis = redis;
	this.redis.on("error", function (err) {
		logger.error("redis client Error %j", err);
	});
	this.bindAll();
};

client.prototype.bindAll = function () {
	var self = this;
	var redisCommand = [
		/*Key（键）*/
		"DEL", "DUMP", "EXISTS", "EXPIRE", "EXPIREAT", "KEYS", "MIGRATE", "MOVE", "OBJECT", "PERSIST", "PEXPIRE", "PEXPIREAT",
		"PTTL", "RANDOMKEY", "RENAME", "RENAMENX", "RESTORE", "SORT", "TTL", "TYPE", "SCAN",
		/*String（字符串）*/
		"APPEND", "BITCOUNT", "BITOP", "DECR", "DECRBY", "GET", "GETBIT", "GETRANGE", "GETSET", "INCR", "INCRBY", "INCRBYFLOAT",
		"MGET", "MSET", "MSETNX", "PSETEX", "SET", "SETBIT", "SETEX", "SETNX", "SETRANGE", "STRLEN",
		/*Hash（哈希表）*/
		"HDEL", "HEXISTS", "HGET", "HGETALL", "HINCRBY", "HINCRBYFLOAT", "HKEYS", "HLEN", "HMGET", "HMSET", "HSET", "HSETNX",
		"HVALS", "HSCAN",
		/*List（列表）*/
		"BLPOP", "BRPOP", "BRPOPLPUSH", "LINDEX", "LINSERT", "LLEN", "LPOP", "LPUSH", "LPUSHX", "LRANGE", "LREM", "LSET",
		"LTRIM", "RPOP", "RPOPLPUSH", "RPUSH", "RPUSHX",
		/*Set（集合）*/
		"SADD", "SCARD", "SDIFF", "SDIFFSTORE", "SINTER", "SINTERSTORE", "SISMEMBER", "SMEMBERS", "SMOVE", "SPOP", "SRANDMEMBER",
		"SREM", "SUNION", "SUNIONSTORE", "SSCAN",
		/*SortedSet（有序集合）*/
		"ZADD", "ZCARD", "ZCOUNT", "ZINCRBY", "ZRANGE", "ZRANGEBYSCORE", "ZRANK", "ZREM", "ZREMRANGEBYRANK", "ZREMRANGEBYSCORE",
		"ZREVRANGE", "ZREVRANGEBYSCORE", "ZREVRANK", "ZSCORE", "ZUNIONSTORE", "ZINTERSTORE", "ZSCAN", "ZRANGEBYLEX",
		"ZLEXCOUNT", "ZREMRANGEBYLEX",
		/*HyperLogLog*/
		"PFADD", "PFCOUNT", "PFMERGE",
		/*GEO（地理位置）*/
		"GEOADD", "GEOPOS", "GEODIST", "GEORADIUS", "GEORADIUSBYMEMBER", "GEOHASH",
		/*Pub/Sub（发布/订阅）*/
		"PSUBSCRIBE", "PUBLISH", "PUBSUB", "PUNSUBSCRIBE", "SUBSCRIBE", "UNSUBSCRIBE",
		/*Transaction（事务）*/
		"DISCARD", "EXEC", "MULTI", "UNWATCH", "WATCH",
		/*Script（脚本）*/
		"EVAL", "EVALSHA", "SCRIPT EXISTS", "SCRIPT FLUSH", "SCRIPT KILL", "SCRIPT LOAD",
		/*Connection（连接）*/
		"AUTH", "ECHO", "PING", "QUIT", "SELECT",
		/*Server（服务器）*/
		"BGREWRITEAOF", "BGSAVE", "CLIENT GETNAME", "CLIENT KILL", "CLIENT LIST", "CLIENT SETNAME", "CONFIG GET",
		"CONFIG RESETSTAT", "CONFIG REWRITE", "CONFIG SET", "DBSIZE", "DEBUG OBJECT", "DEBUG SEGFAULT", "FLUSHALL",
		"FLUSHDB", "INFO", "LASTSAVE", "MONITOR", "PSYNC", "SAVE", "SHUTDOWN", "SLAVEOF", "SLOWLOG", "SYNC", "TIME"
	];
	redisCommand.forEach(key => {
		self[key] = Q.nbind(self.redis[key], self.redis);
	});
	redisCommand.forEach(key => {       //屏蔽命令的大小写(只支持纯大写或纯小写)
		key = key.toString().toLowerCase();
		self[key] = Q.nbind(self.redis[key], self.redis);
	});
};