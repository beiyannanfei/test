/**
 * Created by chenjie on 2015/4/20.
 */

var config          = require('../config');
var mongoskin       = require('mongoskin');
var NODE_ENV        = config.NODE_ENV;

var masterDb = mongoskin.db(config.mongodb.master.url, config.mongodb.master.opts)
var slaveDb = mongoskin.db(config.mongodb.slave.url, config.mongodb.slave.opts)
module.exports = {masterDb: masterDb, slaveDb: slaveDb}