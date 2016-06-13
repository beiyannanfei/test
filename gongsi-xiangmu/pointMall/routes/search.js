/**
 * Created by nice on 2014/8/19.
 */

var URL = require('url');
var moment = require('moment');
var tools = require('../tools');
var _ = require('underscore');
var models = require('../models/index');
var Users = models.UsersPoint;
var IntegralLog = models.IntegralLog;
var Personal = models.Personal;

var utils = require('./utils');

var interface = require('../interface/index');


/**
 * 查询积分
 * @param req
 * @param res
 */
exports.queryIndex = function (req, res) {
    var params = URL.parse(req.url, true);
    var openId = req.query.openId || '';
    var wxToken = req.query.wxToken || '';
    var page = req.query.page || 1;
    var pagecount = req.query.pagecount || 10;
    var skipcount = req.query.skipcount || 0;
    var skip = (page == 1) ? skipcount : ((page - 1) * pagecount);
    var sort = params.query.sort || 'integral';
    if (wxToken) {
        if (openId) {
            var _id = tools.joinId(wxToken, openId);
            Users.findById(_id, {nickName: 1, headImg: 1, integral: 1, openId: 1}, function (err, info) {
                if (err) {
                    console.log(err);
                    tools.resToClient(res, params, {status: 'failed', msg: 'mongodb 异常', data: []});
                } else {
                    if (info) {
                        Personal.findOne({wxToken: wxToken}, function (err, personal) {
                            if (err) {
                                console.log(err)
                            }
                            var unit = '积分';
                            if(personal){
                                unit  =personal.unit;
                            }
                            tools.resToClient(res, params, {status: 'success', data: info,unit:unit});
                        });
                    } else {
                        tools.resToClient(res, params, {status: 'failed', data: []});
                    }
                }
            });
        } else {
            var sortObj = {};
            if (sort === 'integral') {
                sortObj = {'integral': -1};
            } else {
                sortObj = {'dateTime': -1};
            }
            var condition = {};
            Users.find(condition)
                .where('wxToken', wxToken)
                .select({'__v': 0})
                .limit(pagecount)
                .skip(skip)
                .sort(sortObj)
                .exec(function (err, doc) {
                    if (err) {
                        console.log(err);
                        tools.resToClient(res, params, {status: 'failed', msg: 'mongodb 异常', data: []});
                    } else {
                        if (doc) {
                            tools.resToClient(res, params, {status: 'success', data: doc});
                        } else {
                            tools.resToClient(res, params, {status: 'failed', data: []});
                        }
                    }
                });
        }
    } else {
        tools.resToClient(res, params, {status: 'failed', msg: '缺少参数或者参数值为空', data: []});
    }
};

/**
 * 查询积分日志接口
 * @param req
 * @param res
 */
exports.integralLogIndex = function (req, res) {
    var params = URL.parse(req.url, true);
    var openId = req.query.openId || '';
    var wxToken = req.session.token;
    var page = req.query.page || 1;
    var pagecount = req.query.pagecount || 10;
    var skipcount = req.query.skipcount || 0;
    var skip = (page == 1) ? skipcount : ((page - 1) * pagecount);
    var sort = params.query.sort || 'dateTime';
    var source = params.query.source || '';
    if (wxToken && openId) {
        queryIntegralLog(openId, wxToken, skip, pagecount, sort,source, function (data) {
            data =utils.doc2Object(data);
            _.each(data, function (d) {
                var dataTime = d.dateTime;
                d.time = (dataTime.getMonth() + 1) + '-' + dataTime.getDate();
                if (d.description === 'undefined') {
                    d.description = '';
                }
                d.timeStr = moment(dataTime).format('YYYY/MM/DD HH:mm:ss')
            });
            tools.resToClient(res, params, {status: 'success', data: data});
        });
    } else {
        tools.resToClient(res, params, {status: 'failed', msg: 'params is null', data: []});
    }
};

/**
 * 查询积分日志
 * @type {queryIntegralLog}
 */
var queryIntegralLog = exports.queryIntegralLog = function (openId, wxToken, skip, pagecount, sort,source, callback) {
    var condition = {};
    var sortObj = {};
    if (sort === 'integral') {
        sortObj = {'integral': -1};
    } else {
        sortObj = {'dateTime': -1};
    }
    if (openId) {
        condition.openId = openId;
    }
    if (source && source!='undefined') {
        condition.source = source;
    }
    IntegralLog.find(condition)
        .where('wxToken', wxToken)
        .select({'openId': 1,'integral': 1,'wxToken': 1,'description': 1,'dateTime': 1})
        .limit(pagecount)
        .skip(skip)
        .sort(sortObj)
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
                callback([]);
            } else {
                if (doc) {
                    callback(doc);
                } else {
                    callback([]);
                }
            }
        });
};

/**
 * nickName 模糊查询
 * @param req
 * @param res
 */
exports.queryByName = function (req, res) {
    var params = URL.parse(req.url, true);
    var nickName = req.query.nickName || '';
    var wxToken = req.query.wxToken || '';
    if (nickName && wxToken) {
        var condition = {};
        var reg = new RegExp(nickName);
        condition.nickName = reg;
        condition.wxToken = wxToken;
        Users.find(condition, {__v: 0}, function (err, doc) {
            if (err) {
                console.log(err);
                tools.resToClient(res, params, {status: 'failed', msg: 'mongodb 异常', data: []});
            } else {
                if (doc) {
                    tools.resToClient(res, params, {status: 'success', data: doc});
                } else {
                    tools.resToClient(res, params, {status: 'failed', data: []});
                }
            }
        });
    } else {
        tools.resToClient(res, params, {status: 'failed', msg: '缺少参数或者参数值为空', data: []});
    }
};


exports.keyword = function(req, res){
    var keyword = req.query.keyword || '';
    var wxToken = req.query.wxToken || '';
    var page = req.query.page || 0;
    var pagecount = req.query.pagecount || 10;
    if(keyword && wxToken){
        interface.searchKeyword(keyword, page, pagecount, wxToken, function(data){
            if(data && data.responsedata && data.responsedata.hit){
                res.send({status: 'success', data: data.responsedata.hit});
            }else{
                res.send({status: 'failed', data: []});
            }
        });
    }else{
        res.send({status: 'failed', msg:'wxToken or keyword is null'});
    }
}

