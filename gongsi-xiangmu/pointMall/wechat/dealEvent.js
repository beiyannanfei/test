/**
 * Created by nice on 2014/9/15.
 */


var config = require('../config.js');

var interface = require('../interface');

var integralUitl = require('../routes/integral');
var userGroup = require('../routes/userGroup');

var models = require('../models/index');
var Users = models.UsersPoint;
var IntegralLog = models.IntegralLog;
var Personal = models.Personal;
var tools = require('../tools');

var failedUsersRedisClient = tools.redisClient();
failedUsersRedisClient.select(12, function () {
    console.log('首次关注获取用户信息失败的用户 切换到database 12');
});

var dealQrcode = require('./dealQrcode');

var config = require('../config.js');
var recommend = config.scan.recommend;

exports.index = function (data, wxToken) {
    var eventKey = '',
        ticket = '',
        latitude = '',
        longitude = '',
        precision = '';
    if (data.EventKey) {
        eventKey = data.EventKey[0];
    }
    if (data.Ticket) {
        ticket = data.Ticket[0];
    }
    if (data.Latitude) {
        latitude = data.Latitude[0];
    }
    if (data.Longitude) {
        longitude = data.Longitude[0];
    }
    if (data.Precision) {
        precision = data.Precision[0];
    }
    var msgEvent = {
        "toUserName": data.ToUserName[0],
        "fromUserName": data.FromUserName[0],
        "createTime": data.CreateTime[0],
        "msgType": data.MsgType[0],
        "event": data.Event[0],
        "eventKey": eventKey,
        "ticket": ticket,
        "latitude": latitude,
        "longitude": longitude,
        "precision": precision
    };
    console.log('================微信事件类型=====================', msgEvent);
    if (msgEvent.event && msgEvent.event === 'subscribe') {
        watch(msgEvent, wxToken, function (chunk, data) {
            if (data) {
                if (chunk && chunk === 'add') {
                    //用户未关注时，进行关注后的事件推送   事件KEY值，qrscene_为前缀，后面为二维码的参数值
                    if (msgEvent.eventKey && msgEvent.eventKey != '') {
                        console.log('===============用户扫码关注，推荐好友==================');
                        var _str = msgEvent.eventKey + '';
                        if (_str.indexOf('qrscene_') != -1) {
                            msgEvent.eventKey = msgEvent.eventKey.split('_')[1];
                        }
                        scan(msgEvent, wxToken);
                    } else {
                        console.log('===============用户扫码关注，eventKey is null ==================');
                    }
                } else {
                    console.log('================== 用户已经是关注用户 ======================');
                    if (msgEvent.eventKey && msgEvent.eventKey != '') {
                        var _str = msgEvent.eventKey + '';
                        if (_str.indexOf('qrscene_') != -1) {
                            msgEvent.eventKey = msgEvent.eventKey.split('_')[1];
                        }
                        var sceneId = msgEvent.eventKey;
                        var redisKey = wxToken + ":" + sceneId;
                        dealQrcode.getQrcodeInfoBySceneId(redisKey, function (reply) {
                            if (reply) {
                                console.log('==============用户已经是关注用户，不能扫码推荐贡献积分===============');
                                var message = '您已关注过此公共帐号,不能扫码推荐贡献积分!';
                                if (wxToken == 'b48c7259d874' || wxToken == 'tvmty') {
                                    message = '您之前已关注过此公众账号，无法多次通过扫码关注获得V币了哦！您可以推荐新朋友扫码关注此账号，获取1000V币奖励（请从“赚V币”获取二维码推荐朋友加关注）。';
                                }
                                interface.pushMessage(wxToken, msgEvent.fromUserName, message, function (data) {
//                                    console.log();
                                });
                            } else {
                                console.log('===================redis 找不到二维码信息===================', redisKey);
                            }
                        });
                    } else {
                        console.log('===============用户扫码关注，eventKey is null ==================');
                    }
                    //更新用户关注状态
                    subscribe(wxToken, msgEvent.fromUserName, msgEvent.event);
                }
            } else {
                console.log('===============用户扫码 ==================', data);
            }
        });
    } else if (msgEvent.event && msgEvent.event === 'unsubscribe') {  //
        console.log('==============微信取消关注事件==================', msgEvent.fromUserName);
        subscribe(wxToken, msgEvent.fromUserName, msgEvent.event);
    } else if (msgEvent.event && msgEvent.event === 'SCAN' && msgEvent.eventKey) {
        //二维码扫码事件
        //scan(msgEvent, wxToken);
        console.log('============== 用户扫码不是关注事件=================');
    } else {
        console.log('============== 微信事件、不是扫码推荐用户与关注事件=================');
    }

};

