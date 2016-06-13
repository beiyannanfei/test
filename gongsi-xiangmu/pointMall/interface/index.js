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
var searchUrl = config.searchUrl;
var searchUrlTimeout = config.searchUrlTimeout;

/**
 * 根据昵称 查询用户
 * @type {queryUserName}
 */
var queryUserName = exports.queryUserName = function (username, wxToken, offset, limit, callback) {
    if (username && wxToken) {
        var _userHost  = ''
        if(wxToken=='GZRG9IQ7'){
            _userHost = userHostUS;
        }else{
            _userHost = userHost;
        }
        var url = _userHost + '/rest/PlatformUserinfo?token=' + token + '&wx_token=' + wxToken + '&username=' + username + '&limit=' + limit + '&offset=' + offset;
        request.get(url)
            .accept('text/json')
            .end(function (err,xhr) {
                if(err) {
                    console(err);
                }
                if (xhr.statusCode == 200) {
                    if (xhr.text) {
                        try {
                            var body = JSON.parse(xhr.text);
                            callback(body);
                        } catch (e) {
                            callback(null);
                        }
                    } else {
                        callback(null);
                    }
                } else {
                    callback(null);
                }
        });
    } else {
        callback(null);
    }
};


/**
 * 验证 官微token 是否合法
 * @type {verifyWxToken}
 */
var verifyWxToken = exports.verifyWxToken = function (wxToken, callback) {
    if (wxToken) {
        var _userHost  = ''
        if(wxToken=='GZRG9IQ7'){
            _userHost = userHostUS;
        }else{
            _userHost = userHost;
        }
        var url = _userHost + '/rest/userbind?token=' + token + '&wx_token=' + wxToken;
        parsingXML(url, function (data) {
            callback(data);
        });
    } else {
        callback(null);
    }
};

