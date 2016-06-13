var wxInfo = require('./../interface/wxInfo');
var tools       = require('../tools');
var ut = require('./utils')
var config = require('../config');
var envConfig = require('../env-config');
var dbUtils = require('../mongoSkin/mongoUtils.js')
var userCollection = new dbUtils('users')
var opuserCollection = new dbUtils('opusers')

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
            req.user = req.session.user
            return next()
        } else {
            delete req.session.user
        }
        wxInfo.reacquireUsers(req.token, openId, function(user){
            req.openId = req.session.openId = openId
            req.openId = req.session.openId
            if (user){
                req.user = req.session.user = user
                req.session.lastTime = new Date().getTime()
            } else {
                delete req.session.user
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
    wxInfo.getFollowUrl(req.token, function(err, response){
        if (err){
            return next()
        } else {
            if (response && response.dat && response.dat.length > 0){
                var data = response.dat[0]
                if (data.followurl && urlReg.test(data.followurl)){
                    req.followUrl = data.followurl
                }
                req.wxname = data.wxname
            }
            return next()
        }
    })
}

exports.midAuthUser = function(need){
    return function(req, res, next) {
        if (!req.session.openId) {
            delete req.session.openId
            delete req.session.token
            console.log('session open id not exists!')
            res.send(401);
            return;
        }
        req.openId = req.session.openId
        req.user = req.session.user?req.session.user:{}
        if (!need){
            return next()
        }
        var _id = req.session.token + '_' + req.session.openId;
        req.openId = req.session.openId
        userCollection.findById(_id, function(err, o){
            if (err){
                return res.send(500, '系统错误');
            } else if (!o){
                return next()
            } else {
                req.user = o
                return next()
            }
        })
    }
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
    delete req.session.tvmId
    res.render('logout');
}

exports.doLogin = function (req, res) {
    var userName = req.param('userName');
    var password = req.param('password');

    var condition = {
        $or: [{token: userName}, {wxName: userName}],
        password: password
    }
    opuserCollection.findOne(condition, function (err, user) {
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

exports.auth = function(req, res){
    var id = req.param('id')
    var entry = req.param('entry')
    var token = req.param('token')
    if (!id){
        res.send(401)
    } else {
        req.session.tvmId = id;
        var url = config.domain + '/admin/menu?'
        if (envConfig == 'localhost'){
            url = 'http://localhost:6002/admin/menu?'
        }
        if(entry){
            url += '&entry=' + entry
        }
        if(token){
            url += '&token=' + token
            req.session.token = token;
        } else {
            delete req.session.token;
        }
        console.log(url)
        res.redirect(url)
    }
}

exports.authAdminSession = function(req, res, next){
    if (!req.session.tvmId){
        delete req.session.tvmId
        delete req.session.token
        return res.send(401, '没有用户身份')
    }
    if (!req.session.token){
        delete req.session.token
    } else{
        req.token = req.session.token;
    }
    req.tvmId = req.session.tvmId
    next()
}

exports.authYaoSession = function(req, res, next){
    var tvmId = req.param('tvmId')
    console.log(req.session)
    if (!req.session.tvmId){
        delete req.session.tvmId
        delete req.session.token
        return res.send(401, '没有tvmId')
    } else {
        req.tvmId = req.session.tvmId
    }
    if (!req.session.token){
        delete req.session.token
        return res.send(401, '没有token')
    } else{
        req.token = req.session.token;
    }
    if (!req.session.yyyappId){
        delete req.session.yyyappId
        return res.send(401, '没有yyyappId')
    } else{
        req.yyyappId = req.session.yyyappId;
    }
    if (!req.session.mpappId){
        delete req.session.mpappId
        return res.send(401, '没有mpappId')
    } else{
        req.mpappId = req.session.mpappId;
    }
    next()
}

exports.wmhMenu = function(req, res){
    var entry = req.param('entry')
    var token = req.param('token')

    if (!req.session.tvmId){
        var url = config.wmhAuth.loginUrl + '?client_id=' + config.wmhAuth.appId + '&redirect_uri=';
        var redirectUrl = config.wmhAuth.redirect_uri + '?entry=' + entry
        if (token){
            redirectUrl += '&token=' + token
        }
        url += encodeURIComponent(redirectUrl)
        delete req.session.tvmId
        delete req.session.token
        console.log(url)
        return res.redirect(url);
    }
    req.tvmId = req.session.tvmId;
    if (token){
        req.token = req.session.token = token;
    } else {
        delete req.session.token;
    }
    if (entry == 'goods'){
        res.redirect('/admin/goods')
    } else if (entry == 'lotteryStatistics'){
        res.redirect('/admin/lottery/statistics/index')
    } else if (entry == 'order'){
        res.redirect('/admin/order/list')
    } else if (entry == 'store'){
        res.redirect('/admin/store')
    } else if (entry == 'market'){
        if (!token){
            res.redirect('/admin/card')
        } else {
            res.redirect('/admin/activity?way=1')
        }
    }
}

exports.yaoMenu = function(req, res){
    var entry = req.param('entry')
    var token = req.param('wx_token')
    var tvmId = req.param('tvmid')
    var yyyappId = req.param('yyyappid')
    var mpappId = req.param('mpappid')

    if (tvmId){
        req.tvmId = req.session.tvmId = tvmId;
    } else {
        res.send(400, '没有tvmId参数');
    }

    if (token){
        req.token = req.session.token = token;
    }  else {
        res.send(400, '没有token参数');
    }

    if (yyyappId){
        req.yyyappId = req.session.yyyappId = yyyappId;
    }  else {
        res.send(400, '没有yyyappid参数');
    }

    if (mpappId){
        req.mpappId = req.session.mpappId = mpappId;
    }  else {
        res.send(400, '没有mpappId参数');
    }

    if (entry == 'market'){
        if (!token){
            res.redirect('/yao/card')
        } else {
            res.redirect('/yao/activity?way=1')
        }
    } else {
        res.send(400, 'entry参数错误');
    }
}

exports.clearToken = function(req, res, next){
    req.token = null;
    next()
}