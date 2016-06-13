/**
 * Created by zwb on 2015/2/28.
 */



var moment = require('moment');

var _ = require('underscore');
var async = require('async');

var utils = require('../../routes/utils');

var models = require('../../models');
var Users = models.Users;
var IntegralLog = models.IntegralLog;


var tools = require('../../tools');

var interface = require('../../interface');

process.maxTickDepth = Number.MAX_VALUE;


var redisClient = tools.redisClient();
redisClient.select(13, function () {
    console.log('撤消积分redis 切换到database 13');
});


function query(file,startTime,lastTime,wxToken) {
//    var file = "2015-02-18.txt";
//    var startTime = '2015/02/18 00:00:00';
//    var lastTime = '2015/02/19 00:00:00';
//    var wxToken = 'd8655228ec57a752';
    //var sql = 'db.integrallogs.aggregate({$match:{"wxToken" : "d8655228ec57a752","description" : "签到",timeStr:{$gt:"2015/02/18 00:00:00",$lt:"2015/02/19 00:00:00"}}},{$group:{_id:"$openId",count:{$sum:1}}},{$sort:{count:-1}},{$limit:100})';

    var matchCondition = {"wxToken": wxToken, "description": "签到", timeStr: {$gt: startTime, $lt: lastTime}};
    var groupCondition = {_id: "$openId", count: {$sum: 1}};

    console.log(matchCondition,groupCondition);

    IntegralLog.aggregate({$match: matchCondition}, {$group: groupCondition}, {$sort: {count: -1}}, function (err, docs) {
        if (err) {
            console.log(err);
        }
        if (docs) {
            var len = 0;
            _.each(docs, function (doc) {
                if (doc.count > 1) {
                    var _id = tools.joinId(wxToken, doc._id);
                    Users.findById(_id, function (err, user) {
                        if (err) {
                            console.log(err);
                        }
                        var nickName = '';
                        var headImg = '';
                        if (user) {
                            nickName = user.nickName;
                            headImg = user.headImg;
                        }
                        doc.nickName = nickName;
                        doc.headImg = headImg;
                        doc.integral = (doc.count - 1) * 1000;
                        writeFile(file, JSON.stringify(doc) + '\r\n');
                    });
                    len++;
                }
            });
            console.log('-------------length---------------',docs.length,len);
        } else {
            console.log('-----------------null-------------');
        }
    });
}


var fs = require('fs');
//var iconv = require('iconv-lite');


function writeFile(file, str) {
    //var arr = iconv.encode(str, 'utf-8');
    fs.appendFile(file, str, function (err) {
        if (err){
            console.log("fail " + err);
        }
    });
}

function readFile(file) {
    fs.readFile(file, function (err, data) {
        if (err)
            console.log("读取文件fail " + err);
        else {
            console.log(data);
            var str = iconv.decode(data, 'gbk');
            console.log(str);
        }
    });
}


//query();

function getIds(wxToken,startTime, lastTime, callback) {
    var matchCondition = {"wxToken": wxToken, "description": "签到", timeStr: {$gt: startTime, $lt: lastTime}};
    var groupCondition = {_id: "$openId", count: {$sum: 1}};
    IntegralLog.aggregate({$match: matchCondition}, {$group: groupCondition}, {$sort: {count: -1}}, function (err, docs) {
        if (err) {
            console.log(err);
        }
        if (docs) {
            callback(docs);
        } else {
            console.log('-----------------null-------------');
            callback([]);
        }
    });
}


function reduction(time,wxToken,startTime, lastTime,type,message) {
//    var startTime = '2015/02/18 00:00:00';
//    var lastTime = '2015/02/19 00:00:00';
//    var wxToken = 'd8655228ec57a752';

    getIds(wxToken,startTime, lastTime, function (docs) {
        if (docs) {
            _.each(docs, function (doc) {
                if (doc.count > 1) {
                    var integral = (doc.count - 1) * 1000;
                    execution(time,wxToken, integral, doc,type,message);
                }
            });
        }
    });
}

