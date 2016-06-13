var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var WxOrderSchema = new Schema({
    token: {type: String},
    openId: {type: String},
    mallOpenId: {type: String},
    mallToken: {type: String},
    goodsId: {type: String},
    price: {type: Number, default: 0},
    out_trade_no: {type: String},
    addressId: {type: String},
    mobile: {type: String},
    name: {type: String},
    email: {type: String},
    mallCard: {type: Schema.Types.Mixed},
    payResult: {type: Schema.Types.Mixed},
    redPagerRecordIds: {type: Schema.Types.Mixed},
    score: {type: Number, default: 0},
    ext: {type: Schema.Types.Mixed},
    orderInfo: {type: Schema.Types.Mixed},
    reFundResult: {type: Schema.Types.Mixed},
    state: {type: String, default: 'new'}, //refunding refund
    count: {type: Number, default: 0},
    day: {type: Number, default: 0},
    dateTime: {type: Date, default: Date.now}
});

mongoose.model('WxOrder', WxOrderSchema);