/**
 * Created by wyq on 17/1/18.
 */
"use strict";
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var ObjectId = mongoose.Schema.Types.ObjectId;
var String = mongoose.Schema.Types.String;
var Number = mongoose.Schema.Types.Number;
var Boolean = mongoose.Schema.Types.Boolean;
var Array = mongoose.Schema.Types.Array;
var Buffer = mongoose.Schema.Types.Buffer;
var Date = mongoose.Schema.Types.Date;
var Mixed = mongoose.Schema.Types.Mixed;

var _id = mongoose.Types.ObjectId();
console.log(_id);
console.log(typeof _id);
console.log(typeof ObjectId);
console.log(typeof String);
console.log(typeof Number);
console.log(typeof Boolean);
console.log(typeof Array);
console.log(typeof Buffer);
console.log(typeof Date);
console.log(typeof Mixed);






