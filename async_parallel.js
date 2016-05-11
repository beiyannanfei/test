var async = require("async");

var show = function (text, cb) {
    console.log("[%j] ******* %j", new Date().toLocaleString(), text);
    cb(null);
};

var taskA = [
    function a(cb) {
        setTimeout(function () {
            show("taskAaaaaaa", function (err) {
                cb(err, 'taskAaaa');
            })
        }, 1000);
    },
    function b(cb) {
        setTimeout(function () {
            show("taskAbbbbbb", function (err) {
                cb(err, 'taskAbbb');
            })
        }, 2000);
    },
    function c(cb) {
        setTimeout(function () {
            show("taskAcccccc", function (err) {
                cb(err, 'taskAccc');
            })
        }, 3000);
    }
];

var taskB = {
    "AA": function a(cb) {
        setTimeout(function () {
            show("taskBaaaaaa", function (err) {
                cb(err, 'taskBaaa');
            })
        }, 1000);
    },
    "BB": function b(cb) {
        setTimeout(function () {
            show("taskBbbbbbb", function (err) {
                cb(err, 'taskBbbb');
            })
        }, 2000);
    },
    "CC": function c(cb) {
        setTimeout(function () {
            show("taskBcccccc", function (err) {
                cb(err, 'taskBccc');
            })
        }, 3000);
    }
};

async.series([
    function (cb) {
        async.parallel(taskA, function (err, result) {
            console.log("[%j], taskA err: %j, res: %j", new Date().toLocaleString(), err, result);
            cb(err, result);
        });
    },
    function (cb) {
        async.parallel(taskB, function (err, result) {
            console.log("[%j], taskB err: %j, res: %j", new Date().toLocaleString(), err, result);
            cb(err, result);
        });
    }
], function (err, result) {
    console.log("[%j], series err: %j, res: %j", new Date().toLocaleString(), err, result);
});
