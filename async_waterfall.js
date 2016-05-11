/**
 * Created by wyq on 2015/8/6.
 */
var async = require("async");
var config = require("./config.js");
var log4js = require('log4js');
log4js.configure(config.log4jsconfig, {});
var logger = log4js.getLogger(__filename);

var show = function (text, cb) {
    logger.info("********** " + text);
    cb(null, text);
};

var task = [
    function a(cb) {
        setTimeout(function () {
            show("aaaaa", function (err, res) {
                cb(err, res + "_bbb");
            })
        }, 1000);
    },
    function b(txt, cb) {
        console.log("txt = %j", txt);
        setTimeout(function () {
            show("aaaaa_bbb", function (err, res) {
                cb(err, res + "_ccc");
            })
        }, 2000);
    },
    function c(txt, cb) {
        setTimeout(function () {
            show("aaaaa_bbb_ccc", function (err, res) {
                cb(err, res + "_ddd");
            })
        }, 3000);
    }
];

async.waterfall(task, function (err, results) {
    logger.fatal("********** err: %j, results: %j", err, results);
});


