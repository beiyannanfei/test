/**
 * Created by nice on 2014/8/20.
 */

var moment = require('moment');
var URL = require('url');
var xml2js = require('xml2js');
var tools = require('../tools');
var interface = require('../interface');
var search = require('./search');
var mUser = require('./user');
var models = require('../models/index');
var Users = models.UsersPoint;
var IntegralLog = models.IntegralLog;
var Personal = models.Personal;
var mIntegral = require('../interface/integral.js');

var _ = require('underscore');

var utils = require('./utils');

var config = require('../config.js');
var tkConfig = require('../tokenConfig.js');
var userHost = config.userHost;
var userHostUS = config.userHostUS;
var token = config.token;

var saveIntegralLog = exports.saveIntegralLog = function (obj) {
    var integralLog = new IntegralLog(obj);
    integralLog.save(function (err, doc) {
        if (err) {
            console.log(err);
        }
    });
};

exports.index = function (req, res) {
    var wxToken = req.session.token;
    if (wxToken) {
//        console.log('=========================== wxToken ===================================', wxToken);
        req.session.wxToken = wxToken;
        var redirect_uri = encodeURIComponent(tkConfig.getDomain(wxToken)+ '/pointMall/personal/index?wxToken=' + wxToken);
        var personalUrl = ''
        if (wxToken == 'GZRG9IQ7') {
            personalUrl = userHostUS + '/oauth?wx_token=' + wxToken + '&token=' + token + '&unionid=1&redirect_uri=' + redirect_uri;
        } else {
            personalUrl = tkConfig.getAuthDomain(wxToken) + '/oauth?wx_token=' + wxToken + '&token=' + token + '&unionid=1&redirect_uri=' + redirect_uri;
        }
        res.render('integral', {
            layout: false,
            title: req.integralUnit+'管理',
            wxToken: wxToken,
            userHost: userHost,
            token: token,
            unit:req.integralUnit,
            personalUrl: personalUrl
        });
    } else {
        res.send('wxToken is null');
    }
};


exports.top = function (req, res) {
    var number = req.query.number || 20;
    var wxToken = req.session.token;
    if (wxToken) {
        querTop(wxToken, number, function (data) {
            res.send({status: 'success', data: data});
        });
    } else {
        res.send({status: 'failed', msg: 'wxToken is null'});
    }
};

exports.filter = function (req, res) {
    var nickName = req.query.nickName || null;
    var startNumber = req.query.startNumber || null;
    var endNumber = req.query.endNumber || null;
    var page = req.query.page || 1;
    var pagecount = req.query.pagecount || 10;
    var skipcount = req.query.skipcount || 0;
    var skip = (page == 1) ? skipcount : ((page - 1) * pagecount);
    var wxToken = req.session.token;
    if (wxToken) {
        var condition = {};
        if(nickName){
            condition.nickName= nickName;
        }
        if(startNumber && endNumber){
            condition.integral= {$gte: startNumber, $lte: endNumber};
        }
        if(condition){
            condition.wxToken = wxToken;
            Users.find(condition)
                .select({'openId': 1,'integral': 1,'wxToken': 1,'nickName': 1,'headImg': 1})
                .limit(pagecount)
                .skip(skip)
                .sort({'integral':-1})
                .exec(function (err, docs) {
                    if (err) {
                        console.log(err);
                    }
                    if(page==1){
                        getUsersTotal(condition,function(count){
                            var total = 0;
                            var page_count = 0;
                            if(count){
                                total = count;
                                page_count = Math.ceil(count / pagecount);
                            }
                            res.send({status: 'success', data: docs,total:total,pages:page_count});
                        });
                    }else{
                        res.send({status: 'success', data: docs});
                    }
                });
        }else{
            res.send({status: 'failed', msg: 'startNumber or endNumber is null'});
        }
    } else {
        res.send({status: 'failed', msg: 'wxToken is null'});
    }
};


var findIntegralIds = function (openIds, callback) {
    var condition = {
        openId: {$in: openIds}
    }
    Users.find(condition, function (err, integrals) {
        if (err) {
            console.log(err);
            return callback({});
        }
        if (!integrals || integrals.length == 0) {
            return callback({});
        }
        var friendMap = {};
        _.each(integrals, function (integral) {
            friendMap[integral.openId] = integral;
        });
        callback(friendMap);
    })
};

