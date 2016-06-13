/**
 * Created by chenjie on 2014/8/22.
 */
var fs = require('fs');
var request = require('superagent');
var config = require('../config');
var _ = require('underscore');
var opUser = require('./opUser');
var xml2js = require('xml2js');
var parseString = xml2js.parseString;
var jsonxml = require('jsontoxml');
var qs = require('querystring')

var https = require('https')
var parse = require('url').parse;

var tkConfig = require('../tokenConfig');
var tokenConfig = tkConfig.CONFIG;

var tools = require('../tools');
var utils = require('./utils');
var mUser = require('./user');

var interface = require('../interface');
var models = require('../models/index');
var Users = models.Users;
var IntegralLog = models.IntegralLog;
var Personal = models.Personal;

var lastPusTime = null
exports.pushErrorMsg = function(msg){
    if (lastPusTime && new Date().getTime() - lastPusTime < 60 * 1000){
        return
    }
    var url = 'http://mb.tv.tvmining.com/rest/wxpush?token=7fda67277f'
    var params = {
        content: msg,
        weixin_token: 'tvmty',
        openids: 'oux1puBfVrHCUDnvqSIjwxh2NQ0Q,oux1puLLtHRV-mEyIz0EXNd17zHo',
        weixin_type: 'text'
    };
    httpPost(url, params, function(err, response){
        lastPusTime = new Date().getTime();
    })
}

exports.getServerInfo = function (token, cb) {
    var url = config.userHost + "/rest/userbind?token=" + config.token + '&wx_token=' + token;
    httpGet(url, cb);
}

exports.getwxAccessToken = function(cb){
    var url = 'http://mb.mtq.tvm.cn/rest/wxaccesstoken?token=' + config.token + '&weixin_token=' + config.tvmMallToken;
    httpGet(url, cb);
}

exports.getFollowUrl = function (token, cb) {
    var url = config.wmhUrl + "/rest/weixin/info?token=" + token;
    httpGet(url, cb);
}

exports.getWxJsParam = function (token, cb) {
    var url = config.userHost + "/rest/wxjsticket?token=" + config.token + '&wx_token=' + token;
    httpGet(url, cb);
}

exports.getUserInfo = function (token, openIds, cb) {
    if (!openIds) {
        cb('openId不存在');
    } else if (!_.isArray(openIds)) {
        openIds = [openIds]
    }
    openIds = _.uniq(openIds);
    var len = openIds.length;
    openIds = openIds.join(',')

    var url = config.userHost + '/rest/PlatformUserinfo?token=' + config.token + '&wx_token=' + token + '&openid=' + openIds + '&limit=' + len;
    httpGet(url, cb);
}

exports.addLotteryKeyword = function (token) {
    return;
    if (!token) {
        console.log('addLotteryKeyword err, token is not exists')
        return;
    }

    var findKeyword = function () {
        opUser.findOpUser({token: token, keywords: "WYLJ#"}, function (err, o) {
            if (err) {
                console.log('mongodb error')
            } else if (!o) {
                setKeywords();
            } else {
                console.log('keywords has existed')
            }
        })
    }

    var updateKeyword = function () {
        var UPDATE_SPEC = {
            $addToSet: {keywords: "WYLJ#"}
        }
        opUser.updateOpUser(token, UPDATE_SPEC)
    }

    var setKeywords = function () {
        var url = config.userHost + '/rest/appkeyword?token=' + config.token
        var params = {
            wx_token: token,
            keyword: "WYLJ#",
            api_http: config.domain + config.path + '/lottery/fill/info?wx_token=' + token
        }
        httpPost(url, params, function (err, response) {
            if (err) {
                console.log(err);
            } else {
                console.log(response)
                if (response.result == true) {
                    updateKeyword()
                }
            }
        })
    }

    findKeyword();
}

function httpGet(url, cb) {
    console.log(url)
    request.get(url)
        .type('application/x-www-form-urlencoded')
        .accept('text/json')
        .end(function (xhr) {
        if (xhr.statusCode == 200) {
            if (xhr.text) {
                var body;
                try {
                    body = JSON.parse(xhr.text);
                } catch (e) {
                    body = xhr.text
                }
                cb(null, body);
            } else {
                cb('response has not content');
            }
        } else {
            cb(xhr.statusCode);
        }
    });
}

function httpPost(url, params, cb) {
    var options = _.extend({}, params);
    console.log(url)
    request.post(url)
        .type('application/x-www-form-urlencoded')
        .send(options).accept('text/json')
        .end(function (xhr) {
            if (xhr.statusCode == 200) {
                if (xhr.text) {
                    var body;
                    try {
                        body = JSON.parse(xhr.text);
                    } catch (e) {
                        body = xhr.text
                    }
                    cb(null, body);
                } else {
                    cb('response has not content');
                }
            } else {
                cb(xhr.statusCode);
            }
        });
}

