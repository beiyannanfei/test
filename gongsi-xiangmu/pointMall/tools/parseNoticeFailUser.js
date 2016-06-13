/**
 * Created by Administrator on 2015/1/4.
 */


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

function find50(){
    var rl = readline.createInterface({
        input: fs.createReadStream('./50.txt'),
        output: process.stdout,
        terminal: false
    });

    var openIds = []
    rl.on('line', function(line) {
        line = line.trim()
        if (line){
            console.log(line)
            var openId = line.split(':')[0]
            openId = openId.trim();
            openId = openId.replace(/\'/gi, '');
            openIds.push(openId)
        }
    });

    rl.on('close', function() {
        find()
    });

    var find = function(){
        var condition = {
            token: token,
            redPagerEventId: redPagerEventId,
            redPagerId: redPagerId50,
            openId: {
                $in: openIds
            }
        }
        RedPagerRecord.distinct('shoppingCard', condition, function(err, docs){
            console.log('100')
            console.log(docs)
            find100()
        });
    }
}

function find100(){
    var rl = readline.createInterface({
        input: fs.createReadStream('./100.txt'),
        output: process.stdout,
        terminal: false
    });

    var openIds = []
    rl.on('line', function(line) {
        line = line.trim()
        if (line){
            console.log(line)
            var openId = line.split(':')[0]
            openId = openId.trim();
            openId = openId.replace(/\'/gi, '');
            openIds.push(openId)
        }
    });

    rl.on('close', function() {
        find()
    });

    var find = function(){
        var condition = {
            token: token,
            redPagerEventId: redPagerEventId,
            redPagerId: redPagerId100,
            openId: {
                $in: openIds
            }
        }
        RedPagerRecord.distinct('shoppingCard', condition, function(err, docs){
            console.log('100')
            console.log(docs)
        });
    }
}

find50()