/**
 * 积分操作
 * @param req
 * @param res
 */
exports.integralAction = function (req, res) {
    var openId = req.param('openId') || '';
    var integral = req.param('integral') || 0;
    var action = req.param('action') || '';
    var description = req.param('description') || '';
    var source = req.param('source') || '';
    var wxToken = req.session.token;
    if (wxToken) {
        var _id = tools.joinId(wxToken, openId);
        if (openId && integral > 0 && action) {
            if (action === 'add') {
                addIntegral(_id, openId, wxToken, integral, description, source, function (integralInfo) {
                    if (integralInfo && integralInfo.status === 'success') {
                        res.send({status: 'success', data: integralInfo});
                    } else {
                        res.send({status: 'failed', msg: '服务器异常'});
                    }
                });
            } else if (action === 'minus') {
                minusIntegral(_id, openId, wxToken, integral, description, source, function (integralInfo) {
                    if (integralInfo && integralInfo.status === 'success') {
                        res.send({status: 'success', data: integralInfo});
                    } else {
                        if (integralInfo && integralInfo.code === 'M000') {
                            res.send({status: 'failed', code: 'M000', msg: '积分不够！'});
                        } else {
                            res.send({status: 'failed', msg: '服务器异常'});
                        }
                    }
                });
            } else {
                res.send({status: 'failed', msg: 'action 不合法'});
            }
        } else {
            res.send({status: 'failed'});
        }
    } else {
        res.send({status: 'failed', msg: 'wxToken is null'});
    }

};


exports.integralDetails = function (req, res) {
    var openId = req.query.openId;
    var wxToken = req.session.token;
    var source = req.query.source || '';
    if (wxToken) {
        var _id = tools.joinId(wxToken, openId);
        var sort = 'dateTime';
        var skip = 0;
        var pagecount = 20;
        search.queryIntegralLog(openId, wxToken, skip, pagecount, sort, source, function (data) {


            _.each(data, function (d) {
                d.timeStr = moment(d.dateTime).format('YYYY/MM/DD HH:mm:ss');
            });
            Users.findById(_id, function (err, doc) {
                if (err) {
                    console.log(err);
                }
                var nickName = '';
                var headImg = '';
                var integral = '';
                if (doc) {
                    nickName = doc.nickName;
                    headImg = doc.headImg;
                    integral = doc.integral;
                }
                res.render('integral-list', {
                    layout: false,
                    title: '积分详情',
                    nickName: nickName,
                    headImg: headImg,
                    integral: integral,
                    openId:openId,
                    length:data.length,
                    unit:req.integralUnit,
                    wxToken: wxToken,
                    data: data
                });
            });
        });
    } else {
        res.send('wxToken is null');
    }
};

exports.history = function (req, res) {
    var wxToken = req.session.token;
    var source = 'platform';
    var page = req.query.page || 1;
    var pagecount = req.query.pagecount || 10;
    var skipcount = req.query.skipcount || 0;
    var skip = (page == 1) ? skipcount : ((page - 1) * pagecount);
    var sort = req.query.sort || 'dateTime';
    var source = req.query.source || 'platform';
    if (wxToken) {
        var openId = '';
        search.queryIntegralLog(openId, wxToken, skip, pagecount, sort, source, function (data) {
            data = utils.doc2Object(data);
            var ids = _.pluck(data, 'openId');
            findIntegralIds(ids, function (list) {
                _.each(data, function (array) {
                    if (list && list[array.openId]) {
                        array.nickName = list[array.openId].nickName;
                        array.headImg = list[array.openId].headImg;
                        array.dateTime = moment(array.dateTime).format('YYYY/MM/DD HH:mm:ss');
                    }
                });
                res.send({status: 'success', data: data});
            });
        });
    } else {
        res.send({status: 'failed', msg: '缺少参数或者参数值为空', data: []});
    }
};


/**
 * 根据用户昵称查询用户数据
 * @param req
 * @param res
 */
