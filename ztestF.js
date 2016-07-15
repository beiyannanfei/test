var async = require("async");

var map = {a: 10, b: 20, c: 30, d: 40};
async.forEachOf(map, function (value, key, cb) {

}, function (err) {
});