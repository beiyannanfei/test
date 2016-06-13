/**
 * Created by zwb on 2014/12/23.
 */

var mongoose           = require('mongoose'),
    Schema                 = mongoose.Schema;

var LoginSchema = new Schema({
    //手机号码
    mobileNumber: {type: String,required: true},
    //用户昵称
    username: {type: String},
    //密码
    password: {type: String},
    //电子邮件
    email: {type: String},
    //创建时间
    createTime: {type: Date, default: Date.now}
});

mongoose.model('Login',LoginSchema);


/**
 * 创建索引
 * db.logins.ensureIndex({mobileNumber:1,password:1})
 */