exports.queryUserName = function (req, res) {
    var params = URL.parse(req.url, true);
    var nickName = req.query.nickName;
    var wxToken = req.session.token;
    var page = req.query.offset || 0;
    var pagecount = req.query.limit || 20;

    if (wxToken && wxToken != 'undefined') {
        var offset = page * pagecount;
        interface.queryUserName(nickName, wxToken, offset, pagecount, function (data) {
            if (data) {
                var dataArray = [];
                if (_.isArray(data.data)) {
                    dataArray = data.data || [];
                } else {
                    var obj = data.data.data || {};
                    dataArray.push(obj);
                }
                if (dataArray && dataArray.length > 0) {
                    if (dataArray[0]) {
                        var ids = _.pluck(dataArray, 'openid');
                        findIntegralIds(ids, function (list) {
                            _.each(dataArray, function (array) {
                                if (list && list[array.openid]) {
                                    array.integral = list[array.openid].integral;
                                } else {
                                    addUser(array, wxToken, function (data) {
                                    });
                                    array.integral = 0;
                                }
                            });
                            res.send({status: 'success', data: dataArray});
                        });
                    } else {
                        res.send({status: 'success', data: []});
                    }
                } else {
                    res.send({status: 'success', data: []});
                }
            } else {
                res.send({status: 'success', data: []});
            }
        });
    } else {
        res.send({status: 'failed', msg: 'wxToken is null'});
    }
};

/**
 * 添加用户
 * @param obj
 * @param wxToken
 * @param callback
 */
var addUser = function (obj, wxToken, callback) {
    var _id = tools.joinId(wxToken, obj.openid);
    var userObj = {
        _id: _id,
        openId: obj.openid,
        wxToken: wxToken,
        nickName: obj.nickname || '',
        headImg: obj.weixin_avatar_url || '',
        city: obj.city || '',
        province: obj.province || '',
        subscribe_time: obj.add_time || ''
    };
    if (obj && obj.unionid) {
        userObj.userObj = obj.unionid;
    }
    insertUser(userObj, function (userInfo) {
        if (userInfo && userInfo.status === 'success') {
            callback(userInfo.doc);
        } else {
            callback(null);
        }
    });

}

/**
 * 查询积分top 20
 */
var querTop = function (wxToken, number, callback) {
    var sort = 'integral';
    var page = 1;
    var pagecount = number;
    var skipcount = 0;
    var skip = (page == 1) ? skipcount : ((page - 1) * pagecount);
    var condition = {wxToken: wxToken};
    var sortObj = {};
    if (sort === 'integral') {
        sortObj = {'integral': -1};
    } else {
        sortObj = {'dateTime': -1};
    }
    Users.find(condition)
        .where()
        .select({openId: 1, integral: 1, nickName: 1, headImg: 1})
        .limit(pagecount)
        .skip(skip)
        .sort(sortObj)
        .exec(function (err, docs) {
            if (err) {
                console.log(err);
                callback([]);
            } else {
                if (docs) {
                    callback(docs);
                } else {
                    callback([]);
                }
            }
        });
};


/**
 * 增加积分操作
 * {
 "openId":"",			//微信ID
 "integral":0,			//积分
 "wxToken":""           //官微token
 "description":"",		//描述信息	什么操作
 }
 * @type {*}
 */