function httpPostNoEncoded(url, params, cb) {
    var options = _.extend({}, params);
    console.log(url)
    request.post(url)
        .send(options).accept('text/json')
        .end(function (xhr) {
            if (xhr.statusCode == 200) {
                if (xhr.text) {
                    var body;
                    try {
                        body = JSON.parse(xhr.text);
                    } catch (e) {
                        body = xhr.text
                    }
                    cb(null, body);
                } else {
                    cb('response has not content');
                }
            } else {
                cb(xhr.statusCode);
            }
        });
}

exports.reacquireUsers = function (wxToken, openId, callback) {
    var _id = tools.joinId(wxToken, openId);
    exports.getUserInfo(wxToken, openId, function(err, response){
        //console.log(response)
        if (err){
            callback(null)
        } else if (!response || !response.data || response.data.length != 1){
            callback(null)
        } else {
            var user = response.data[0]
            var userObj = {
                openId: openId,
                wxToken: wxToken,
                nickName: user.username || '',
                headImg: user.weixin_avatar_url || '',
                city: user.city || '',
                province: user.province || '',
                subscribe_time: user.add_time || '',
                unionid: user.unionid || '',
                sex: user.sex >= 0? user.sex:''
            };
            if (user.source == '1'){
                userObj.status = 'subscribe'
            } else if (user.source == '3'){
                userObj.status = 'unsubscribe'
            } else {
                userObj.status = 'authorize'
            }

            callback(userObj);
            Users.findById(_id, function(err, o){
                if (err){

                } else if (!o){
                    userObj._id = _id
                    insertUser();
                } else {
                    updateUser();
                }
            })

            var insertUser = function(){
                mUser.saveUser(userObj, false, function(err, doc){

                });
            }

            var updateUser = function(){
                Users.findByIdAndUpdate(_id, userObj, function(err, o){

                })
            }
        }
    })
};

exports.postLotteryEventData = function (params, cb) {
    var TCONFIG = tokenConfig['DEFAULT'];
    var url = '';
    var NODE_ENV = config.NODE_ENV;
    if (NODE_ENV == 'prod' && TCONFIG.lotteryEventPostUrl){
        url = TCONFIG.lotteryEventPostUrl;
    } else if (NODE_ENV == 'dev' && TCONFIG.dev_lotteryEventPostUrl){
        url = TCONFIG.dev_lotteryEventPostUrl;
    } else if (NODE_ENV == 'ali' && TCONFIG.ali_lotteryEventPostUrl){
        url = TCONFIG.ali_lotteryEventPostUrl;
    }
    if (!url){
        console.log('has not event post url!');
        return cb('has not event post url!')
    }
    console.log(params)
    httpPost(url, params, cb)
}

exports.postWxHttp = function(url, params, cb){
    var options = _.extend({}, params);
    var xml = jsonxml(options, {})
    xml = '<xml>' + xml + '</xml>'
    console.log(xml)
    console.log(url)
    request.post(url)
        .type('text/html')
        .send(xml)
        .end(function(xhr) {
        if (xhr.statusCode == 200){
            if (xhr.text){
                parseString(xhr.text, {explicitArray: false, trim: true, explicitRoot: false}, function(err, result){
                    cb(err, result);
                })
            } else {
                cb('no response');
            }
        } else {
            cb(xhr.statusCode);
        }
    });
}

exports.postWxHttps = function(url, wx_ssl_options, params, cb){
    var paramBody = _.extend({}, params);
    var body = jsonxml(paramBody, {})
    body = '<xml>' + body + '</xml>'

    url = parse(url, true);

    var options = {
        method: 'POST',
        key: wx_ssl_options.key,
        cert: wx_ssl_options.cert,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': body.length
    }
    options.path = url.pathname;
    options.host = url.hostname;

    var req = https.request(options, function(res) {
        var buf = ''
        res.on('data', function(chunk) {
            buf += chunk
        });

        res.on('end', function() {
            parseString(buf, {explicitArray: false, trim: true, explicitRoot: false}, function(err, result){
                cb(err, result);
            })
        });

        res.on('error', function(e) {
            console.log('res error:' + e)
            cb(e);
        });
    });

    if (body){
        req.end(body);
    } else {
        req.end();
    }

    req.on('error', function(e) {
        console.log('req error:' + e)
        cb(e);
    });
}

exports.postwxTemplate = function(url, params, cb){
    httpPostNoEncoded(url, params, cb)
}

exports.postBehavior = function(type, param){
    var url = "http://ana.mtq.tvm.cn/ana";
    if (param.event_code == '125000'){
        param.id = "553f45f6a976e7b3bf000002"
    } else if (param.event_code == '117000'){
        param.id = "553f459da976e7b3bf000001"
    } else{
        return;
    }
    httpGet(url, function(){})
}