/**
 * Created by chenjie on 2014/10/9.
 */

function onBridgeReady(){
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady()  {
        WeixinJSBridge.call('showOptionMenu');
    });
    WeixinJSBridge.call('showOptionMenu');
}
if (typeof WeixinJSBridge == "undefined"){
    if( document.addEventListener ){
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    }else if (document.attachEvent){
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
}else{
    onBridgeReady();
}



