"use strict";
const mongoose = require('mongoose');

var array = mongoose.Types.Array;
var ObjectId = mongoose.Types.ObjectId;

console.log(array);
console.log(new ObjectId);
console.log(mongoose.version);