/**
 * Created by wyq on 2015/10/12.
 */

var async = require("async");

var arr = [{rate: 1}, {rate: 2}, {rate: 3}, {rate: 4}];

async.each(arr, function (item, cb) {
    item.type = item.rate + 1;
    return cb(null);
}, function (err) {
    console.log("err: %j", err);
    console.log(arr);
});
