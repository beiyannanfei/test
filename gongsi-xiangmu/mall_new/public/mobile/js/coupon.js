
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

var openId = getQueryString('openid')
var id = getQueryString('id')
var sig = getQueryString('sig')
var wx_token = getQueryString('wx_token')

$(function(){
    if (!openId){
        if (wx_token){
            var redirecturl = encodeURIComponent(window.location.href)
            alert(HOST.userServer + '/oauth?wx_token=' + wx_token + '&token=7fda67277f&redirecturl=' + redirecturl)
            window.location.replace(HOST.userServer + '/oauth?wx_token=' + wx_token + '&token=7fda67277f&redirecturl=' + redirecturl)
        } else {
            alert('网络错误')
        }
        return
    }
    var vm

    function renderCoupon(coupon){
        vm = new Vue({
            el: '#coupon',
            data: {
                jump_text: '立即使用',
                coupon: coupon,
                isDisable: false
            }
        })
    }

    function renderUser(user){
        new Vue({
            el: '#user',
            data: {
                user: user
            }
        })
    }

    function receiverCoupon(cb){
        $.ajax({
            type: "POST",
            url: HOST.server + '/open/coupon/receive/' + id,
            data: {openId: openId, token: wx_token, sig: sig},
            success: function(data){
                if (data.status == 'success'){
                    cb()
                } else{
                    vm.isDisable = true
                    vm.jump_text = data.errMsg
                }
            },
            error: function(xhr){
                cb('err')
                alert('网络错误')
            }
        })
    }

    var user = {}
    var coupon = {}
    function getUser(){
        $.ajax({
            type: "GET",
            url: HOST.server + '/open/user/info?openId=' + openId + '&token=' + wx_token,
            success: function(data){
                if (data.status == 'success'){
                    user = data.data
                } else {
                    user = {}
                }
                renderUser(user)
            }
        })
    }

    function getCoupon(){
        if (HOST.staticServer){
            getCouponByStatic()
        } else {
            getCouponByNet()
        }
    }

    function getCouponByNet(){
        $.ajax({
            type: "GET",
            url: HOST.server + '/open/coupon/' + id + '/detail',
            success: function(data){
                if (data.status == 'success'){
                    coupon = data.data
                }
                renderCoupon(coupon)
            }
        })
    }

    function getCouponByStatic(){
        var url = HOST.staticServer + '/coupon-' + id + '.json' + '?_=' + Math.random()
        $.getJSON(url, function(data){
            if (!data || !data._id){
                getCouponByNet()
            } else {
                renderCoupon(data)
            }
        })
    }

    var click = false
    $('#jump_url').click(function(){
        if (click){
            return
        } else {
            click = true
        }
        var jump_url = $('#jump_url').attr('jump_url')
        if (!jump_url){
            return
        }
        receiverCoupon(function(err){
            if (err){
                return
            }
            window.location.href = jump_url
        })
    })

    getUser()
    getCoupon()
})