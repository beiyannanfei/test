/**
 * Created by zwb on 2014/12/17.
 */



var mongoose           = require('mongoose'),
    Schema                 = mongoose.Schema;

var PersonalSchema = new Schema({
    //媒体桥 微信公共 指定的 token
    wxToken: {type: String,required: true},
    //标题
    title: {type: String},
    //扫码获得积分
    integral: {type: Number},
    //首次关注
    attention: {type: Number},
    //数值表示单位，如：积分，荔枝，豆豆
    unit: {type: String},
    //推荐用户数，写入用户行为
    recommendNumber: {type: Number},
    //修改时间
    updateTime:[String],
    //时间
    dateTime: {type: Date, default: Date.now}
});

mongoose.model('Personal',PersonalSchema);