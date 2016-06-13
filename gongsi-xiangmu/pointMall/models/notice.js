var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var NoticeSchema = new Schema({
    token: {type: String, required: true},
    openIds: {type: Schema.Types.Mixed, required: true},
    message: {type: String},
    dateTime: {type: Date, default: Date.now}
});

mongoose.model('Notice', NoticeSchema);