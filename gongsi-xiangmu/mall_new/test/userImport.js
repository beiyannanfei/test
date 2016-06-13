var interface = require('../interface');

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var UsersSchema = new Schema({
    //ID
    _id: {type: String, index: true},
    //微信ID
    openId: {type: String, index: true},
    //上级微信ID
    higherId: {type: String, default: '', index: true},
    //媒体桥 微信公共 指定的 token
    wxToken: {type: String, index: true},
    //积分 number 默认 0
    integral: {type: Number, default: 0},
    //昵称
    nickName: {type: String},
    //头像
    headImg: {type: String},
    //城市
    city: {type: String},
    //省份
    province: {type: String},
    //性别 0 代表女  1 代表男
    sex: {type: String},
    //时间
    subscribe_time: {type: String},
    //入库时间
    dateTime: {type: Date, default: Date.now}
});

mongoose.model('Users', UsersSchema);


var moment = require('moment');

var FriendsSchema = new Schema({
    _id: {type: String, index: true},
    mpUser: {type: String, index: true},
    openId: {type: String, index: true},
    nickName: {type: String},
    headImg: {type: String, default: ''},
    country: {type: String, default: ''},
    province: {type: String, default: ''},
    city: {type: String, default: ''},
    sex: {type: String, default: ''},
    subscribe_time: {type: String, default: ''},
    subType: {type: String, default: ''},
    subscribe: {type: String, default: ''},

    higherId: {type: String, default: ''},
    integral: {type: Number, default: 0},
    cards: {type: Number, default: 0},

    event: {type: String, default: 'subscribe'},
    code: {type: String, default: ''},
    addInfo: [
        {name: String, tel: String, add: String, originType: String, businessID: String,
            dateTime: {type: Date, default: Date.now},
            createTime: {type: Number, default: new moment().valueOf()} }
    ],
    createTime: {type: Number, default: new moment().valueOf()}
});

mongoose.model('Friends', FriendsSchema);


var opts = {
    server: { poolSize: 20 },
    mongos: true
};
var str = 'mongodb://integral:integral@10.20.30.59:37017/pointMall,mongodb://integral:integral@10.20.30.60:37017/pointMall';
var db = mongoose.createConnection(str, opts, function (error) {
    if (error) {
        console.error('connect to MongoDB %s error: ', error);
        process.exit(1);
    }
});


//var db = mongoose.createConnection('10.10.42.25','pointMall',27017, {server: { poolSize: 100 }, user: 'integral', pass: 'integral'}, function (error) {
//    if (error) {
//        console.error('connect to MongoDB %s error: ', error);
//        process.exit(1);
//    }
//});


//var optsc5 = {
//    server: { poolSize: 20 },
//    mongos: true
//};
//var strc5 = 'mongodb://cctv5:cctv5@10.20.20.169:27017/cctv5,mongodb://cctv5:cctv5@10.20.20.171:27017/cctv5,mongodb://cctv5:cctv5@10.20.20.138:27017/cctv5';
//var c5db = mongoose.createConnection(strc5, optsc5, function (error) {
//    if (error) {
//        console.error('connect to MongoDB %s error: ', error);
//        process.exit(1);
//    }
//});

var c5db = mongoose.createConnection('10.20.20.169', 'cctv5', 27017, {server: { poolSize: 20 }, user: 'cctv5', pass: 'cctv5'}, function (error) {
    if (error) {
        console.error('connect to MongoDB %s error: ', error);
        process.exit(1);
    }
});


var friends = c5db.model('Friends');

var users = db.model('Users');


var _ = require('underscore');
var async = require('async');

var page = 0;
var pageSize = 1000;

process.maxTickDepth = Number.MAX_VALUE;

var wxToken = '3a59f7a4b8b28dca';

var findC5User = function () {
    friends.find({}, {}, {limit: pageSize, skip: page * pageSize}, function (err, docs) {
        async.eachSeries(docs, function (user, done) {
            var _id = wxToken + '_' + user.openId;
            var doc = {
                _id: _id,
                openId: user.openId,
                higherId: user.higherId,
                nickName: user.nickName,
                headImg: user.headImg,
                integral: user.integral,
                sex: user.sex,
                city: user.city,
                province: user.province,
                subscribe_time: user.subscribe_time,
                dateTime: new Date(user.createTime),
                wxToken: wxToken
            };
            users.findById(_id, function (err, info) {
                if (err) {
                    console.log(err);
                }
                if (info) {
                    users.findByIdAndUpdate(_id, {$set: {higherId: doc.higherId, nickName: doc.nickName,
                            headImg: doc.headImg, integral: doc.integral, wxToken: doc.wxToken}},
                        function (err, info) {
                            if (err) {
                                done(err);
                                console.log(err);
                            }
                        });
                } else {
                    var userObj = new users(doc);
                    userObj.save(function (err) {
                        if (err) {
                            done(err);
                        } else {
                            done(null);
                        }
                    });
                }
            });
        }, function (err) {
            if (err) {
                console.log(err);
            } else {
                if (docs.length < 1000) {
                    console.log('update success')
                    return;
                }
                page += 1;
                findC5User();
            }
        });
    })
}


var updateUser = function () {
    users.find({wxToken:'3a59f7a4b8b28dca'}, {}, {limit: pageSize, skip: page * pageSize}, function (err, docs) {
        async.eachSeries(docs, function (user, done) {
            var _id = user._id;
            var openid = user.openId;
            var wxToken = user.wxToken;
//            console.log('--------------- _id ------------------------',_id);
            interface.getUserInfo(openid, wxToken, function (data) {
                if (data) {
                    var nickName = data.data.data.username || '';
                    var headImg  = data.data.data.weixin_avatar_url || '';
                    if (headImg != '' && headImg != 'undefined' && nickName != '' && nickName != 'undefined') {
                        headImg = headImg+'';
                        if(headImg.indexOf('user_info/default.png')===-1){
                            var updateObj = {
                                headImg: headImg
                            };
                            if(nickName.indexOf('Gest')!=-1){
                                updateObj.nickName=nickName;
                            }
                            users.findByIdAndUpdate(_id, {$set: updateObj},
                                function (err, info) {
                                    if (err) {
                                        console.log(err);
                                        done(err);
                                    }
                                });
                        }
                    }
                }
                done(null);
            });
        }, function (err) {
            if (err) {
                console.log(err);
            } else {
                //console.log('--------------------- docs ----------------------',docs.length);
                if (docs.length < 1000) {
                    console.log('update Users success')
                    return;
                }
                //console.log('--------------------- page ----------------------',page);
                page += 1;
                updateUser();
            }
        });
    });
}


var doc2Object = function (docs) {
    if (_.isArray(docs)) {
        var results = [];
        _.each(docs, function (doc) {
            results.push(doc.toObject());
        })
        return results;
    } else {
        return docs.toObject()
    }
}


updateUser();