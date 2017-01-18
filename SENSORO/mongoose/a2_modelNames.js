/**
 * Created by wyq on 17/1/11.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect("mongodb://localhost/test");
const Schema = mongoose.Schema;

let t15Model = mongoose.model("t15", new Schema({a: String, b: Number}));
let t14Model = mongoose.model("t14", new Schema({a: String, b: Number}));

var modelList = mongoose.modelNames();
console.log(modelList);
// console.log(mongoose.connection.config);
// console.log(mongoose.connection.db);
// console.log(mongoose.connection.collections);v
console.log(mongoose.connection.readyState);