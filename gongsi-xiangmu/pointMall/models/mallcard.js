var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var MallCardSchema = new Schema({
    token: {type: String},
    openId: {type: String},
    goodsId: {type: String},
    name: {type: String},
    discount: {type: Number},
    state: {type: Number, default: 0},
    startTime: {type: Date},
    endTime: {type: Date},
    dateTime: {type: Date, default: Date.now},
    usedGoodsIds: Schema.Types.Mixed
});

mongoose.model('MallCard', MallCardSchema);