/**
 * 关注事件
 * @param data
 */
var watch = function (data, wxToken, callback) {
    var openId = data.fromUserName;
    var _id = tools.joinId(wxToken, openId);
    Users.findById(_id, function (err, doc) {
        if (err) {
            console.log(err);
            callback(null, null);
        } else {
            if (!doc) {
                console.log('================用户首次关注，获取用户信息入库===============', _id);
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
                            unionid: data.unionid || ''
                        };
                        integralUitl.insertUser(userObj, function (userInfo) {
                            if (userInfo && userInfo.status === 'success') {
                                if (userInfo.flag && userInfo.flag == 'add') {
                                    Personal.findOne({wxToken: wxToken}, function (err, personal) {
                                        if (err) {
                                            console.log(err)
                                        }
                                        var integral = config.integral;
                                        if (personal) {
                                            integral = personal.attention;
                                        }
                                        var description = '首次关注';
                                        var source = '';
                                        integralUitl.addIntegral(_id, openId, wxToken, integral, description, source, function (integralInfo) {
                                            //console.log('--------------- integralInfo -------------', integralInfo);
                                            if (integralInfo && integralInfo.status === 'success') {
                                                console.log('================用户首次关注，赠送积分成功===============', _id);
                                                callback('add', integralInfo.data);
                                            } else {
                                                console.log('================用户首次关注，赠送积分失败===============', _id);
                                                callback(null, null);
                                            }
                                        });
                                    });
                                } else {
                                    console.log('================关注事件，用户已入库===============', _id);
                                }
                            } else {
                                console.log('================用户首次关注，用户入库失败===============', _id);
                                callback(null, null);
                            }
                        });
                    } else {
                        console.log('================获取用户信息失败===============', _id);
                        //黑名单
                        failedUsersRedisClient.sadd(wxToken + ':FAILEDUSERS', openId, function (err) {
                            console.log(arguments);
                            if (!err) {
                                reacquireFailedUsers(wxToken);
                            }
                        });
                        callback(null, null);
                    }
                });
            } else if (doc && !doc.status) {
                console.log('================用户首次关注，mongodb有数据，没有关注状态===============', _id, doc);
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
                            unionid: data.unionid || ''
                        };
                        Users.findByIdAndUpdate(_id, {$set: {nickName: userObj.nickName, headImg: userObj.headImg, city: userObj.city, province: userObj.province, subscribe_time: userObj.subscribe_time, unionid: userObj.unionid}}, function (err, userInfo) {
                            if (err) {
                                console.log(err);
                            }
                            Personal.findOne({wxToken: wxToken}, function (err, personal) {
                                if (err) {
                                    console.log(err)
                                }
                                var integral = config.integral;
                                if (personal) {
                                    integral = personal.attention;
                                }
                                var description = '首次关注';
                                var source = '';
                                integralUitl.addIntegral(_id, openId, wxToken, integral, description, source, function (integralInfo) {
                                    //console.log('--------------- integralInfo -------------', integralInfo);
                                    if (integralInfo && integralInfo.status === 'success') {
                                        console.log('================用户首次关注，mongodb有数据，没有关注状态，赠送积分成功===============', _id);
                                        callback('add', integralInfo.data);
                                    } else {
                                        console.log('================用户首次关注，mongodb有数据，没有关注状态，赠送积分失败===============', _id);
                                        callback(null, null);
                                    }
                                });
                            });
                        });
                    } else {
                        console.log('================获取用户信息失败===============', _id);
                        //黑名单
                        failedUsersRedisClient.sadd(wxToken + ':FAILEDUSERS', openId, function (err) {
                            console.log(arguments);
                            if (!err) {
                                reacquireFailedUsers(wxToken);
                            }
                        });
                        callback(null, null);
                    }
                });
            } else {
                console.log();
                callback('update', doc);
            }
        }
    });
};

