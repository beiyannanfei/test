/**
 * Created by chenjie on 2015/4/20.
 */

var db          = require('./mongo.js');
var _           = require('underscore');
var mongoskin   = require( 'mongoskin' );
var ObjectID    = mongoskin.ObjectID;
var CryptoJS    = require("crypto-js");

var redisCache = require('../dal/redis_cache');
var mShoppingCard = require('../routes/shoppingCard.js');

function dbUtils(collection){
    this.collection = collection;
    db.bind(this.collection);
};

dbUtils.ObjectID = ObjectID

dbUtils.toId = function(id){
    if (_.isArray(id)){
        var arr = []
        _.each(id, function(o){
            arr.push(new ObjectID(o))
        })
        return arr
    } else {
        return new ObjectID(id)
    }
}

dbUtils.isValidId = function(id){
    if (/^[0-9a-zA-Z]{24}$/.test(id)){
        return true
    } else {
        return false
    }
}

dbUtils.id2Str = function(id){
    if (_.isArray(id)){
        var arr = []
        _.each(id, function(o){
            arr.push(o.toString())
        })
        return arr
    } else {
        return id.toString()
    }
}

function obj2str(obj){
    for (var k in obj) {
        if (_.isString(obj[k])){
            continue
        } else if (_.isRegExp(obj[k])){
            obj[k] = obj[k].toString()
        } else {
            obj2str(obj[k])
        }
    }
}

function deepCopy(source) {
    var result={};
    for (var key in source) {
        if (_.isObject(source[key])){
            result[key] = deepCopy(source[key])
        } else{
            result[key] = source[key];
        }
    }
    return result;
}
exports.deepCopyObj=deepCopy;

dbUtils.db = db

