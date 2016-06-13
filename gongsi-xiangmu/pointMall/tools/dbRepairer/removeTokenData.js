/**
 * Created by chenjie on 2015/1/27.
 */

var _ = require('underscore');
var async = require('async');

var models = require('../../models')
var mdb = models.getMDb();
var fs = require('fs')
process.maxTickDepth = Number.MAX_VALUE;
var config = require('../../config')

var token = '8e8c547795a5fe3c'

function start(){
    var modelNames = _.keys(mdb.models)
    console.log(modelNames)
    async.eachSeries(modelNames, function(name, done){
        removeOldData(name, done)
    }, function(err){
        if (err){
            console.log(err);
        } else {
            console.log('remove success!');
        }
    })
}

function removeOldData(name, done){
    console.log('removeOldData:' + name)
    var Model = mdb.model(name);
    Model.collection.remove({$or: [{token: token}, {wxToken: token}]}, function(err){
        if (err){
            done(err)
        } else {
            done()
        }
    })
}

setTimeout(function(){
    start();
}, 5000)

