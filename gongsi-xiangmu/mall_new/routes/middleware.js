/**
 * Created by 陈杰 on 2014/7/9.
 */

var _ = require("underscore");
var crypto = require('crypto');

var config = require('../config');
var env = require('../env-config');
var businessApi = require('../interface/businessApi.js');
var tools = require('../tools');
var integral = require("./../interface/integral.js");
var cacheutils = require("./cache-utils.js");
var tkConfig = require('../tokenConfig');
var mLottery = require('./lottery.js');
var dbUtils = require('../mongoSkin/mongoUtils.js')
var redisClient = tools.redisClient();

var default_page_size = 20;
var max_page_size = 10000;
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
            return res.send(400, 'param pageSize exceed max limit 1000');
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

exports.checkParamIfExist = function (param) {
    return function (req, res, next) {
        var o = req.param(param) || req.session[param]
        if (!o) {
            res.send(400, param + '参数不存在')
        } else {
            req[param] = o;
            req.forMe = true
            next();
        }
    }
}

exports.midSessionLog = function (req, res, next) {
    console.log(req.session);
    next()
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

exports.third = function (req, res, next) {
    req.third = true;
    next()
}

exports.checkLotteryEnable = function (req, res, next) {
    var activity = req.activity;
    if (activity.category && activity.category.length > 0) {
        var category = activity.category[0]
        console.log("*****checkLotteryEnable******* openId: %j, token： %j， activity: %j， title: %j", req.openId, req.token, category.cat, category.key);
        integral.getUserInGroup(req.openId, req.token, category.cat, category.key, function (err) {
            if (!!err) {
                return res.send({status: -2, category: category});
            }
            next();
        });
    } else {
        next()
    }
};

exports.checkRedPagerEnable = function (req, res, next) {
    var redPagerEvent = req.redPagerEvent;
    if (redPagerEvent.category && redPagerEvent.category.length > 0) {
        var category = redPagerEvent.category[0];
        console.log("*****checkRedPagerEnable******* openId: %j, token： %j， activity: %j， title: %j", req.openId, req.token, category.cat, category.key);
        integral.getUserInGroup(req.openId, req.token, category.cat, category.key, function (err) {
            if (!!err) {
                return res.send({status: -1, category: category});
            }
            next();
        });
    } else {
        next()
    }
};

/**
 * 获取积分显示单位
 * @param req
 * @param res
 * @param next
 */
exports.getIntegralUnit = function (req, res, next) {
    if (!req.token) {
        req.integralUnit = '积分';
        return next();
    }
    var key = req.token + "_getUserCenterConf";
    cacheutils.get(key, function(err, data) {
        if (!!err || !data) {   //当错误或查询结果为空
            integral.getUserCenterConf(req.token, function(err, result) {
                var unit;
                if (result && result.unit) {
                    unit = result.unit;
                }
                else {
                    unit = '积分';
                }
                req.integralUnit = unit;
                cacheutils.set(key, 5, unit, function(err, data){});
                return next();
            })
        }
        else {
            req.integralUnit = data;
            return next();
        }
    });
};

/**
 * 菜单UEL 签名认证
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.checkAuthSign = function (req, res, next) {
    if (env == 'localhost'){
        return next()
    }
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
        return res.send(400, '认证签名失败');
    }
};

exports.checkSign = function (req, res, next) {
    if (env == 'localhost'){
        return next()
    }
    console.time('checkAuthSign');
    var params = {};
    params.rkey = 'tvm1ning%21%40%23.%24%25%5E', //'tvm1ning!@#.$%^';
        params.openid = req.param('openId');
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
        return res.send(400, '认证签名失败');
    }
};

/**
 * 积分签名认证
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.integralAuthSign = function (req, res, next) {
    var params = {};
    params.rkey = '10059d4ceefa51dd21d00898d891f58d';// tvm-mtq-mall@2014 md5 加密字符串;
    params.openId = req.param('openId');
    params.sigtime = req.param('sigtime');
    if (!params.openId) {
        return res.send({status: 'failed', msg: '参数openId错误'});
    }
    if (!params.sigtime) {
        return res.send({status: 'failed', msg: '参数sigtime错误'});
    }
    var sig = req.param('sig');
    var str = params.openId + ':' + params.rkey + ':' + params.sigtime;
    var md5 = crypto.createHash('md5');
    var sign = md5.update(str);
    sign = md5.digest('hex');
    if (sign == sig) {
        next();
    } else {
        return res.send({status: 'failed', msg: '认证签名失败'});
    }
};

exports.integralcheckToken = function (req, res, next) {
    var wxToken =  req.param('wxToken');
    if(wxToken=='3a59f7a4b8b28dca' || wxToken=='tvmcj' || wxToken=='tvmty'){
        next();
    }else{
        return res.send({status: 'failed', msg: 'wx_token 不合法'});
    }
};

exports.midSend = function () {
    return function (req, res, next){
        var send = res.send
        res.send = function(code, data){
            if (req.lockID){
                redisClient.del(req.lockID)
            }
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

exports.checkLimitCount = function(req, res, next){
    var goods = req.goods;
    if (goods.ext.limitCount >= 1){
        mLottery.orderCount(req.token, req.openId, goods._id.toString(), function(count){
            if (count >= goods.ext.limitCount){
                res.send({status: -3})
            } else {
                next()
            }
        })
    } else {
        next()
    }
}

exports.checkLimitCountToBuy = function(req, res, next){
    var goods = req.goods;
    if (goods.ext.playType == 5){
        return next()
    }
    if (goods.ext.limitCount >= 1){
        mLottery.orderCount(req.token, req.openId, goods._id.toString(), function(count){
            if (count >= goods.ext.limitCount){
                req.unablePay = true
            }
            next()
        })
    } else {
        next()
    }
}

exports.checkExchangeLock = function(param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next) {
        var id = req.param(param);
        if (!id) {
            return res.send(400, 'param id not exists')
        }
        var send = res.send
        res.send = function (code, data) {
            res.send = send

            redisClient.incrby(id, -1);
            if (_.isNumber(code)) {
                if (code == 200) {
                    res.send(data)
                } else {
                    res.send(code, data)
                }
            } else {
                res.send(code)
            }
        }

        redisClient.incr(id, function (err, value) {
            redisClient.EXPIRE(id, 60)
            if (err) {
                return res.send(500, '系统频繁')
            }
            if (value) {
                value = parseInt(value, 10);
                if (value > 1) {
                    console.log('exchangeing')
                    return res.send(500, '系统频繁')
                } else {
                    console.log('goto exchange redis value:' + value)
                    return next()
                }
            } else {
                return next()
            }
        })
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

exports.midBussinessCheck = function(req, res, next){
    return next()
    if (req.token){
        next()
    } else {
        businessApi.checkBussiness(req.tvmId, function(err, response){
            if (err){
                res.redirect('/pointMall/admin/goods')
            } else if (response.result != '1'){
                res.redirect(config.bussinessDomain + '/Login/register')
            } else {
                next()
            }
        })
    }
}

var dbCache = {}
exports.checkAuthAndRedirect = function(type, param){
    if (!param){
        param = 'id'
    }
    return function(req, res, next){
        if (req.session.token && req.session.openId){
            req.session.redirectTime = 0
            return next()
        }

        if (!req.session.redirectTime){
            req.session.redirectTime = 0
        }
        if (req.session.redirectTime > 1){
            req.session.redirectTime = 0
            return next()
        }

        var id = req.param(param);
        if (!id) {
            return res.send(404);
        }

        delete req.session.token
        delete req.session.openId

        var url = ''
        if (!dbCache[type]){
            dbCache[type] = new dbUtils(type)
        }
        dbCache[type].findById(id, function(err, doc){
            if (err){
                return res.send(500, id);
            }

            if (!doc){
                return res.send(404, id);
            }
            var token = doc.token
            if (type == 'goods'){
                url = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(config.domain + '/pointMall/auth/goods/' + id + '?wx_token=' + token);
            }  else if (type == 'stores'){
                url = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(config.domain + '/pointMall/enter/store/' + id + '?wx_token=' + token);
            }
            else if (type == 'activities') {
                url = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(config.domain + '/pointMall/lottery/activity/' + id + '?wx_token=' + token);
            }
            else {
                return next()
            }
            req.session.redirectTime++
            return res.redirect(url);
        })
    }
}

exports.lock = function(prefix, param){
    return function(req, res, next) {
        var key = 'lock-' + prefix + '-' + req.param(param)
        req.lockID = key
        redisClient.incr(key, function (err, value) {
            redisClient.EXPIRE(key, 10)
            if (err || !value) {
                return next()
            } else {
                value = parseInt(value, 10);
                if (value > 1) {
                    return res.send(403, '操作太频繁')
                }
            }
            return next()
        })
    }
}