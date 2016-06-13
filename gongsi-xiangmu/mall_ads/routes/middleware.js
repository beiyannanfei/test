/**
 * Created by 陈杰 on 2014/7/9.
 */

var _ = require("underscore");
var config = require('../config');
var env = require('../env-config');
var moment = require('moment');
var default_page_size = 20;
var max_page_size = 100;
var crypto = require("crypto");

exports.midPageChecker = function (pageSize) {
    return function (req, res, next) {
        var page = req.param('page');
        if (_.isUndefined(page)) {
            page = 0;
        } else {
            page = parseInt(page, 10);
            if (_.isNaN(page)) {
                page = 0
            }
        }
        var size = req.param('pageSize');
        if (_.isUndefined(size)) {
            if (pageSize && pageSize > 0) {
                size = pageSize;
            } else {
                size = default_page_size;
            }
        } else {
            size = parseInt(size, 10);
            if (_.isNaN(size)) {
                size = default_page_size;
            }
        }
        if (size > max_page_size) {
            return res.send(400, 'param pageSize exceed max limit 100');
        }
        req.pageSpec = {
            limit: size,
            skip: page * size
        }
        next()
    }
}

exports.parse2int = function (param) {
    if (_.isUndefined(param)) {
        return null;
    } else {
        param = parseInt(param, 10);
        if (_.isNaN(param)) {
            return null;
        }
        return param;
    }
}

exports.getIp = function (req, res, next) {
    var ip;
    var forwardedIpsStr = req.header('X-Forwarded-For') || req.header('x-real-ip');
    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ip = forwardedIps[0];
    }
    if (!ip) {
        ip = req.connection.remoteAddress;
    }

    if (ip && /^[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}$/.test(ip)){
        req.localIp = ip
    } else {
        req.localIp = '172.0.0.1'
    }
    next()
};

exports.midSend = function () {
    return function (req, res, next){
        var send = res.send
        res.send = function(code, data){
            console.log(moment(new Date()).format("YYYY/MM/DD HH:mm:ss")+" "+ JSON.stringify(arguments));
            res.send = send

            if (_.isNumber(code)){
                if (code == 200){
                    res.send({status: 'success', code: code, data: data})
                } else {
                    res.send({status: 'failure', code: code, errMsg: data})
                }
            } else {
                res.send({status: 'success', code: 200, data: code})
            }
        }
        next()
    }
}

exports.setSession = function(app, redisStore, express, path){
    var sessionMiddleware;
    var settings = {
        secret: '1234567890QWERTY',
        cookie: {
            path: path,
            maxAge: Number.MAX_VALUE
        }
    }
    var createMiddlware = _.throttle(function() {
        var store = new redisStore({host: config.redis.host, port: config.redis.port, ttl: 60 * 60 * 24});

        store.on('disconnect', function(e) {
            console.log('redisStore disconnect:' + e);
            createMiddlware();
        });

        store.on('error', function(e) {
            console.log('redisStore error:' + e);
            createMiddlware();
        });

        console.log('recreate redisStore!');
        app.set('sessionStore', store);

        settings.store = store;
        sessionMiddleware = express.session(settings);

    }, 10000);

    createMiddlware();

    return function(req, res, next) {
        sessionMiddleware.apply(this, arguments);
    }
}

exports.checkAuthSign = function (req, res, next) {
    console.time('checkAuthSign');
    var params = {};
    params.rkey = 'tvm1ning%21%40%23.%24%25%5E', //'tvm1ning!@#.$%^';
        params.openid = req.param('openid');
    params.sigtime = req.param('sigtime');
    if (!params.openid) {
        return res.send(400, '参数openid错误');
    }
    var sig = req.param('sig');
    var str = 'openid=' + params.openid + '&rkey=' + params.rkey;
    var md5 = crypto.createHash('md5');
    var sign = md5.update(str);
    sign = md5.digest('hex');
    var md52 = crypto.createHash('md5');
    sign = md52.update(sign);
    sign = md52.digest('hex');
    if (sign == sig) {
        console.timeEnd('checkAuthSign');
        next();
    } else {
        return res.send(400, '签名失败');
    }
};