"use strict";

var redis = require('redis')
var coRedis = require('co-redis')

var db = redis.createClient()

module.exports = coRedis(db)