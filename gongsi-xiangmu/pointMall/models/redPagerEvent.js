var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var RedPagerEventSchema = new Schema({
    name: {type: String, required: true},
    token: {type: String, required: true},
    bg: {type: String},
    logo: {type: String},
    storeName: {type: String},
    storeLink: {type: String, default: ''},
    dateTime: {type: Date, default: Date.now},
    prizes: Schema.Types.Mixed,
    deleted: {type: Boolean},
    limit: {type: Number},
    category: Schema.Types.Mixed,
    endTime: {type: Date}
});

mongoose.model('RedPagerEvent', RedPagerEventSchema);