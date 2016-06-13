var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var StoreSchema = new Schema({
    name: {type: String},
    m: {type: Number},   // 1 单行, 2, 双行
    way: {type: Number}, // 1 exchange, 2, wxPay
    bgColor: {type: String},
    token: {type: String, required: true},
    dateTime: {type: Date, default: Date.now},
    prizes: Schema.Types.Mixed,
    share: Schema.Types.Mixed,
    deleted: {type: Boolean}
});

mongoose.model('Store', StoreSchema);