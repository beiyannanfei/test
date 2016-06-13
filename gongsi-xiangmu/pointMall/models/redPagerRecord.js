var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var RedPagerRecordSchema = new Schema({
    token: {type: String, required: true},
    openId: {type: String, required: true},
    redPagerId: {type: String, required: true},
    shoppingCard: {type: String},
    redPagerEventId: {type: String},
    goodsType: {type: Number},
    state: {type: Number, default: 0},
    endTime: {type: Date},
    boundText: {type: String, default: ''},
    dateTime: {type: Date, default: Date.now}
});

mongoose.model('RedPagerRecord', RedPagerRecordSchema);