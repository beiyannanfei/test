/**
 * Created by chenjie on 2015/1/22.
 */

//Model.collection.insert(docs, options, callback)

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var DailyRecordSchema = new Schema({
    type: {type: String},
    sourceId: {type: String}, //store goods
    ext: Schema.Types.Mixed,
    dateString: {type: String}
});

mongoose.model('DailyRecord', DailyRecordSchema);