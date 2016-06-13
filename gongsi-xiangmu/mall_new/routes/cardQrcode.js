/**
 * Created by chenjie on 2015/5/19.
 */

var dbUtils = require('../mongoSkin/mongoUtils.js')
var cardQrcodeCollection = new dbUtils('cardQrcode')

var wxCardApi = require('../interface/wxcardApi.js');

function qrcodeCreate(data, accessToken, cb){
    wxCardApi.qrcodeCreate(data, accessToken, function(err, ticket){
        if (err){
            console.log(err)
            cb(500, err)
        } else {
            var qrcode = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + ticket
            cb(null, qrcode)
        }
    })
}

exports.getQrcode = function(req, res, accessToken){
    var card_id = req.param('card_id');
    if (!card_id){
        return res.send(500, 'param card_id is not exists');
    }
    cardQrcodeCollection.findOne({card_id: card_id}, function(err, o){
        if (err){
            return res.send(500, err);
        } else {
            if (o){
                return res.send(o);
            } else {
                qrcodeCreate({action_name: "QR_CARD", action_info: {card: {card_id: card_id}}}, accessToken, function(err, qrcode){
                    if (qrcode){
                        res.send({card_id: card_id, url: qrcode})
                        cardQrcodeCollection.save({card_id: card_id, url: qrcode}, function(err, o){})
                    } else {
                        res.send(500, err);
                    }
                })
            }
        }
    })
}
