/**
 * Created by Administrator on 2014/8/13.
 */
var _ = require('underscore');
var ut = require('./utils');
var mFile = require('./file.js');
var mLotteryEvent = require('./lotteryEvent');

var async = require('async');
var moment = require('moment');
var config = require('../config');
var tkConfig = require('../tokenConfig.js');

var dbUtils = require('../mongoSkin/mongoUtils.js')
var activitiesCollection = new dbUtils('activities')
var goodsCollection = new dbUtils('goods')


exports.gotoActivity = function(req, res){
    if (!req.token){
        return res.send(500, '商家没有权限')
    }
    var token = req.token
    var way = req.param('way')
    if (!way || (way != '1' && way != '2')){
        return res.send('没有此类型抽奖');
    }
    way = parseInt(way, 10);

    activitiesCollection.find({token: token, deleted: {$ne: true}, way: way}, {}, {sort: {dateTime: -1}}, function(err, docs){
        if (err){
            return res.send(500, 'mongodb error');
        }

        var prizeIds = [];
        _.each(docs, function(doc){
            if (doc.prizes){
                prizeIds.push(_.pluck(doc.prizes, 'id'))
            }
        });

        prizeIds = _.flatten(prizeIds);

        goodsCollection.find({_id: {$in: prizeIds}}, {name: 1, pic: 1}, function(err, prizes){
            if (err){
                console.log(err)
                return res.send(500, 'mongodb error');
            }

            var prizeMap = {}
            _.each(prizes, function(o){
                prizeMap[o._id.toString()] = o;
            })

            _.each(docs, function(o){
                if (o.startTime){
                    o.startTime = moment(o.startTime).format('YYYY/MM/DD HH:mm:ss')
                }
                if (o.endTime){
                    o.endTime = moment(o.endTime).format('YYYY/MM/DD HH:mm:ss')
                }
                o.prize = []
                _.each(o.prizes, function(prize){
                    o.prize.push(prizeMap[prize.id])
                })
                o.prize = JSON.stringify(o.prize)
                o.link = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=" + config.token + "&redirect_uri=" + encodeURIComponent(tkConfig.getDomain(token) + '/pointMall/lottery/activity/' + o._id.toString() + '?wx_token=' + token);
            })

            var boundUrl = tkConfig.getAuthDomain(token) + "/oauth?wx_token=" + token + "&token=" + config.token + "&redirect_uri=" + encodeURIComponent(tkConfig.getDomain(token) + '/pointMall/lottery/rule?wx_token=' + token);
            res.render('activity-list', {activities: docs, way: way, boundUrl: boundUrl,unit:req.integralUnit})
        })
    })
}

exports.gotoAddActivity = function(req, res){
    var way = req.param('way')
    if (!way || (way != '1' && way != '2')){
        return res.send('不支持创建此类型抽奖');
    }
    var options = {way: way}
    if (way == '1'){
        options.isGGK = true
    } else if (way == '2'){
        options.isTURNPLATE = true
    }
    mLotteryEvent.getTagCategory(req.token, function(tags){
        options.tag = JSON.stringify(tags);
        options.unit=req.integralUnit;
        res.render('add-activity', options);
    });
}

exports.gotoUpdateActivity = function(req, res){
    var options = {way: req.activity.way, activityId: req.activity._id.toString()}
    if (options.way == 1){
        options.isGGK = true
    } else if (options.way == 2){
        options.isTURNPLATE = true
    }

    mLotteryEvent.getTagCategory(req.token, function(tags){
        options.tag = JSON.stringify(tags)
        res.render('add-activity', options);
    });
}

exports.getActivity = function(req, res){
    var activity = req.activity;

    var goodsIds = _.pluck(activity.prizes, 'id');

    goodsCollection.find({_id: {$in: goodsIds}}, {name: 1, pic: 1, type: 1}, function(err, prizes){
        if (err){
            console.log(err)
            return res.send(500, 'mongodb error');
        }

        var prizeMap = {}
        _.each(prizes, function(o){
            prizeMap[o._id.toString()] = o;
        })

        _.each(activity.prizes, function(o){
            o.name = prizeMap[o.id].name
            o.pic = prizeMap[o.id].pic
            o.type = prizeMap[o.id].type
        })

        if (activity.startTime){
            activity.startTime = moment(activity.startTime).format('YYYY/MM/DD HH:mm:ss')
        }
        if (activity.endTime){
            activity.endTime = moment(activity.endTime).format('YYYY/MM/DD HH:mm:ss')
        }
        res.send(activity)
    })
}

