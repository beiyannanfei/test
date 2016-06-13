/**
 * Created by nice on 2014/9/5.
 */

var mongoose           = require('mongoose'),
    Schema                 = mongoose.Schema;

var GroupsSchema = new Schema({
    //活动
    activity: {type: String},
    //关键字
    key: {type: String},
    //结果集
    results: [String],
    //媒体桥 微信公共 指定的 token
    wxToken: {type: String},
    //用户IDs
    openIds: [String],
    //分组查询参数
    parameters: {type: String},
    //创建时间
    createTime: {type: Date, default: Date.now},
    //更新时间
    updateTime: {type: String}
});

mongoose.model('Groups',GroupsSchema);