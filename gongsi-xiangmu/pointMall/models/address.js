/**
 * Created by chenjie on 2014/8/7.
 */

var mongoose           = require('mongoose'),
    Schema                 = mongoose.Schema;

var AddressSchema = new Schema({
    openId: {type: String, required: true},
    token: {type: String},
    isDefault: {type: Number, default: 0},
    deleted: {type: Number, default: 0},
    ids: [String],
    addInfo: {
        name: String,
        tel: String,
        province: String,
        city: String,
        add: String,
        zip: String,
        countryCode: String
    }
});

mongoose.model('Address',AddressSchema);
