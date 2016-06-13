/**
 * Created by nice on 2014/8/19.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IntegralLogSchema = new Schema({
    //微信Id
    openId: {type: String},
    //积分 number 默认 0
    integral: {type: Number},
    //媒体桥 微信公共 指定的 token
    wxToken: {type: String},
    //描述信息 什么操作 积分的来源
    description: {type: String, default: ''},
    //贡献用户的ID
    Contributor: {type: String},
    //商品Id
    commodityId: {type: String},
    //商品数量
    amount: {type: Number},
    //商品数量
    amount: {type: Number},
    //来源
    source:{type:String,default: 'interface '},//interface ,platform
    //字符串时间   YYYY/MM/DD HH:mm:ss
    timeStr: {type: String},
    //时间
    dateTime: {type: Date, default: Date.now}
});

mongoose.model('IntegralLog', IntegralLogSchema);