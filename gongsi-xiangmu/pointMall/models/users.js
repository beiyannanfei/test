/**
 * User: nice
 * Date: 14-8-15
 * Time: 下午12:00
 */


var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var tree = require('mongoose-tree2');

var UsersSchema = new Schema({
    //ID
    _id: {type: String},
    //平台用户身份ID
    unionid: {type: String},
    //微信ID
    openId: {type: String},
    //上级微信ID
    higherId: {type: String, default: ''},
    //媒体桥 微信公共 指定的 token
    wxToken: {type: String},
    //积分 number 默认 0
    integral: {type: Number, default: 0},
    //昵称
    nickName: {type: String},
    //头像
    headImg: {type: String},
    //城市
    city: {type: String},
    //省份
    province: {type: String},
    //性别 0 代表女  1 代表男
    sex: {type: String},
    //时间
    subscribe_time: {type: String},
    //用户状态
    status: {type: String, default: 'subscribe'}, //subscribe 关注用户，unsubscribe 取消关注用户
    //用户标签
    tags: [String],
    //用户等级
    rating: {type: String},
    //推荐用户数量
    recommendNumber: {type: Number,default: 0},
    //使用统一积分 父级ID
    bindingId: {type: String},
    //是否绑定(是否使用统一积分)   0代表未绑定，1代表绑定
    binding: {type: String,default: '0'},
    //手机号码
    mobile: {type: String},
    //姓名
    name: {type: String},
    //邮箱
    email: {type: String},
    //vip
    vip: {type: Schema.Types.Mixed},
    //入库时间
    dateTime: {type: Date, default: Date.now}
});

UsersSchema.plugin(tree);
//建立树形结构
UsersSchema.methods.addChildren = function (userInfo, callback) {
    userInfo.parent = this;
    userInfo.save(function (err, doc) {
        if (err) {
            console.log(err);
        } else {
            callback(doc);
        }
    });
};

mongoose.model('Users', UsersSchema);