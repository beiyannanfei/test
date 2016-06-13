/**
 * Created by zwb on 2014/12/23.
 */


var mongoose           = require('mongoose'),
    Schema                 = mongoose.Schema;

var SMSSchema = new Schema({
    //手机号码
    mobileNumber: {type: String},
    //短信模版ID
    templateId: {type: String},
    //微信Id
    openId:{type: String},
    //发送短信内容
    content: {type: String},
    //描述信息
    description: {type: String},
    //创建时间
    createTime: {type: Date, default: Date.now}
});

mongoose.model('SMS',SMSSchema);
