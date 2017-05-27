const Redis = require('ioredis');

// exports.createRedisClient = function (options) {
module.exports = function (options) {
	options = options || {};
	options.host = options.host || "127.0.0.1";
	options.port = options.port || 6379;
	options.db = options.db || 0;
	return new Redis(options);
};