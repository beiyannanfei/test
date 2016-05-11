/**
 * Created by wyq on 2016/5/9.
 */

var config = require("../../config.js");
var mongoskin = require('mongoskin');

var masterDb = mongoskin.db(config.mongo.master.url, config.mongo.master.opts);
var slaveDb = mongoskin.db(config.mongo.slave.url, config.mongo.slave.opts);
module.exports = {masterDb: masterDb, slaveDb: slaveDb};