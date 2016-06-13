var mongoose           = require('mongoose'),
Schema                 = mongoose.Schema;


var OpUserSchema = new Schema({
    uid: {type: String},
    type: {type: Number},
    password: {type: String},
    email: {type: String},
    username: {type: String},
    icon: {type: String},
    token: {type: String},
    wxName: {type: String},
    keywords: [String]
});

mongoose.model('OpUser',OpUserSchema);