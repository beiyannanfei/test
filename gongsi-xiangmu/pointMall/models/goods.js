var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

exports.type = {score: 1, cashRedPager: 2, goods: 3, chargeCard: 4, empty: 5, shoppingCard: 6, redPager: 7, selfShoppingCard: 8, card: 9, live: 102, demand: 103, demandPackage: 104, vip: 105, salon: 106, other: 999}
exports.useType = {lottery: 1, pay: 2}
exports.playType = {exchange: 1, buy: 2, timeDown: 3, oneYuan: 4, lottery: 5, raise: 6}
exports.followLimitType = {followed: 1, nofollowed: 2, all: 3}
exports.state = {up: 1, down: 2, storage: 3}

var GoodsSchema = new Schema({
    use: {type: Number},
    name: {type: String, required: true},
    pic: {type: String, required: true},
    type: {type: Number},
    score: {type: Number},
    price: {type: Number, default: 0},
    token: {type: String},
    count: {type: Number},
    ext: {type: Schema.Types.Mixed},
    category: {type: String},
    dateTime: {type: Date, default: Date.now},
    deleted: {type: Boolean}
});

mongoose.model('Goods', GoodsSchema);