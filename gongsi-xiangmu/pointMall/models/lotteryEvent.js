var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var goodsSchema = new Schema({
    id: {type: String, required: true},
    openIds: [{type: String}],
    count: {type: Number, required: true},
    memo: {type: String, required: true},
    message: {type: String, required: true},
    notice: {type: Schema.Types.Mixed},
    state: {type: String, default: 'undo'} //undo, completed, send
});

var EventSchema = new Schema({
    token: {type: String, required: true},
    theme: {type: String, required: true},
    tagCategory: {type: String, required: true},
    tag: {type: String, required: true},
    state: {type: String, default: 'undo'}, //undo, completed
    goods: [goodsSchema],
    defaultGoodsId: {type: String},
    dateTime: {type:Date,default: Date.now},
    deleted: {type: Boolean}
});

mongoose.model('LotteryEvent', EventSchema);