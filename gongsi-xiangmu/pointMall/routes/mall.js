/**
 * Created by zwb on 2014/12/22.
 */

exports.index = function (req, res) {
    var wxToken = req.session.token;
    if (wxToken == '') {
        res.send('身份验证不通过');
    } else {
        res.render('mall-login', {
            layout: false,
            wxToken: wxToken
        });
    }
};

exports.register = function(req, res) {
    res.render('mall-register', {
        layout: false
    });
};

/**
 * 登录
 * @param req
 * @param res
 */
exports.login = function (req, res) {
    var wxToken = req.session.token;

};

/**
 * 注册
 * @param req
 * @param res
 */
exports.registration = function (req, res) {
    var wxToken = req.session.token;

};

/**
 * 验证 消费卷
 * @param req
 * @param res
 */
exports.verificationCode = function (req, res) {
    var wxToken = req.session.token;

};