function execution(time,wxToken, integral, data,type,message) {
    var timeStr = new moment().valueOf().toString();
    timeStr = moment(parseInt(timeStr, 10)).format('YYYY/MM/DD HH:mm:ss');

    var openId = data._id;
    var _id = tools.joinId(wxToken, data._id);

    var redisKey = 'execution:integral:'+time+':'+_id;

    redisClient.exists(redisKey, function (err, replies) {
        if (err) {
            console.log(err);
        }
        if (!replies) {
            Users.findById(_id, {openId: 1, integral: 1}, function (err, doc) {
                if (err) {
                    console.log(err);
                }
                if (doc) {
                    var totalPoints = doc.integral;
                    var description = '';
                    if (totalPoints - integral > 0) {
                        description = '系统撤消积分';
                        Users.findByIdAndUpdate(_id, {$inc: {integral: -integral}}, function (err, user) {
                            if (err) {
                                console.log(err);
                            }
                            if (user) {

                                if(type=='news'){
                                    var articles = message;
                                    interface.pushMessageNews(wxToken, openId, articles, function (err,reqponse) {
//                                        console.log('组用户发送图文(pushMessageNews)返回信息', reqponse);
                                        if(err){
                                            console.log(err);
                                        }
                                        writeFile(time+'pushMessage-'+wxToken+'.txt', reqponse + '\r\n');
                                    });
                                }else{
                                    interface.pushMessage(wxToken, openId, message, function (err, reqponse) {
                                        if(err){
                                            console.log(err);
                                        }
                                        writeFile(time+'pushMessage-'+wxToken+'.txt', reqponse + '\r\n');
//                                    console.log('组用户发送文本(pushMessage)返回信息', reqponse);
                                    });
                                }



                                var obj = {
                                    openId: openId,
                                    wxToken: wxToken,
                                    integral: -integral,
                                    description: description,
                                    timeStr: timeStr
                                };
                                saveIntegralLog(obj);

                                redisClient.hmset(redisKey, obj, function (error, reply) {
                                    if (error) {
                                        console.log(error);
                                    }
                                    if (reply) {
                                        redisClient.expire(redisKey, 60 * 60 * 24);
                                    }
                                });

                            } else {
                                console.log('更新用户积分失败', obj, _id);
                            }
                        });
                    } else {
                        Users.findByIdAndUpdate(_id, {$set: {integral: 0}}, function (err, user) {
                            if (err) {
                                console.log(err);
                            }
                            description = '系统撤消积分,积分不够还原初始值0';
                            if (user) {

                                if(type=='news'){
                                    var articles = message;
                                    interface.pushMessageNews(wxToken, openId, articles, function (err,reqponse) {
//                                        console.log('组用户发送图文(pushMessageNews)返回信息', reqponse);
                                        if(err){
                                            console.log(err);
                                        }
                                        writeFile(time+'pushMessageNews-'+wxToken+'.txt', reqponse + '\r\n');
                                    });
                                }else{
                                    interface.pushMessage(wxToken, openId, message, function (err, reqponse) {
                                        if(err){
                                            console.log(err);
                                        }
                                        writeFile(time+'pushMessage-'+wxToken+'.txt', reqponse + '\r\n');
//                                    console.log('组用户发送文本(pushMessage)返回信息', reqponse);
                                    });
                                }

                                //积分日志记录
                                var obj = {
                                    openId: openId,
                                    wxToken: wxToken,
                                    integral: 0,
                                    description: description,
                                    timeStr: timeStr
                                };
                                saveIntegralLog(obj);

                                redisClient.hmset(redisKey, obj, function (error, reply) {
                                    if (error) {
                                        console.log(error);
                                    }
                                    if (reply) {
                                        redisClient.expire(redisKey, 60 * 60 * 24);
                                    }
                                });

                            } else {
                                console.log('更新用户积分失败', obj, _id);
                            }
                        });
                    }
                } else {
                    console.log('查询用户失败：', _id);
                }
            });
        }else{
            console.log('-------已经撤消积分--------',_id);
        }
    });


}


/**
 * 积分日志入库
 * @param obj
 */
var saveIntegralLog = exports.saveIntegralLog = function (obj) {
    var integralLog = new IntegralLog(obj);
    integralLog.save(function (err, doc) {
        if (err) {
            console.log(err);
        }
    });
};

function getRedis_hgetall(key, callback) {
    redisClient.hgetall(key, function (error, reply) {
        if (error) {
            console.log(error);
        }
        callback(reply);
    });
}

function setRedis_hmset(redisKey, obj, callback) {
    redisClient.hmset(redisKey, obj, function (error, reply) {
        if (error) {
            console.log(error);
        }
        if (reply) {
            redisClient.expire(redisKey, 60 * 60 * 24);
            callback(reply);
        } else {
            callback(null);
        }
    });
}


