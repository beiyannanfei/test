/**
 * Created by wyq on 2015/9/18.
 */
var co = require('co');
var redisClient = require('redis').createClient();
var wrapper = require('co-redis');
var redisCo = wrapper(redisClient);
co(function* () {
    yield redisCo.set('test', 33);
    console.log(yield redisCo.get('test')); // logs 33
});



/*
function test(args, cb) {
    args = 10;
    return cb(null, args);
}

var bar = function (arg) {
    return new Promise(function (resolve, reject) {
        test(arg, function (err, data) {
            if (err)
                reject(err);
            resolve(data);
        })
    })
};


function* foo() {
    var a = yield bar(asdf);
}
*/