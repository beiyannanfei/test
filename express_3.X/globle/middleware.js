/**
 * Created by wyq on 2016/5/6.
 */

var _ = require("underscore");
var config = require("../config.js");
var log4js = require('log4js');
var logger = log4js.getLogger(__filename);

exports.midSend = function () {
	return function (req, res, next) {
		var send = res.send;
		res.send = function (code, data) {
			res.send = send;
			if (_.isNumber(code)) {
				if (code == 200) {
					res.send({status: "success", code: code, data: data});
				}
				else {
					res.send({status: "failure", code: code, errMsg: data});
				}
			}
			else {
				res.send({status: "success", code: 200, data: code});
			}
		}
		return next();
	}
};

exports.setSession = function (app, redisStore, express, path) {
	var sessionMiddleware;
	var settings = {
		secret: '1234567890QWERTY',
		cookie: {
			path: path,
			maxAge: Number.MAX_VALUE
		}
	};
	var createMiddlware = _.throttle(function () {
		var store = new redisStore({host: config.redis.host, port: config.redis.port, ttl: 60 * 60 * 24, db: 10});

		store.on('disconnect', function (e) {
			logger.info('setSession redisStore disconnect:' + e);
			createMiddlware();
		});

		store.on('error', function (e) {
			logger.info('setSession redisStore error:' + e);
			createMiddlware();
		});

		logger.info('setSession recreate redisStore!');
		app.set('setSession sessionStore', store);

		settings.store = store;
		sessionMiddleware = express.session(settings);

	}, 10000);

	createMiddlware();

	return function (req, res, next) {
		sessionMiddleware.apply(this, arguments);
	}
};


