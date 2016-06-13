/**
 * Created by nice on 2014/8/20.
 */


var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var request = require('superagent');
var _ = require('underscore');
var config = require('../config.js');
var userHost = config.userHost;
var userHostUS = config.userHostUS;
var token = config.token;

var getUserInfo = exports.getUserInfo = function (openId, wxToken, callback) {
    if (openId && wxToken) {
        var _userHost  = userHost
        var url = _userHost + '/rest/PlatformUserinfo?token=' + token + '&wx_token=' + wxToken + '&openid=' + openId;
        parsingXML(url, function (data) {
            if (data && data.data && data.data.data) {
                callback(data);
            } else {
                console.log('==============获取用户信息失败--数据===============', data);
                callback(null);
            }
        });
    } else {
        callback(null);
    }
};

/**
 * 发送文本消息
 *
 *  var openId = 'ocKZ5uG3Q5u6Y2NrfphoFn0r5dD4';
 *  var wxToken = 'zyc839'
 *   var content = '测试';
 *
 * @type {pushMessage}
 */
var pushMessage = exports.pushMessage = function (wxToken, openIds, content, callback) {
    if (!openIds) {
        callback('openId不存在');
    } else if (!_.isArray(openIds)) {
        openIds = [openIds]
    }
    openIds = _.uniq(openIds);
    openIds = openIds.join(',')

    var _userHost  = userHost
    var url = _userHost + '/rest/wxpush?token=' + token;
    var params = {
        content: content,
        weixin_token: wxToken,
        openids: openIds,
        weixin_type: 'text'
    };
    var options = _.extend({}, params);
    request.post(url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(options)
        .accept('text/json')
        .end(function (err, res) {
            if(err){
                console.log('=================微信发送文本消息失败====================');
                console.log(err);
                callback(err);
            } else {
                callback(err, res.text);
            }
        });
};


/**
 * 发送图文消息
 *
 * var openId = 'ocKZ5uG3Q5u6Y2NrfphoFn0r5dD4';
 * var wxToken = 'zyc839'
 * var articles = {
        "articles": [
            {
                "title": "海外华人的福音来了！",
                "description": "让所有海外华人听到祖国的声音！ 阳光微电视，让你在手机上全世界免费看中文电视！全球各地，与中国同步！",
                "url": "http://mp.weixin.qq.com/s?__biz=MzAwNTAwMjg3MQ==&mid=201613005&idx=1&sn=a25a8be2a705a759ecae1d9c7ef476b7#rd",
                "picurl": "http://operate.wechat.suntv.tv/images/hello.jpg"
            }
        ]
    };
 *
 * @type {pushMessage}
 */
var pushMessageNews = exports.pushMessageNews = function (wxToken, openIds, articles,callback) {

    if (!openIds) {
        callback('openId不存在');
    } else if (!_.isArray(openIds)) {
        openIds = [openIds];
    }
    openIds = _.uniq(openIds);
    openIds = openIds.join(',');

    articles = JSON.stringify(articles);

    var _userHost  = userHost
    var url = _userHost + '/rest/wxpush?token=' + token;
    var params = {
        content: encodeURIComponent(articles),
        weixin_token: wxToken,
        openids: openIds,
        weixin_type: 'news'
    };
    var options = _.extend({}, params);
    request.post(url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(options)
        .accept('text/json')
        .end(function (err, res) {
//            console.log('------statusCode------', res.statusCode);
//            console.log(JSON.parse(res.text));
//            console.log(JSON.parse(res.text).message);
            if(err){
                console.log('=================微信发送图文信息失败====================');
                console.log(err);
                callback(err);
            } else {
                callback(err, res.text);
            }
        });
};