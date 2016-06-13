/**
 * Created by zwb on 2014/12/26.
 */

var mongoose           = require('mongoose'),
    Schema                 = mongoose.Schema;

var GroupUserIdsSchema = new Schema({
    //活动
    groupId:{type: String},
    //微信ID
    openId:{type: String},
    //时间
    dateTime: {type: Date, default: Date.now}
});

mongoose.model('GroupUserIds',GroupUserIdsSchema);



//唯一索引
//db.groupuserids.ensureIndex({groupId:1,openId:1})
//db.groupuserids.ensureIndex({groupId:1,openId:1}, {unique: true})