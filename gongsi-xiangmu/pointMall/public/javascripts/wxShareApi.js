/*发送给朋友: "menuItem:share:appMessage"
 分享到朋友圈: "menuItem:share:timeline"*/

$(function(){





    function InitWxJsParam(err, data){


        if (err || !data){
            return WeixinJSBridge.call('hideOptionMenu');
        }
        wx.config({
            /*debug: true,*/
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.noncestr,
            signature: data.signature,
            jsApiList: ['checkJsApi', 'hideOptionMenu', 'showOptionMenu', 'onMenuShareTimeline','onMenuShareAppMessage', 'hideMenuItems', 'showMenuItems', 'previewImage', 'scanQRCode'],
            success: function(){

            },
            fail: function(){

            }
        });

        wx.ready(function(){
            wx.hideOptionMenu()
            if (!data.title){
                return
            }
            var shareData = {
                title: data.title,
                link: data.link,
                desc: data.desc,
                imgUrl: data.imgUrl,
                success: function () {

                },
                cancel: function () {

                }
            }
            wx.showMenuItems({
                menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline']
            })
            wx.hideMenuItems({
                menuList: ['menuItem:share:qq', 'menuItem:share:weiboApp', 'menuItem:favorite', 'menuItem:share:facebook', 'menuItem:share:QZone', 'menuItem:copyUrl', 'menuItem:openWithQQBrowser', 'menuItem:openWithSafari', 'menuItem:share:email']
            })
            wx.onMenuShareTimeline(shareData)
            if (data.type == 'video'){
                shareData.type = 'video'
                shareData.dataUrl = data.link
            }
            wx.onMenuShareAppMessage(shareData);
        });

        wx.error(function(res){
            WeixinJSBridge.call('hideOptionMenu');
            alert(JSON.stringify(res))
        });
    }

    $.getScript('/pointMall/javascripts/jweixin-1.0.0.js', function(){
        if (window.loadShareParam){
            window.loadShareParam(InitWxJsParam)
        } else {
            WeixinJSBridge.call('hideOptionMenu');
        }
    })
})