var getUserInfo = exports.getUserInfo = function (openId, wxToken, callback) {
    if (openId && wxToken) {
        var _userHost  = ''
        if(wxToken=='GZRG9IQ7'){
            _userHost = userHostUS;
        }else{
            _userHost = userHost;
        }
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
 * 获取url返回信息并解析XML
 * @type {parsingXML}
 */
var parsingXML = exports.parsingXML = function (url, callback) {
    getUrlData(url, function (data) {
        if (data) {
            parseString(data, {explicitArray: false, trim: true, explicitRoot: false}, function (err, result) {
                if (err) {
                    console.log('---解析XML报错，不是合法的xml---', err);
                    callback(null);
                } else {
                    if (result && result != 'undefined') {
                        callback(result);
                    } else {
                        callback(null);
                    }
                }
            });
        } else {
            callback(null);
        }
    });
}

/**
 * 获取ULR 返回信息
 * @type {getUrlData}
 */
var getUrlData = exports.getUrlData = function (url, callback) {
    if (url) {
        request.get(url)
            .end(function (err, res) {
                if (err) {
                    console.log(err);
                    callback(null);
                } else if (res.header && res.header['content-type'].indexOf('application/xml') != -1) {
                    var xml = '';
                    res.on('data', function (chunk) {
                        xml += chunk;
                    });
                    res.on('end', function () {
                        callback(xml);
                    });
                } else {
                    if (!res.text || res.text.length === 0) {
                        callback(null);
                    } else {
                        callback(res.text);
                    }
                }
            });
    } else {
        callback(null);
    }
};

var getQrcode = exports.getQrcode = function (wxToken, title, type, callback) {
    var _userHost  = ''
    if(wxToken=='GZRG9IQ7'){
        _userHost = userHostUS;
    }else{
        _userHost = userHost;
    }
    var url = _userHost + '/Qrcode?token=' + token;
    var params = {
        weixin_token: wxToken,
        title: title,
//        url:jumpUrl,
        type: type
    };
    var options = _.extend({}, params);
    request.post(url)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(options)
        .accept('text/json')
        .end(function (err, res) {
            if (err) {
                console.log(err);
            }
            if (res && res.statusCode === 200) {
                parseString(res.text, {explicitArray: false, trim: true, explicitRoot: false}, function (err, result) {
                    if (err) {
                        console.log('---解析XML报错，不是合法的xml---', err);
                        callback(null);
                    } else {
                        if (result && result != 'undefined') {
                            //console.log(result);
                            callback(result.data);
                        } else {
                            callback(null);
                        }
                    }
                });
            } else {
                callback(null);
            }
        });
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

    var _userHost  = ''
    if(wxToken=='GZRG9IQ7'){
        _userHost = userHostUS;
    }else{
        _userHost = userHost;
    }
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
//            console.log('------statusCode------', res.statusCode);
//            console.log(res.text);
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

    var _userHost  = ''
    if(wxToken=='GZRG9IQ7'){
        _userHost = userHostUS;
    }else{
        _userHost = userHost;
    }

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

/**
 * 更新指定用户信息
 * @type {wxRefreshUser}
 */
var wxRefreshUser = exports.wxRefreshUser = function (openId, wxToken, callback) {
    var _userHost  = ''
    if(wxToken=='GZRG9IQ7'){
        _userHost = userHostUS;
    }else{
        _userHost = userHost;
    }
    var url = _userHost + '/rest/wxrefreshuser?token=' + token;
    var params = {
        weixin_token: wxToken,
        openid: openId
    };
    var options = _.extend({}, params);
    request.post(url)
        .type('application/x-www-form-urlencoded')
        .send(options)
        .accept('text/json')
        .end(function (err, res) {
            if (err) {
                console.log(err);
            }
            if (res.statusCode == 200) {
                if (res.text) {
                    var body = JSON.parse(res.text);
                    callback(body);
                }
            } else {
                callback(null);
            }
        });
};

var searchKeyword = exports.searchKeyword = function (keyword, page, pagecount, wxToken, callback) {
    searchDeal(keyword, page, pagecount, wxToken, function (data) {
        if (data) {
            parseString(data, {explicitArray: false, trim: true, explicitRoot: false}, function (err, result) {
                if (err) {
                    console.log('---解析XML报错，不是合法的xml---', err);
                    callback(null);
                } else {
                    if (result && result != 'undefined') {
                        callback(result);
                    } else {
                        callback(null);
                    }
                }
            });
        } else {
            callback(null);
        }
    });
};


var searchDeal = exports.searchDeal = function (keyword, page, pagecount, wxToken, callback) {
    var url = searchUrl + '/?action=query&text=' + keyword + '&maxresults=' + pagecount + '&token=' + wxToken + '&pagenumber=' + page;
//    console.log('=================================================================');
//    console.log(url);
    request.get(url)
        .timeout(1500)
        .end(function (err, res) {
            if (err) {
                console.log('------------------------searchUrl Timeout---------------------------------');
                var _url = searchUrlTimeout + '/?action=query&text=' + keyword + '&maxresults=' + pagecount + '&token=' + wxToken + '&pagenumber=' + page;
                request.get(_url)
                    .end(function (err, res) {
                        if (err) {
                            callback(null);
                        } else if (res.header && res.header['content-type'].indexOf('application/xml') != -1) {
                            var xml = '';
                            res.on('data', function (chunk) {
                                xml += chunk;
                            });
                            res.on('end', function () {
                                callback(xml);
                            });
                        } else {
                            if (!res.text || res.text.length === 0) {
                                callback(null);
                            } else {
                                //处理
                                callback(res.text);
                            }
                        }
                    });
            } else {
                if (res.header && res.header['content-type'].indexOf('application/xml') != -1) {
                    var xml = '';
                    res.on('data', function (chunk) {
                        xml += chunk;
                    });
                    res.on('end', function () {
                        callback(xml);
                    });
                } else {
                    if (!res.text || res.text.length === 0) {
                        callback(null);
                    } else {
                        //处理
                        callback(res.text);
                    }
                }
            }
        });
};