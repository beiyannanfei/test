/**
 * Created by chenjie on 2015/1/19.
 */

exports.gotoMyOrderList = function(req, res){
    res.redirect('/pointMall/go/me/order/list')
}

exports.gotoMyAccount = function(req, res){
    res.render('me_account')
}
