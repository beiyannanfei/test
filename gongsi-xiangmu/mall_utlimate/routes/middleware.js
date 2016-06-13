var _ = require('underscore');

exports.midSend = function () {
    return function *(next){
        var _this = this
        this.send = function(code, data){
            console.log(arguments)
            if (_.isNumber(code)){
                if (code == 200){
                    _this.body = ({status: 'success', code: code, data: data})
                } else {
                    _this.body = ({status: 'failure', code: code, errMsg: data})
                }
            } else {
                _this.body = ({status: 'success', code: 200, data: code})
            }
        }
        yield* next
    }
}