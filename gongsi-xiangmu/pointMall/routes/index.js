var wxInfo = require('./wxInfo');
var _ = require('underscore');
var opUser = require('./opUser');
var models = require('../models')
var tools       = require('../tools');
var ut = require('./utils')
var wxPay = require('./wxPay')
var config = require('../config');
var Users = models.Users;
var OpUser = models.opUser;
var redisCache = require('./redis_cache.js')

var wmhSessionRedisClient = tools.wmhSessionRedisClient();
var urlReg = /^(https|http):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/

exports.midAuthOpenId = function(param){
    return function(req, res, next) {
        var openId = req.param(param);
        if (!openId) {
            delete req.session.openId
            delete req.session.token
            console.log(param + ' param is required');
            return res.send(400, param + ' param is required');
        }

        if (req.session.openId == openId && req.session.user && req.session.user.status == 'subscribe' && req.session.lastTime && req.session.lastTime > new Date().getTime() - 10 * 60 * 1000){
            if (_.contains(wxPay.payToken, req.session.token)){
                req.session.tvmMallOpenId = openId
            }
            req.user = req.session.user
            return next()
        } else {
            delete req.session.user
        }

        wxInfo.reacquireUsers(req.token, openId, function(user){
            req.session.openId = openId;
            req.openId = req.session.openId
            if (user){
                req.user = req.session.user = user
                req.session.lastTime = new Date().getTime()
            } else {
                delete req.session.user
            }
            if (_.contains(wxPay.payToken, req.session.token)){
                req.session.tvmMallOpenId = openId
            }
            return next();
        })
    }
}

exports.midAuth = function(isAjax){
    if (isAjax != false){
        isAjax = true;
    }

    return function(req, res, next) {
        if (!req.session.token) {
            delete req.session.openId
            delete req.session.token
            if (isAjax){
                res.send(401);
            } else{
                res.send(401);
            }
            console.log('session token not exists')
            return
        }
        req.token = req.session.token;
        next()
    }
}

exports.checkUserIsFollow = function(req, res, next){
    var user = req.user
    if (user && user.status == 'subscribe'){
        return next();
    }

    req.unFollowed = 1
    redisCache.get(req.token + '-followUrl', function(err, value){
        if(err || !value || !value.followUrl){
            wxInfo.getFollowUrl(req.token, function(err, response){
                if (err){
                    return next()
                    return res.send(500, '系统错误，获取关注页面错误!');
                } else {
                    console.log('checkUserIsFollow：',user);
                    if (response && response.data && response.data.follow_url && urlReg.test(response.data.follow_url)){
                        req.followUrl = response.data.follow_url
                        redisCache.set(req.token + '-followUrl', 2 * 60 * 60, {followUrl: response.data.follow_url, wxname: response.data.wxname})
                    }
                    return next()
                }
            })
        } else{
            req.followUrl = value.followUrl
            return next()
        }
    })
}

exports.midAuthUser = function(need){
    return function(req, res, next) {
        if (!req.session.openId) {
            delete req.session.openId
            delete req.session.token
            delete req.session.user
            res.send(401);
            console.log('session open id not exists!')
            return;
        }
        req.openId = req.session.openId
        req.user = req.session.user?req.session.user:{}
        if (!need){
            return next()
        }
        var _id = req.session.token + '_' + req.session.openId;
        Users.findById(_id, function(err, o){
            if (err){
                console.log('auth failed, err: ' + err)
                console.log(_id);
                return res.send(500, '系统错误');
            } else if (!o){
                return next()
            } else {
                req.user = req.session.user = ut.doc2Object(o)
                return next()
            }
        })
    }
}

exports.authTokenBySession = function(req, res, next) {
    var sid = req.param('sid');
    if (!sid) {
        console.log('sid param is required');
        return res.send(400, 'sid param is required');
    }
    wmhSessionRedisClient.get('WMH:' + sid, function(err, value){
        if (err){
            res.send(500, err)
        } else if (!value){
            res.send(401, '没有登录信息')
        } else {
            value = JSON.parse(value);
            if (!value.token){
                return res.send('用户信息token不存在')
            }
            var user = {
                token: value.token,
                wxName: value.weixin
            }
            opUser.addUser(user, function (err) {
                if (err){
                    console.log('add opuser err:' + err);
                }
            })
            req.token = value.token;
            req.session.token = value.token;
            next()
        }
    })
}

exports.authToken = function(tokenParam){
    return function(req, res, next) {
        var token = req.param(tokenParam);
        if (!token) {
            delete req.session.openId
            delete req.session.token
            console.log(tokenParam + ' param is required');
            return res.send(400, tokenParam + ' param is required');
        }
        req.token = token
        req.session.tvmMallOpenId = null
        req.session.token = token
        return next()
    }
}

exports.home = function(req, res){
    res.render('home')
}

exports.authSuccess = function(req, res){
    res.redirect('/pointMall/prize')
}

exports.authLotterySuccess = function(req, res){
    res.redirect('/pointMall/lottery/event')
}

exports.authGoodsSuccess = function(req, res){
    res.redirect('/pointMall/goods')
}

exports.authOrderSuccess = function(req, res){
    res.redirect('/pointMall/order/list')
}

exports.authLotteryStatisticsSuccess = function(req, res){
    res.redirect('/pointMall/lottery/statistics/index')
}

exports.authActivitySuccess = function(req, res){
    var way = req.param('way')
    if (!way || (way != '1' && way != '2')){
        return res.send('没有此类型抽奖');
    }
    res.redirect('/pointMall/activity?way=' + way)
}

exports.authStoreSuccess = function(req, res){
    res.redirect('/pointMall/store')
}

exports.authRedPagerSuccess = function(req, res){
    res.redirect('/pointMall/red/pager')
}

exports.login = function(req, res){
    res.render('login')
}

exports.logout = function(req, res){
    delete req.session.token
    delete req.session.openId
    res.redirect('/pointMall/login')
}

exports.doLogin = function (req, res) {
    var userName = req.param('userName');
    var password = req.param('password');

    var condition = {
        $or: [{token: userName}, {wxName: userName}],
        password: password
    }
    OpUser.findOne(condition, function (err, user) {
        if (err){
            return res.send(500, 'mongodb error')
        }
        if (!user){
            return res.send(404, '用户名密码错误')
        }

        req.token = user.token;
        req.session.token = user.token;
        res.send(200);
    });
};

exports.midOpenApiAuth = function(req, res, next){
    var token = req.param('token')
    var openId = req.param('openId')
    if (!token || !openId){
        return res.send({})
    }

    req.session.token = req.token = token;

    req.session.openId = req.openId = openId;
    next()
}