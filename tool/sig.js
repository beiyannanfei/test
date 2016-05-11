/**
 * Created by luosm on 2015/7/10.
 */

function createSig(openId){
    var str= 'openid=' + openId + '&rkey=tvm1ning%21%40%23.%24%25%5E';
    return  hex_md5(hex_md5(str).toString()).toString();
}