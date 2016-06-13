var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

exports.from = {scoreLottery: 1, lotteryEvent: 2, pointExchange: 3, wxPay: 4}

var LotterySchema = new Schema({
    token: {type: String},
    openId: {type: String},
    prizeId:{type: String},
    prizeType:{type: Number},
    prizeName: {type: String},
    prizePic: {type: String},
    addressId: {type: String},
    wayCom: {type: String},
    waybillId: {type: String},
    score: {type: Number},
    mobile: {type: String},
    name: {type: String},
    email: {type: String},
    mallCard: {type: Schema.Types.Mixed},
    shoppingCard: {type: String},
    lotteryEvent: {type: String},
    activityId: {type: String},
    out_trade_no: {type: String},
    storeId: {type: String},
    randomNum: {type: String},
    from: {type: Number},
    state: {type: String, default: 'unDelivery'}, //unDelivery, Delivery, Delivered, deleted, refund
    trade_state: {type: String, default: 'complete'}, //new, complete
    ext: {type: Schema.Types.Mixed},
    orderInfo: {type: Schema.Types.Mixed},
    day: {type: Number, default: 0},
    count: {type: Number, default: 0},
    price: {type: Number, default: 0},
    expiredTime: {type:Date},
    dateTime: {type:Date,default: Date.now}
});

mongoose.model('Lottery', LotterySchema);