//reduction('2015/02/18 00:00:00','2015/02/19 00:00:00');
//reduction('2015/02/19 00:00:00','2015/02/20 00:00:00');


function start() {
    var message = ' 欢迎来到“北京电视台服务号”积分兑换商城，这里有最潮的电子产品、最实用的日常百货、还有各种美食套餐......商品都会不定期的更新！\n\r' +
        '为了让粉丝们可以公平、公正、公开的兑换到自己喜欢的奖品，小编在此有几句话要说：\n\r' +
        '1、	我们提供的商品拒绝山寨、A货、高仿，到您手里绝对是货真价实的商品，商品以实物为准；\n\r' +
        '2、	当您兑换完商品后，一定要第一时间填写完送货信息，才能保证小编即时的为您将奖品送达；\n\r' +
        '3、	发货信息可以在“我的积分”—“账户信息”中查询到；\n\r' +
        '5、	发出的奖品涉及到个人所得税问题由粉丝自理；\n\r' +
        '6、	我们严格拒绝一切刷积分行为，一旦出现恶意刷积分，将取消该粉丝兑换的所有奖品，并且将积分清零！';

    var wxToken = 'tvmty';
    var openId = 'oux1puLLtHRV-mEyIz0EXNd17zHo';

//    interface.pushMessage(wxToken, openId, message, function (err, reqponse) {
//        console.log('组用户发送文本(pushMessage)返回信息', reqponse);
//    });



}

//start();




//    四川广播电视台：7e23e7592e334f1b
//    四川卫视：ec7048baeeb3
//    乡音对对碰：4c8fd6452300
//    BTV青年频道：26b4fd8dc630



var articles_26b4fd8dc630 = {
    "articles": [
        {
            "title": "Duang！签到异常情况说明及处理",
            "description": "Duang！duang！duang！",
            "url": "http://iwmh.mtq.tvm.cn/rest/img/detail?mid=4G6TJAN5H&sn=7ca840ddf6bf08dc0d2298f2ce5b179f",
            "picurl": "http://iwmh.mtq.tvm.cn/data/upload/ueditor/image/20150304/1425446992827214.jpg"
        }
    ]
};
var articles_4c8fd6452300 = {
    "articles": [
        {
            "title": "签到机器人呼叫您啦",
            "description": "3月5日（元宵节）推出双倍积分活动，敬请参加",
            "url": "http://iwmh.mtq.tvm.cn/rest/img/detail?mid=GT2YJPG8E&sn=8a38ab528750ddc52dedb1303f23b5ad",
            "picurl": "http://iwmh.mtq.tvm.cn/data/upload/ueditor/image/20150304/1425446992827214.jpg"
        }
    ]
};
var articles_ec7048baeeb3 = {
    "articles": [
        {
            "title": "签到机器人呼叫您啦",
            "description": "3月5日（元宵节）将推出签到双倍积分活动，另外精彩活动不停，欢迎关注。",
            "url": "http://iwmh.mtq.tvm.cn/rest/img/detail?mid=5O3Q53J5C&sn=01ebd3ffb9d0e67c314fbc60fc1368df",
            "picurl": "http://iwmh.mtq.tvm.cn/data/upload/ueditor/image/20150304/1425446992827214.jpg"
        }
    ]
};
var articles_7e23e7592e334f1b = {
    "articles": [
        {
            "title": "签到机器人呼叫您啦",
            "description": "3月5日（元宵节）将推出签到双倍积分活动，另外精彩活动不停，欢迎关注。",
            "url": "http://iwmh.mtq.tvm.cn/rest/img/detail?mid=229AQ4T16&sn=05071e6de3bbc582d7a6be36d23ce661",
            "picurl": "http://iwmh.mtq.tvm.cn/data/upload/ueditor/image/20150304/1425446992827214.jpg"
        }
    ]
};

//var _token = '26b4fd8dc630';
//var _token = '4c8fd6452300';
//var _token = 'ec7048baeeb3';
//var _token = '7e23e7592e334f1b';

//query(_token+'-2015-02-18.txt','2015/02/18 00:00:00','2015/02/19 00:00:00',_token);
//query(_token+'-2015-02-19.txt','2015/02/19 00:00:00','2015/02/20 00:00:00',_token);


//reduction('2015-02-19',_token,'2015/02/19 00:00:00','2015/02/20 00:00:00',articles_7e23e7592e334f1b);
//reduction('2015-02-18',_token,'2015/02/18 00:00:00','2015/02/19 00:00:00','news',articles_7e23e7592e334f1b);