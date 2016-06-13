var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ActivitySchema = new Schema({
    name: {type: String, required: true},
    score: {type: Number, required: true},
    token: {type: String, required: true},
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    dateTime: {type: Date, default: Date.now},
    prizes: Schema.Types.Mixed,
    lotteryC: {type: String},   //percent count
    way: {type: Number},
    deleted: {type: Boolean},
    cover: {type: String},
    bgImg: {type:String},
    turnplate: {type: String},
    info: {type: String},
    limit: {type: Number},
    active: {type: Number, default: 0},
    inBound: {type: Number, default: 0},
    enableTime: Schema.Types.Mixed,
    followLimit: {type: Number, default: 0},
    category: Schema.Types.Mixed
});

mongoose.model('Activity', ActivitySchema);