/**
 * 扫码事件
 * @param data
 */
var scan = function (data, wxToken) {
    var sceneId = data.eventKey;
    var redisKey = wxToken + ":" + sceneId;
    dealQrcode.getQrcodeInfoBySceneId(redisKey, function (reply) {
        if (reply) {
            var dealType = reply.dealType;
            switch (dealType.toLocaleLowerCase()) {
                case 'scancode':
                    scanCode(data, wxToken, reply);
                    break;
                default:
                    break;
            }
        } else {
            console.log('===================redis 找不到二维码信息===================', redisKey);
        }
    });
};

/**
 * 扫码事件 ，推荐用户
 * @param data
 * @param wxToken
 * @param reply
 */
var scanCode = function (data, wxToken, reply) {
    var openId = data.fromUserName;
    var higherId = reply.myArgs;

    var _idOpen = tools.joinId(wxToken, openId);
    var _idHig = tools.joinId(wxToken, higherId);

    if (openId === higherId) {
        console.log('==============扫码事件 自己不能扫自己==================', openId, higherId);
    } else {
        Users.findById(_idOpen, function (err, openInfo) {
            if (err) {
                console.log(err);
            } else {
                if (openInfo) {
                    if (openInfo.higherId == '') {
                        Users.findOne({openId: higherId, higherId: openId}, function (err, doc) {
                            if (err) {
                                console.log(err);
                            } else {
                                if (doc) {
                                    var nickName = doc.nickName || '好友';
                                    //用户提示信息 不能二次被推荐贡献积分
                                    var message = '您已推荐' + nickName + '，' + nickName + '不能在推荐您!';
                                    interface.pushMessage(wxToken, openId, message, function (data) {
                                        console.log(arguments);
                                    });
                                } else {
                                    //更新上线ID
                                    Users.findByIdAndUpdate(_idOpen, {$set: {higherId: higherId}}, function (err, data) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            // 推荐好友加积分
                                            Personal.findOne({wxToken: wxToken}, function (err, personal) {
                                                if (err) {
                                                    console.log(err)
                                                }
                                                var unit = '积分';
                                                var recommendNumber = 1;
                                                if (personal) {
                                                    recommend = personal.integral;
                                                    unit = personal.unit;
                                                    recommendNumber = personal.recommendNumber;
                                                } else {
                                                    recommend = config.scan.recommend;
                                                }
                                                Users.findByIdAndUpdate(_idHig, {$inc: {integral: recommend, recommendNumber: 1}}, function (err, dataInfo) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        if (dataInfo) {
                                                            var nickName = data.nickName;
                                                            var content = '你推荐一个新的好友 ' + nickName + '、获得' + recommend + '' + unit;
                                                            if (wxToken == 'b48c7259d874' || wxToken == 'tvmty') {
                                                                content = '您推荐好友' + nickName + '加关注成功，恭喜您获得' + recommend + '' + unit + '！' + unit + '可用于“V呀抽奖”和抵现，快快推荐更多新朋友关注账号来赚' + unit + '吧！';
                                                            }
                                                            interface.pushMessage(wxToken, higherId, content, function (data) {
                                                                console.log(arguments);
                                                            });
                                                            var obj = {
                                                                openId: higherId,
                                                                wxToken: wxToken,
                                                                integral: recommend,
                                                                genre: '3',
                                                                description: '推荐:' + nickName + ',获得' + unit + '奖励'
                                                            };
                                                            integralUitl.saveIntegralLog(obj);

                                                            //扫码推荐用户符合规定，入行为分析
                                                            if (dataInfo.recommendNumber >= recommendNumber) {
                                                                addBehavior(wxToken, higherId, recommendNumber, nickName);
                                                            }
                                                        }
                                                    }
                                                });
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        var message = '您之前已关注过此公众账号，无法多次通过扫码关注获得奖励哦！';
                        interface.pushMessage(wxToken, openId, message, function (data) {
                            console.log(arguments);
                        });
                    }
                } else {
                    // 没有此用户信息
                    console.log('==============扫码事件 找不到用户信息===============', _idOpen);
                }
            }
        });
    }
};

/**
 * 用户首次关注，获取用户信息失败，重试机制（redis set集合）
 * @param wxToken
 */
var reacquireFailedUsers = function (wxToken) {
    failedUsersRedisClient.smembers(wxToken + ':FAILEDUSERS', function (error, replies) {
        if (error) {
            console.log(error);
        } else {
            if (replies) {
                replies.forEach(function (reply, i) {
                    var openId = reply;
                    var _id = tools.joinId(wxToken, openId);
                    Users.findById(_id, function (err, doc) {
                        if (err) {
                            console.log(err);
                        } else {
                            if (!doc) {
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
                                            unionid: data.unionid || ''
                                        };
                                        integralUitl.insertUser(userObj, function (userInfo) {
                                            if (userInfo && userInfo.status == 'success') {
                                                if (userInfo.flag && userInfo.flag == 'add') {
                                                    Personal.findOne({wxToken: wxToken}, function (err, personal) {
                                                        if (err) {
                                                            console.log(err)
                                                        }
                                                        var integral = config.integral;
                                                        if (personal) {
                                                            integral = personal.attention;
                                                        }
                                                        var description = '首次关注';
                                                        var source = '';
                                                        integralUitl.addIntegral(_id, openId, wxToken, integral, description, source, function (integralInfo) {
                                                            if (integralInfo && integralInfo.status == 'success') {
                                                                console.log('================reacquireFailedUsers Redis 用户首次关注，赠送积分成功===============', _id);
                                                            } else {
                                                                console.log('================ reacquireFailedUsers Redis 用户首次关注，赠送积分失败===============', _id);
                                                            }
                                                        });
                                                        //删除用户
                                                        failedUsersRedisClient.srem(wxToken + ':FAILEDUSERS', openId, function (err) {
//                                                            console.log(arguments);
                                                        });
                                                    });
                                                }
                                            } else {
                                                console.log('================ reacquireFailedUsers Redis 用户首次关注，用户入库失败===============', _id);
                                            }
                                        });
                                    } else {
                                        console.log('================reacquireFailedUsers Redis 获取用户信息失败===============', _id);
                                    }
                                });
                            } else {
                                //删除用户
                                failedUsersRedisClient.srem(wxToken + ':FAILEDUSERS', openId, function (err) {
//                                    console.log(arguments);
                                });
                            }
                        }
                    });
                });
            }
        }
    });
};


var subscribe = function (wxToken, openId, status) {
    var _id = tools.joinId(wxToken, openId);
    var updateQuery = Users.findByIdAndUpdate(_id,
        {$set: {status: status }}, {upsert: false}
    );
    updateQuery.exec(function (err, doc) {
        if (err) {
            console.log(err);
        }
    });
};


var addBehavior = function (wxToken, openId, recommendNumber, nickName) {
    var activity = '扫码';
    var title = '推荐用户满' + recommendNumber + '个';
    var result = nickName;
//    userGroup.existsUser(wxToken, activity, title, result, openId, function(data){
//        //用户不在组内 往组内增加用户
//        if(data && data.status=='failed'){
//            userGroup.addBehaviorAndGroup(wxToken,openId,activity,title,result,function(data){
//            });
//        }
//    });
};