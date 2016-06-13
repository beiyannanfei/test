/**
 * Created by nice on 2014/9/3.
 */


var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BehaviorSchema = new Schema({
    //微信Id
    openId: {type: String},
    //昵称
    nickName: {type: String},
    //头像
    headImg: {type: String},
    //积分
    integral: {type: Number},
    //媒体桥 微信公共 指定的 token
    wxToken: {type: String},
    //用户行为
    behavior: {type: String},
    //行为结果
    result: {type: String},
    //描述信息
    description: {type: String},
    //地区
    area:{type: String},
    //用户信息关联
    user:{type:String,ref: 'Users'},
    //毫秒时间
    time: {type: Number},
    //时间
    dateTime: {type: Date, default: Date.now}
});

mongoose.model('Behavior', BehaviorSchema);