function checkActivityParam(req, cb){
    var activity    = req.activity
    var token       = req.token
    var name        = req.param('name')
    var score       = req.param('score')
    var info        = req.param('info')
    var startTime   = req.param('startTime')
    var endTime     = req.param('endTime')
    var cover       = req.cover || req.param('cover')
    var turnplate   = req.turnplate || req.param('turnplate')
    var limit       = req.param('limit')
    var inBound     = parseInt(req.param('inBound'), 10)
    var followLimit     = parseInt(req.param('followLimit'), 10)
    var category    = req.param('category')
    var bgImg       = req.param('bgImg')

    try {
        category = JSON.parse(category)
    } catch(e){
        category = []
    }

    var prizes = req.param('prizes')
    if (!prizes){
        return cb('没有奖品');
    } else {
        try{
            prizes = JSON.parse(prizes)
            if (prizes.length == 0){
                return cb('没有选择奖品')
            }
            if (activity){
                var prizeMap = {}
                _.each(activity.prizes, function(o){
                    prizeMap[o.id] = o;
                })
                _.each(prizes, function(o) {
                    if (o.day && o.day > 1){
                        if (prizeMap[o.id] && prizeMap[o.id].day && prizeMap[o.id].day > 1 && o.day == prizeMap[o.id].day){
                            o.updateTime = prizeMap[o.id].updateTime?prizeMap[o.id].updateTime:new Date();
                        } else {
                            if (new Date().getTime() > new Date(startTime).getTime()){
                                o.updateTime = new Date();
                            } else {
                                o.updateTime = new Date(startTime);
                            }
                        }
                    }
                })
            } else {
                _.each(prizes, function(o) {
                    if (o.day && o.day > 1){
                        o.updateTime = new Date();
                    }
                })
            }
        } catch(e){
            return cb('奖品格式不正确');
        }
    }

    var way = req.param('way')
    if (!way || (way != '1' && way != '2')){
        return cb('way参数错误');
    } else{
        way = parseInt(way, 10);
    }

    var lotteryC = req.param('lotteryC')
    if (!lotteryC || (lotteryC != 'percent' && lotteryC != 'count')){
        return cb('lotteryC参数错误');
    }

    if (!name){
        return cb('参数错误');
    }

    if (!info){
        return cb('info参数错误');
    }
    if (!startTime){
        return cb('info参数错误');
    } else {
        try{
            startTime = new Date(startTime)
        } catch (e){
            return cb('startTime参数错误');
        }
    }

    if (!endTime){
        return cb('info参数错误');
    } else {
        try{
            endTime = new Date(endTime)
        } catch (e){
            return cb('endTime参数错误');
        }
    }

    if (!score){
        score = 0;
    } else{
        score = parseInt(score, 10);
        if (!score || _.isNaN(score)){
            score = 0;
        }
    }

    if (limit){
        limit = parseInt(limit, 10);
        if (!limit || _.isNaN(limit)){
            limit = null;
        }
    }

    var doc = {
        token: token,
        score: score,
        name: name,
        info: info,
        prizes: prizes,
        lotteryC: lotteryC,
        startTime: startTime,
        endTime: endTime,
        way: way,
        category: category,
        inBound: inBound,
        followLimit: followLimit,
        bgImg: bgImg ? bgImg : null
    }

    if (limit){
        doc.limit = limit;
    } else {
        doc.limit = '';
    }

    if (cover){
        doc.cover = cover;
    } else if (activity){
        doc.cover = '';
    }

    if (turnplate){
        doc.turnplate = turnplate;
    }
    cb(null, doc);
}

exports.addActivity = function(req, res){
    checkActivityParam(req, function(err, doc){
        if (err){
            return res.send({code: 400, msg: err});
        }

        doc.dateTime = new Date()
        activitiesCollection.save(doc, function(err, doc){
            if (err){
                if (err.code == 11000){
                    return res.send({code: 500, msg: '活动名字已经存在'});
                } else{
                    return res.send({code: 500, msg: err});
                }
            }
            return res.send({code: 200});
        })
    })
}

