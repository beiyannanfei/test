/**
 * Created by nice on 2014/9/10.
 */

//没用
var mongoose           = require('mongoose'),
    Schema                 = mongoose.Schema;

var GroupUsersSchema = new Schema({
    //活动
    activity: {type: String},
    //标题
    title: {type: String},
    //媒体桥 微信公共 指定的 token
    wxToken: {type: String},
    //结果集
    results: [String],
    //用户IDs
    openIds: [String],
    //字符串时间 YYYY/MM/DD HH:mm:ss
    time: {type: String},
    //时间
    dateTime: {type: Date, default: Date.now}
});

mongoose.model('GroupUsers',GroupUsersSchema);