var config = require('./config')
var _ = require('underscore')

var cctv5 = {
    scoreHelp: 'http://v3.tv.cctv5.cctv.com/manage_mobile/assist.htm',
    statisticsUrl: 'http://tajs.qq.com/stats?sId=37793518'
}

var dsbl = {
    scoreHelp: 'http://v3.tv.cctv5.cctv.com/manage_mobile/assist.htm'
}

var DEFAULT = {
    activity: {
        cover: '/pointMall/images/default/cover-default.jpg',
        ggkBg: '/pointMall/images/default/ggkBg.jpg',
        turnplateBg: '/pointMall/images/default/turnplateBg.jpg'
    },
    lotteryEventPostUrl: 'http://wall.mtq.tvm.cn/postSubject/rec',
    ali_lotteryEventPostUrl: 'http://a.wall.mtq.tvm.cn/postSubject/rec',
    dev_lotteryEventPostUrl: 'http://t9.dev.tvm.cn/postSubject/rec',
    domain: config.domain,
    authDomain: config.userHost,
    wmhUrl: config.wmhUrl
}

var TMJYSH = {
    domain: 'http://mall.mtq.sogego.com',
    authDomain: 'http://mb.mtq.sogego.com'
}

var btv = {
    domain: 'http://mall.mtq.brtn.cn',
    wmhUrl: "http://iwmh.mtq.brtn.cn"
    /*authDomain: 'http://mb.mtq.brtn.cn'*/
}

var CONFIG = {
    '3a59f7a4b8b28dca': cctv5,
    'dsbl': dsbl,
    /*'tmjysh': TMJYSH,*/
    'd8655228ec57a752': btv,
    'DEFAULT': DEFAULT
}

exports.getDomain = function(token){
    if (CONFIG[token] && CONFIG[token].domain){
        return CONFIG[token].domain
    } else {
        return CONFIG.DEFAULT.domain
    }
}

exports.getWMHDomain = function(token){
    if (CONFIG[token] && CONFIG[token].wmhUrl){
        return CONFIG[token].wmhUrl
    } else {
        return CONFIG.DEFAULT.wmhUrl
    }
}

exports.getAuthDomain = function(token){
    if (CONFIG[token] && CONFIG[token].authDomain){
        return CONFIG[token].authDomain
    } else if (config.NODE_ENV == 'us'){
        return 'http://operate.wechat.suntv.tv'
    } else {
        return CONFIG.DEFAULT.authDomain
    }
}

exports.CONFIG = CONFIG;