exports.getGoods = function(req, res){
    var activity = req.activity;
    var goodsIds = _.pluck(activity.prizes, 'id');
    goodsCollection.find({_id: {$in: goodsIds}}, {pic: 1, name: 1}, function(err, docs){
        if (err){
            res.send(500, err);
        } else{
            var map = {}
            _.each(activity.prizes, function(o){
                map[o.id] = o.rating
            })
            docs.sort(function(a, b){
                return (map[a._id.toString()] < map[b._id.toString()])?-1:1
            })
            res.send(docs);
        }
    });
}

exports.activityEnable = function(req, res){
    var activity = req.activity
    var enable = req.param('enable');
    if (enable != '0' && enable != '1'){
        return res.send(400, '参数错误');
    }
    enable = parseInt(enable, 10);
    activitiesCollection.updateById(activity._id, {$set: {active: enable}}, function(err){
        if (err){
            return res.send(500, err);
        } else{
            return res.send(200);
        }
    })
}

function checkTimeFormat(time){
    var isError = false;
    if (!/^[0-9]{2}:[0-9]{2}$/.test(time)){
        isError = true;
    } else{
        var time = time.split(':')
        var hour = parseInt(time[0], 10)
        var minute = parseInt(time[1], 10)
        if (hour > 23 || hour < 0){
            isError = true;
        }
        if (minute > 59 || minute < 0){
            isError = true;
        }
    }
    return isError;
}

exports.delActivity = function(req, res){
    var id = req.param('id')
    activitiesCollection.updateById(id, {$set: {deleted: true}}, function(err){
        if (err){
            res.send(500, err)
        } else{
            res.send(200)
        }
    })
}

exports.activityUpdate = function(req, res){
    var activity = req.activity;

    checkActivityParam(req, function(err, doc) {
        if (err) {
            return res.send({code: 400, msg: err});
        }

        if (!doc.turnplate){
            var newIds = _.pluck(doc.prizes, 'id')
            var oldIds = _.pluck(activity.prizes, 'id')
            if (newIds.length != oldIds.length || _.difference(newIds, oldIds).length > 0){
                doc.turnplate = '';
            }
        }

        activitiesCollection.updateById(activity._id, {$set: doc}, function(err){
            if (err){
                if (err.lastErrorObject && err.lastErrorObject.code == 11001){
                    return res.send({code: 500, msg: '活动名字已经存在'});
                } else{
                    return res.send({code: 500, msg: err});
                }
               
            }
            
            return res.send({code: 200});
        })
    });
}

exports.midActivityLoader = function(req, res, next){
    var id = req.param('id');
    if(!id){
        return res.send(404);
    }
    activitiesCollection.findById(id, function(err, doc){
        if (err){
            console.log('mongodb err:' + err)
            return res.send(500, 'mongodb error:' + err);
        } else if(!doc) {
            console.log('not find')
            return res.send(404, 'activity is not exist');
        }
        req.activity = doc;
        next()
    })
}

exports.checkFile = function(req, res, next){
    if (!req.files){
        return next()
    }

    var checkCover = function(){
        var cover = req.files.cover;
        if (!cover){
            return checkTurnplate();
        }
        if(cover.size > 100 * 1024){
            return res.send({code: 400, msg: '活动封面超过100K'});
        }

        mFile.uploadFile(cover, function(err, url){
            if (err){
                return res.send({code: 500, msg: err});
            } else {
                req.cover = url
                return checkTurnplate();
            }
        });
    }

    var checkTurnplate = function(){
        var turnplate = req.files.turnplate;
        if (!turnplate){
            return next();
        }

        if(turnplate.size > 200 * 1024){
            return res.send({code: 400, msg: '转盘图片超过200K'});
        }

        mFile.uploadFile(turnplate, function(err, url){
            if (err){
                return res.send({code: 500, msg: err});
            } else {
                req.turnplate = url
                next()
            }
        });
    }

    checkCover()
}

exports.thirdActivityList = function(req, res){
    var condition = {
        token: req.token,
        endTime: {
            $gt: new Date()
        }
    }

    activitiesCollection.find(condition, {name: 1, startTime: 1, endTime: 1, way: 1}, function(err, docs){
        if (err){
            return res.send(500, err)
        } else {
            _.each(docs, function(o){
                o.startTime = o.startTime.getTime()
                o.endTime = o.endTime.getTime()
                o.url = tkConfig.getAuthDomain(req.token) + "/oauth?wx_token=" + req.token + "&token=7fda67277f&redirect_uri=" + encodeURIComponent(tkConfig.getDomain(req.token) + '/pointMall/lottery/activity/' + o._id + '?wx_token=' + req.token);
            })
            return res.send(docs)
        }
    })
}