exports.addIndex = function (req, res) {
    var params = URL.parse(req.url, true);
    var body = req.body;
    var dateTime = new moment().valueOf().toString();
    if (body && body != 'undefined') {
        if (body.openId && body.integral && body.wxToken) {
            var openId = body.openId;
            var integral = body.integral;
            var wxToken = body.wxToken;
            var description = body.description || '';
            var source = body.source || '';
            interface.verifyWxToken(wxToken, function (chunk) {
                if (chunk) {
                    var _id = tools.joinId(wxToken, openId);
                    Users.findById(_id, function (err, doc) {
                        if (err) {
                            console.log(err);
                            tools.resToClient(res, params, {status: 'failed', msg: 'query mongodb error'});
                        } else {
                            Personal.findOne({wxToken: wxToken}, function (err, personal) {
                                if (err) {
                                    console.log(err)
                                }
                                var unit = '积分';
                                if(personal){
                                    unit  =personal.unit;
                                }
                                if (doc) {
                                    addIntegral(_id, openId, wxToken, integral, description, source, function (integralInfo) {
                                        if (integralInfo && integralInfo.status === 'success') {
                                            tools.resToClient(res, params, {status: 'success', integral: integralInfo.data.integral,unit:unit});
                                        } else {
                                            tools.resToClient(res, params, {status: 'failed', msg: '服务器异常'});
                                        }
                                    });
                                } else {
                                    interface.getUserInfo(openId, wxToken, function (info) {
                                        if (info && info.data.data) {
                                            var data = info.data.data;
                                            var userObj = {
                                                _id: _id,
                                                openId: openId,
                                                wxToken: wxToken,
                                                nickName: data.username || '',
                                                headImg: data.weixin_avatar_url || '',
                                                city: data.city || '',
                                                province: data.province || '',
                                                subscribe_time: data.add_time || '',
                                                unionid:data.unionid || ''
                                            };
                                            insertUser(userObj, function (userInfo) {
                                                if (userInfo && userInfo.status === 'success') {
                                                    addIntegral(_id, openId, wxToken, integral, description, source, function (integralInfo) {
                                                        if (integralInfo && integralInfo.status === 'success') {
                                                            tools.resToClient(res, params, {status: 'success', integral: integralInfo.data.integral,unit:unit});
                                                        } else {
                                                            tools.resToClient(res, params, {status: 'failed', msg: '服务器异常'});
                                                        }
                                                    });
                                                } else {
                                                    tools.resToClient(res, params, {status: 'failed', msg: '服务器异常'});
                                                }
                                            });
                                        } else {
                                            tools.resToClient(res, params, {status: 'failed', msg: 'openid 不合法'});
                                        }
                                    });
                                }
                            });
                        }
                    });
                } else {
                    tools.resToClient(res, params, {status: 'failed', msg: 'token 不合法'});
                }
            });
        } else {
            tools.resToClient(res, params, {status: 'failed', msg: '缺少参数、或参数值为空'});
        }
    } else {
        tools.resToClient(res, params, {status: 'failed', msg: '格式不正确、头信息不是JSON'});
    }
};


var sendMessageWechat = exports.sendMessageWechat = function (openId, message, callback) {

}

/**
 * 减积分操作
 * {
 "openId":"",			//微信ID
 "integral":0,			//积分
 "wxToken":""           //官微token
 "description":"",		//描述信息	什么操作
 }
 * @type {*}
 */
exports.minusIndex = function (req, res) {
    var params = URL.parse(req.url, true);
    var body = req.body;
    var dateTime = new moment().valueOf().toString();
    if (body && body != 'undefined') {
        if (body.openId && body.integral && body.wxToken) {
            var openId = body.openId;
            var integral = body.integral;
            var wxToken = body.wxToken;
            var description = body.description || '';
            var source = body.source || '';
            interface.verifyWxToken(wxToken, function (chunk) {
                if (chunk) {
                    var _id = tools.joinId(wxToken, openId);
                    Users.findById(_id, function (err, doc) {
                        if (err) {
                            console.log(err);
                            tools.resToClient(res, params, {status: 'failed', msg: 'query mongodb error'});
                        } else {
                            if (doc) {
                                var points = doc.integral - integral;
                                if (points >= 0) {
                                    minusIntegral(_id, openId, wxToken, integral, description, source, function (integralInfo) {
                                        if (integralInfo && integralInfo.status === 'success') {
                                            Personal.findOne({wxToken: wxToken}, function (err, personal) {
                                                if (err) {
                                                    console.log(err)
                                                }
                                                var unit = '积分';
                                                if(personal){
                                                    unit  =personal.unit;
                                                }
                                                tools.resToClient(res, params, {status: 'success', integral: integralInfo.data.integral,unit:unit});
                                            });
                                        } else {
                                            tools.resToClient(res, params, {status: 'failed', msg: '服务器异常'});
                                        }
                                    });
                                } else {
                                    tools.resToClient(res, params, {status: 'failed', msg: '积分不够减'});
                                }
                            } else {
                                tools.resToClient(res, params, {status: 'failed', msg: '无此 openid 用户信息'});
                            }
                        }
                    });
                } else {
                    tools.resToClient(res, params, {status: 'failed', msg: 'token 不合法'});
                }
            });
        } else {
            tools.resToClient(res, params, {status: 'failed', msg: '缺少参数、或参数值为空'});
        }
    } else {
        tools.resToClient(res, params, {status: 'failed', msg: '格式不正确、头信息不是JSON'});
    }
};

/**
 * 加积分
 * @param _id               ID
 * @param wxToken           官微token
 * @param integral          积分
 * @param description       描述信息
 * @param callback
 */
