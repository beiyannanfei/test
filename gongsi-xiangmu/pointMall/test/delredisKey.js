/**
 * Created by zwb on 2014/12/31.
 */



var moment = require('moment');
var URL = require('url');
var redis = require('redis');
var models = require('../models/index');
var Behavior = models.Behavior;
var Groups = models.Groups;
var GroupUsers = models.GroupUsers;
var Users = models.Users;
var GroupUserIds = models.GroupUserIds;


var _ = require('underscore');
var async = require('async');
var tools = require('../tools');

var interface = require('../interface');




var redisClient = redis.createClient(6379, '10.20.30.61');
redisClient.on('error', function (err) {
    console.log('Error ' + err);
});
redisClient.select(1, function () {
    console.log('用行为组查询 切换到 database 1');
});


function getKey(key,callback){

    redisClient.keys(key, function (error, reply) {
        if (error) {
            console.log(error);
            callback(null);
        } else {
//            console.log(reply);
            callback(reply);
        }
    });
}

function delKey(key){
    getKey(key,function(array){
        async.eachSeries(array, function (key, done) {
//            console.log(key);
            redisClient.del(key, function (error, reply) {
               if(error){
                   console.log(error);
               }
            });
            done(null);
        }, function (err) {

        });
    });
}





var redisKey = 'USERGROUP:3a59f7a4b8b28dca:*:我承诺:贴标签*';
//var  redisKey = 'GROUPID:3a59f7a4b8b28dca:我承诺:贴标签';

//getKey(redisKey,function(data){
//    console.log(data);
//})

delKey(redisKey);