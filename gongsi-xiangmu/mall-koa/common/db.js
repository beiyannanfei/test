"use strict";

var Mongorito = require('mongorito')
var Model = Mongorito.Model
var config = require('../config')


Mongorito.connect(config.mongodb)

module.exports = Model