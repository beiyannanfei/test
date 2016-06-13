var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var LotteryStatisticsSchema = new Schema({
    token: {type: String},
    openIds: [String],
    numberPeople: {type: Number},
    numberLottery: {type: Number},
    hour: {type: Schema.Types.Mixed},
    activity: {type: Schema.Types.Mixed},
    prize: {type: Schema.Types.Mixed},
    dateTime: {type:Date}
});

mongoose.model('LotteryStatistics', LotteryStatisticsSchema);