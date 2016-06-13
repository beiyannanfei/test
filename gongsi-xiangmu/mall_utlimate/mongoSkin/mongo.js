/**
 * Created by chenjie on 2015/4/20.
 */

var config          = require('../config');
var mongoskin       = require('mongoskin');
var NODE_ENV        = config.NODE_ENV;

var opts = {};

if (NODE_ENV == 'prod' || NODE_ENV == 'wxprod') {
    opts = {
        server: { poolSize: 20 },
        mongos: true,
        replset: {strategy: 'ping', rs_name: 'shop'}
    };
}else if (NODE_ENV == 'ali') {
    opts = {
        server: { poolSize: 20 },
        mongos: true,
        replset: {strategy: 'ping', rs_name: 'ali'}
    };
}

var str = config.mongodb.links;
module.exports = mongoskin.db(str, opts)