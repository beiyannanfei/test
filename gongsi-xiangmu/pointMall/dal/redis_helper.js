var tools       = require('../tools');
var redisClient = tools.redisClient();


function exec_del (keys, cb) {
    if(!keys) return cb();

    if (keys.length == 0)
        return cb();

    var i = 0;

    keys.forEach(function(k){
        redisClient.del(k, function(err, reply) {
            if (err) return cb(err);
            i++;
            console.log('DELETED Redis KEY: ' + k);

            if (i==keys.length)
                cb();
        });
    });
}


module.exports = {
    speed : 5 * 60, //; //4 * 60 * 60;   60=1min
    execDel : exec_del,
    count: function(docName, model, condition, cb) {
        var redisKey = docName + "_" + JSON.stringify(condition).split(' ').join('')
            + "_MUTIL" + "_COUNT";

        //console.log(redisKey);

        redisClient.get(redisKey,function(err, value) {
            if (err) return cb(err);

            console.log("VALUE:" + value);
            if (!value) {
                model.find(condition).count(function(err, count) {
                    if (err) return cb(err);

                    redisClient.setex(redisKey, _SPEED, '' + count);
                    console.log("FROM DB: ##"+redisKey+"##" + count);

                    cb(null, count);
                });
            } else if (value) {
                console.log("FROM Redis: ##"+redisKey+"##" + value);
                cb(null, parseInt(value));
            }
        });
    },
    find: function(docName, model, condition, display, p3, cb) {
        var redisKey = docName + "_" + JSON.stringify(condition).split(' ').join('')
            + "_" + JSON.stringify(p3).split(' ').join('') + "_MUTIL";

        //console.log(redisKey);

        redisClient.get(redisKey, function(err, value) {
            if (err) return cb(err);

            if (!value) {
                model.find(condition, display, p3, function(err, docs) {
                    if (err) return cb(err);

                    redisClient.setex(redisKey, _SPEED, '' + JSON.stringify(docs));
                    console.log("FROM DB: ##"+redisKey+"##");

                    cb(null, docs);
                });
            } else if (value) {
                console.log("FROM Redis: ##"+redisKey+"##");

                cb(null, JSON.parse(value));
            }
        });
    },
    findOne: function(docName, model, condition, display, cb) {
        var redisKey = docName + "_" + JSON.stringify(condition).split(' ').join('') + "_SINGLE";

        redisClient.get(redisKey, function(err, value) {
            if (err) return cb(err);

            if (!value) {
                model.findOne(condition, display, function(err, docs){
                    if (err) return cb(err);

                    redisClient.setex(redisKey, _SPEED, '' + JSON.stringify(docs));
                    console.log("FROM DB: ##"+redisKey+"##");

                    cb(null, docs);
                });
            } else {
                console.log("FROM Redis: ##"+redisKey+"##");
                cb(null, JSON.parse(value));
            }
        });
    },
    update: function(docName, model, condition, sets, isDelete, cb) {
        // include delete such as deleted:true

        // docName_*_MUTIL_COUNT
        // docName_*_MUTIL
        // docName_*_SINGLE


        //TODO: should be replace findByIdAndUpdate

        var redisKey_Mutil = docName + '_*_MUTIL*';

        if (!isDelete) redisKey_Mutil = docName + '_*_MUTIL';


        nimble.series([
            function(callback) {
                redisClient.keys(redisKey_Mutil, function(err, keys){
                    if (err) return cb(err);

                    exec_del(keys, function(err) {
                        if (err) return cb(err);

                        callback();
                    });
                });
            },
            function(callback) {
                redisClient.keys(docName + '_*_SINGLE', function(err, reply){
                    if (err) return cb(err);

                    exec_del(reply, function(err) {
                        if (err) return cb(err);

                        callback();
                    });
                });
            },
            function(callback) {
                model.update(condition, {$set:sets}, {multi: true}, function(err) {
                    if (err)
                        return cb(err);

                    cb(null);
                });
            }
        ]);
    },
    del: function(condition, cb) {
        // GOODS_*_MUTIL
        // GOODS_*_MUTIL_COUNT
        // the del == update because deleted=true
        // nothing to do
    },
    add: function(docName, model, doc, cb) {
        // GOODS_*_MUTIL
        // GOODS_*_MUTIL_COUNT

        var redisKey_Mutil = docName + '_*_MUTIL*';

        nimble.series([
            function(callback) {
                redisClient.keys(redisKey_Mutil, function(err, keys){
                    if (err) return cb(err);

                    exec_del(keys, function(err) {
                        if (err) return cb(err);

                        callback();
                    });
                });
            },
            function(callback) {
                new model(doc).save(function(err, doc){
                    cb(err, doc);
                });
            }
        ]);
    }
}