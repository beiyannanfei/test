var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var PlayerHistorySchema = new Schema({
    token: {type: String},
    openId: {type: String},
    records: {type: Schema.Types.Mixed}
});

mongoose.model('PlayerHistory', PlayerHistorySchema);