var addIntegral = exports.addIntegral = function (_id, openId, wxToken, integral, description, source, callback) {
    /*var timeStr = new moment().valueOf().toString();
    timeStr = moment(parseInt(timeStr, 10)).format('YYYY/MM/DD HH:mm:ss');
    Users.findByIdAndUpdate(_id, {$inc: {integral: integral}}, function (err, doc) {
        if (err) {
            console.log(err);
            callback({status: 'failed'});
        } else {
            if (doc) {
                //积分日志记录
                var obj = {
                    openId: openId,
                    wxToken: wxToken,
                    integral: integral,
                    description: description,
                    timeStr: timeStr
                };
                if (source && source != 'undefined') {
                    obj.source = source;
                }
//                console.log('=====================添加积分日志记录==================', obj);
                saveIntegralLog(obj);
                callback({status: 'success', data: doc, flag: 'add'});
            } else {
                callback({status: 'failed'});
            }
        }
    });*/
    mIntegral.changeIntegral(wxToken, openId, integral, description, function(err, response){
        if (err || !response || response.status == 'failed'){
            return callback({status: 'failed'});
        }
        Users.findById(_id, function(err, doc){
            if (doc){
                doc = utils.doc2Object(doc)
                doc.integral = response.integral?response.integral:0
                callback({status: 'success', data: doc, flag: 'add'});
            } else {
                callback({status: 'failed'});
            }
        })
    });
};
/**
 * 减积分
 * @param _id               ID
 * @param wxToken           官微token
 * @param integral          积分
 * @param description       描述信息
 * @param callback
 */
var minusIntegral = exports.minusIntegral = function (_id, openId, wxToken, integral, description, source, callback) {
    /*var timeStr = new moment().valueOf().toString();
    timeStr = moment(parseInt(timeStr, 10)).format('YYYY/MM/DD HH:mm:ss');
    Users.findById(_id, function (err, data) {
        if (err) {
            console.log(err);
            callback({status: 'failed'});
        } else {
            if (data && (data.integral - integral) > -1) {

                Users.findByIdAndUpdate(_id, {$inc: {integral: -integral}}, function (err, doc) {
                    if (err) {
                        console.log(err);
                        callback({status: 'failed'});
                    } else {
                        if (doc) {
                            //积分日志记录
                            var obj = {
                                openId: openId,
                                wxToken: wxToken,
                                integral: -integral,
                                description: description,
                                timeStr: timeStr
                            };
                            if (source && source != 'undefined') {
                                obj.source = source;
                            }
                            saveIntegralLog(obj);
                            callback({status: 'success', data: doc, flag: 'minus'});
                        } else {
                            callback({status: 'failed'});
                        }
                    }
                });
            } else {
                callback({status: 'failed', code: 'M000', msg: '积分不够'});
            }
        }
    });*/

    mIntegral.changeIntegral(wxToken, openId, -integral, description, function(err, response){
        if (err || !response || response.status == 'failed'){
            return callback({status: 'failed', code: 'M000', msg: '积分不够'});
        }
        Users.findById(_id, function(err, doc){
            if (doc){
                doc = utils.doc2Object(doc)
                doc.integral = response.integral?response.integral:0
                callback({status: 'success', data: doc, flag: 'minus'});
            } else {
                callback({status: 'failed'});
            }
        })

    });
};

/**
 * 新增用户
 * @param userInfo
 * @param callback
 */
var insertUser = exports.insertUser = function (userInfo, callback) {
    var id = userInfo._id;
    Users.findById(id, function (err, info) {
        if (err) {
            console.log(err);
            callback({status: 'failed'});
        } else {
            if (!info) {
                mUser.saveUser(userInfo, true, function(err, doc){
                    if (err) {
                        callback({status: 'failed'});
                    } else {
                        if (doc) {
                            callback({status: 'success', doc: doc, flag: 'add'});
                        } else {
                            callback({status: 'failed'});
                        }
                    }
                })
            } else {
                callback({status: 'success', doc: info});
            }
        }
    });
};


/**
 * 积分日志入库
 * @param obj
 */

var getUsersTotal = function (condition, callback) {
    Users.count(condition, function (err, count) {
        if (err) {
            console.log(err);
            callback(null);
        } else {
            if (count) {
                callback(count);
            } else {
                callback(null);
            }
        }
    });
};