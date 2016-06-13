/**
 * Created by nice on 2014/9/18.
 */

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var LogsSchema = new Schema({
//    log: {
//        wx_token: String,
//        nickName: String,
//        openid: String,
//        headImg: String,
//        type: String,
//        ts: String
//    },
    type: {type: String},
    log: {type: Object},
    time: {type: Date, default: Date.now}
});

mongoose.model('wtopic', LogsSchema);


var accessSchema = new Schema({
    host: {type: String}
});
mongoose.model('access', accessSchema);


var moment = require('moment');

var BehaviorSchema = new Schema({
    //微信Id
    openId: {type: String},
    //昵称
    nickName: {type: String},
    //头像
    headImg: {type: String},
    //积分
    integral: {type: Number},
    //媒体桥 微信公共 指定的 token
    wxToken: {type: String},
    //用户行为
    behavior: {type: String},
    //描述信息
    description: {type: String},
    //地区
    area: {type: String},
    //用户信息关联
    user: {type: String, ref: 'Users'},
    //毫秒时间
    time: {type: Number},
    //时间
    dateTime: {type: Date, default: Date.now}
});

mongoose.model('Behavior', BehaviorSchema);

//var db = mongoose.createConnection('10.10.42.25', 'pointMall', 27017, {server: { poolSize: 100 }, user: 'integral', pass: 'integral'}, function (error) {
//    if (error) {
//        console.error('connect to MongoDB %s error: ', error);
//        process.exit(1);
//    }
//});

//var logsdb = mongoose.createConnection('10.20.20.137', 'test', 27017, {server: { poolSize: 20 }, user: 'test', pass: 'test1'}, function (error) {
//    if (error) {
//        console.error('connect to MongoDB %s error: ', error);
//        process.exit(1);
//    }
//});


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

var logsdb = mongoose.createConnection('10.20.30.59', 'wtopic', 27017, {server: { poolSize: 20 }, user: 'test', pass: 'test1'}, function (error) {
    if (error) {
        console.error('connect to MongoDB %s error: ', error);
        process.exit(1);
    }
});


var wtopic = logsdb.model('wtopic');

var Behavior = db.model('Behavior');


var _ = require('underscore');
var async = require('async');

var page = 0;
var pageSize = 1000;

process.maxTickDepth = Number.MAX_VALUE;

var wxToken = '3a59f7a4b8b28dca';


var findC5User = function () {
    wtopic.find({}, {}, {limit: pageSize, skip: page * pageSize}, function (err, docs) {
        async.eachSeries(docs, function (user, done) {
            try {
//                var body = JSON.parse(user.log);
                var body = user.log;
                if(body.openid){
                    var doc = {
                        openId: body.openid,
                        wxToken: body.wx_token,
                        behavior: body.type,
                        nickName: body.nickName,
                        headImg: body.headImg,
                        time: Number(body.ts)
                    };
                    //console.log('===============================', doc);
                    var userObj = new Behavior(doc);
                    userObj.save(function (err) {
                        if (err) {
                            done(err);
                        } else {
                            done(null);
                        }
                    });
                }else{
                    done(null);
                }
            } catch (e) {
                done(null);
            }
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


//var saveTest = function () {
//    var obj = {
//        log: '------------------------------------ log -----------------------------'
//    };
//    var w = new wtopic(obj);
//    w.save(function (err, doc) {
//        if (err) {
//            console.log(err);
//        }
//        console.log('----------------doc------------------', doc);
//    });
//}


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

findC5User();

//saveTest();