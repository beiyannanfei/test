/**
 * Created by chenjie on 2015/1/3.
 */

var interface = require('../interface');
var models = require('../models/index');
var fs = require('fs')

var moment = require('moment');
var _ = require('underscore');
var async = require('async');
var readline = require('readline')

var RedPagerRecord = models.RedPagerRecord;

var exit = function(code){
    console.log(code)
    setTimeout(function(){
        process.exit(code);
    }, 1000)
}

var token = "8e8c547795a5fe3c"
var redPagerEventId = "54a6794afcb32d376a000003";
var redPagerId100 = "54a2a6f55cd6dc69160000c7";
var redPagerId50 = "54a2a6e35cd6dc69160000c2";

function send100(){
    var rl = readline.createInterface({
        input: fs.createReadStream('./100元红包1900张.txt'),
        output: process.stdout,
        terminal: false
    });

    var shoppingCards = []
    rl.on('line', function(line) {
        line = line.trim()
        if (line){
            shoppingCards.push(line)
        }
    });

    rl.on('close', function() {
        doSend()
    });

    function doSend(){
        shoppingCards = _.uniq(shoppingCards)
        console.log(shoppingCards.length)
        RedPagerRecord.find({token: token, redPagerEventId: redPagerEventId,  redPagerId: redPagerId100}, function(err, docs){
            if (err){
                console.log(err)
                exit(-1)
            } else {
                var i = 0;
                var shoppingCards1 = _.difference(shoppingCards, _.pluck(docs, 'shoppingCard'))
                console.log(shoppingCards1.length)
                var result = {}
                async.eachSeries(docs, function(o, done){
                    if (_.contains(shoppingCards, o.shoppingCard)){
                        console.log(o)
                        return done()
                    }
                    console.log(i)
                    var shoppingCard = shoppingCards1[i++]
                    RedPagerRecord.findByIdAndUpdate(o._id, {$set: {shoppingCard: shoppingCard}}, function(err, doc){
                        if (err){
                            console.log(o._id)
                            console.log(shoppingCard)
                            console.log(err)
                            return done(err)
                        }

                        var message = "(补发)恭喜您获得100元红包券码" + shoppingCard
                        message += '。（该红包只限于银泰网新注册用户使用，有效期至2015.1.31）。'
                        message += '<a href="http://m.yintai.com">立即激活</a>。'
                        interface.pushMessage(token, o.openId, message, function(err, response){
                            if (response){
                                response = JSON.parse(response);
                                if (response.message){
                                    _.each(response.message, function(o){
                                        if (o.length > 0){
                                            if (o[0].length > 1){
                                                var errMsg = JSON.parse(o[0][1]);
                                                if (errMsg.errcode != 0){
                                                    result[o[1]] = errMsg.errcode
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                            done()
                        })
                    })
                }, function(err){
                    if (err){
                        console.log('100元红包:' + i)
                    }
                    console.log('100元红包 send success 数量:' + i)
                    console.log('100元红包 send success 总数:' + shoppingCards1.length)
                    console.log(result);
                })
            }
        })
    }
}

function send50(){
    var rl = readline.createInterface({
        input: fs.createReadStream('./50元红包800张.txt'),
        output: process.stdout,
        terminal: false
    });

    var shoppingCards = []
    rl.on('line', function(line) {
        line = line.trim()
        if (line){
            shoppingCards.push(line)
        }
    });

    rl.on('close', function() {
        doSend()
    });

    function doSend(){
        shoppingCards = _.uniq(shoppingCards)
        console.log(shoppingCards.length)
        RedPagerRecord.find({token: token, redPagerEventId: redPagerEventId,  redPagerId: redPagerId50}, function(err, docs){
            if (err){
                console.log(err)
                return exit(-2)
            } else {
                var i = 0;
                var shoppingCards1 = _.difference(shoppingCards, _.pluck(docs, 'shoppingCard'))
                console.log(shoppingCards1.length)
                var result = {}
                async.eachSeries(docs, function(o, done){
                    if (_.contains(shoppingCards, o.shoppingCard)){
                        console.log(o)
                        return done()
                    }
                    var shoppingCard = shoppingCards1[i++]
                    RedPagerRecord.findByIdAndUpdate(o._id, {$set: {shoppingCard: shoppingCard}}, function(err, doc){
                        if (err){
                            console.log(o._id)
                            console.log(o.shoppingCard)
                            console.log(shoppingCard)
                            console.log(err)
                            return done(err)
                        }
                        var message = "(补发)恭喜您获得50元红包券码" + shoppingCard
                        message += '。（该红包只限于银泰网新注册用户使用，有效期至2015.1.31）。'
                        message += '<a href="http://m.yintai.com">立即激活</a>。'
                        interface.pushMessage(token, o.openId, message, function(err, response){
                            if (response){
                                response = JSON.parse(response);
                                if (response.message){
                                    _.each(response.message, function(o){
                                        if (o.length > 0){
                                            if (o[0].length > 1){
                                                var errMsg = JSON.parse(o[0][1]);
                                                if (errMsg.errcode != 0){
                                                    result[o[1]] = errMsg.errcode
                                                }
                                            }
                                        }
                                    })
                                }
                            }
                            done()
                        })
                    })
                }, function(err){
                    if (err){
                        console.log('50元红包:' + i)
                    }
                    console.log('50元红包 send success 数量:' + i)
                    console.log('50元红包 send success 总量:' + shoppingCards1.length)
                    console.log(result);
                })
            }
        })
    }
}

//send50()
send100()