dbUtils.prototype = {
    //add cache in function
    insert: function (docs, callback) {
        db[this.collection].insert(docs, callback)
        redisCache.delMulti(this.collection);
    },
    save: function(doc, callback) {
        db[this.collection].save(doc, callback)
        redisCache.delMulti(this.collection);
    },
    findOne: function(spec, options, callback) {
        if (spec._id && !_id instanceof ObjectID){
            spec._id = new ObjectID(spec._id)
        }
        var collection = this.collection;
        if (_.isFunction(options)){
            callback = options
            options = {}
        }

        var specs = deepCopy(spec)
        obj2str(specs)
        var redisKey = collection + "_" + JSON.stringify(specs).split(' ').join('') + JSON.stringify(options).split(' ').join('');
        //redisKey=CryptoJS.MD5(redisKey).toString();
        redisCache.get(redisKey, function(err, o){
            if (err){
                db[collection].findOne(spec, function(err, db_result){

                    var cache = ''
                    if (!err){
                        cache = JSON.stringify(db_result)
                    }
                    callback(err, db_result)

                    if (cache){
                        redisCache.set(redisKey, cache);
                    }
                })
            } else {
                callback(null, o);
            }
        });
    },
    findById: function(_id, options, callback) {
        if (!_id instanceof ObjectID){
            _id = new ObjectID(_id)
        }
        var collection = this.collection;
        if (_.isFunction(options)){
            callback = options
            options = {}
        }
        var redisKey = _id.toString();
        //var redisKey = _id + JSON.stringify(options).split(' ').join('');
        redisCache.get(redisKey, function(err, o){
            if (err){
                db[collection].findById(_id, function(err, db_result){
                    var cache = ''
                    if (!err){
                        cache = JSON.stringify(db_result)
                    }

                    if (collection == 'prize'){
                        mShoppingCard.getCount(_id.toString(), function(count){
                            db_result.count = count
                            callback(err, db_result)
                        })
                    } else {
                        callback(err, db_result)
                    }

                    if (cache){
                        redisCache.set(redisKey, cache);
                    }
                })
            } else {
                if (collection == 'prize'){
                    mShoppingCard.getCount(_id.toString(), function(count){
                        o.count = count
                        callback(err, o)
                    })
                } else {
                    callback(null, o);
                }
            }
        });
    },
    find: function(spec, field, options, callback) {
        var collection = this.collection;

        if (_.isFunction(field)){
            callback = field
            field = null
            options = null
        } else if (_.isFunction(options)){
            callback = options
            options = null
        }

        var specs = deepCopy(spec)
        obj2str(specs)
        var redisKey = JSON.stringify(specs).split(' ').join('') + JSON.stringify(field).split(' ').join('') + JSON.stringify(options).split(' ').join('');
        //redisKey=CryptoJS.MD5(redisKey).toString();
        redisCache.getMulti(collection, redisKey, function(err, o){
            if (err){
                db[collection].findItems(spec, field, options, function(err, db_result){
                    var cache = ''
                    if (!err){
                        cache = JSON.stringify(db_result)
                    }

                    if (collection == 'prize'){
                        mShoppingCard.getCountMap(_.pluck(db_result, '_id'), function(map){
                            _.each(db_result, function(o){
                                if (map[o._id.toString()]){
                                    o.count = map[o._id.toString()]
                                } else {
                                    o.count = 0
                                }
                            })
                            callback(err, db_result)
                        })
                    } else {
                        callback(err, db_result)
                    }

                    if (cache){
                        redisCache.setMulti(collection, redisKey, cache);
                    }
                })
            } else {
                if (collection == 'prize'){
                    mShoppingCard.getCountMap(_.pluck(o, '_id'), function(map){
                        _.each(o, function(obj){
                            if (map[obj._id.toString()]){
                                obj.count = map[obj._id.toString()]
                            } else {
                                obj.count = 0
                            }
                        })
                        callback(err, o)
                    })
                } else{
                    callback(null, o);
                }
            }
        });
    },
    count: function(spec, callback) {
        var collection = this.collection;

        var redisKey = JSON.stringify(spec).split(' ').join('') + "_MUTIL" + "_COUNT";
        //redisKey=CryptoJS.MD5(redisKey).toString();
        redisCache.getMulti(collection, redisKey, function(err, result){
            if (err){
                db[collection].count(spec, function(err, db_result){
                    callback(err, db_result);
                    redisCache.setMulti(collection, redisKey, JSON.stringify({count: db_result}));
                })
            } else if (result && result.count >= 0){
                callback(null, result.count)
            } else {
                callback(null, 0)
            }
        })
    },
    countNoCache: function(spec, callback) {
        var collection = this.collection;
        db[collection].count(spec, function (err, db_result) {
            callback(err, db_result);
        })
    },
    update: function(spec, update_spec, options, callback) {
        if (_.isFunction(options)){
            callback = options
            options = null
        }
        if (spec._id){
            if (spec._id['$in'] && _.isArray(spec._id['$in'])){
                _.each(spec._id['$in'], function(o){
                    redisCache.del(o.toString())
                })
            } else {
                redisCache.del(spec._id.toString())
            }
        }

        db[this.collection].update(spec, update_spec, options, callback);

        redisCache.delMulti(this.collection);
    },
    updateById: function(_id, update_spec, options, callback) {
        if (!_id instanceof ObjectID){
            _id = new ObjectID(_id)
        }
        if (_.isFunction(options)){
            callback = options
            options = null
        }
        db[this.collection].updateById(_id, update_spec, options, callback)

        redisCache.del(_id.toString())
        redisCache.delMulti(this.collection);
    },
    findAndModify: function(spec, sort, update_spec, options, callback) {
        if (_.isFunction(options)){
            callback = options
            options = null
        }
        db[this.collection].findAndModify(spec, sort, update_spec, options, callback)

        redisCache.delMulti(this.collection);
    },
    removeById:function(_id, callback){
        if (!_id instanceof ObjectID){
            _id = new ObjectID(_id)
        }
        var collectionName = this.collection
        db[collectionName].findById(_id,function(err, db_result){
            if(err) {
                return callback(err);
            }
            if(db_result){
                db_result.collectionName = collectionName
                db.collection('rubbish').save(db_result,function(err, result){
                    if(err){
                        return callback(err);
                    }
                    db[collectionName].removeById(_id,function(err,doc){
                        callback(err, doc);
                        redisCache.delMulti(collectionName);
                    })
                });
            }else{
                return callback("not find by id "+_id);
            }

        });
    },
    findNoCache: function(spec, field, options, callback) {     //直接查询不经过redis
        var collection = this.collection;
        if (_.isFunction(field)) {
            callback = field
            field = null
            options = null
        } else if (_.isFunction(options)) {
            callback = options
            options = null
        }
        db[collection].findItems(spec, field, options, function (err, db_result) {
            callback(err, db_result);
        });
    },
    remove:function(spec,callback){
        var collectionName = this.collection;
        db[collectionName].findItems(spec,function(err, db_results){
            if(db_results){
                var r=[];
                _.each(db_results,function(result){
                    delete result._id;
                    r.push(_.extend({},result))
                })
                db.collection('rubbish').insert(r,function(err, result){
                    if(err){
                        return callback(err);
                    }
                    db[collectionName].remove(spec,function(err,doc){
                        callback(err, doc);
                        redisCache.delMulti(collectionName);
                    })
                });
            }else{
                return callback("not find by id "+_id);
            }
        });
    },
    aggregate: function(option, callback){
        var collectionName = this.collection;
        db[collectionName].aggregate(option, function(err, db_results){
            callback(err, db_results);
        });
    }
};

module.exports = dbUtils;
