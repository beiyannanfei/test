/**
 * Created by wyq on 2016/5/6.
 */

var path = require('path');
var express = require('express');
var appAdmin = express();
var redisStore = require('connect-redis')(express);
module.exports = appAdmin;

var middleware = require("../globle/middleware.js");


appAdmin.use(express.favicon());
appAdmin.use(express.cookieParser());
appAdmin.use(middleware.setSession(appAdmin, redisStore, express, '/admin'));
appAdmin.use(appAdmin.router);