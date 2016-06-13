/**
 * Created by chenjie on 2015/7/27.
 */


var models = require('../models/index');
var _ = require('underscore');
var async = require('async');
var Users = models.Users;
console.log(Users)
Users.distinct('wxToken', {}, function(err, arr){
    console.log(arr)
    if(err){
        console.log(err);
    } else {
        async.eachSeries(arr, function(o, done){
            Users.update({wxToken: o, integral: {$lt: 0}}, {$set: {integral: 0}}, {multi: true}, function(err, o){
                if (err){
                    console.log(err)
                }
                done()
            })
        }, function(err){
            console.log('success');
        })
    }
})

