/**
 * Created by luosm on 2015/6/30.
 * 获取视频信息
 */

var httpUtils = require('./http-utils.js');
var config = require('../config.js');

exports.getMedia = function(count,page,topic,wxtoken, cb){
    var url = config.tvmcloudDomain+"/mtq/media_api.php?action=get";
    //&wxtoken="+wxtoken+"&count="+count+"&page="+page+"&topic="+topic;
    if(wxtoken){
        url+="&wxtoken="+wxtoken;
    }
    if(count){
        url+="&count="+count;
    }
    if(page){
        url+="&page="+page;
    }
    if(topic!=null && topic!=undefined){
        url+="&topic="+topic;
    }
    console.log(url);
    httpUtils.getXmlHttp(url, cb)
}
/*this.getMedia(1,1,1,"tvmcj",function(err,result){
 if(err){
 console.log(err);
 }else{
 console.log(result);
 //.subject.entry[0].image_url
 }
 })*/

exports.getMediaById=function(wxtoken,id,cb){
    var url = config.tvmcloudDomain+"/mtq/media_api.php?action=getbyid";
    if(wxtoken){
        url+="&wxtoken="+wxtoken;
    }
    if(id){
        url+="&sid="+id;
    }
    console.log(url);
    httpUtils.getXmlHttp(url, cb)
};


exports.sendMediaInfo=function(entryid,token,cb){
    var url=config.wmhUrl+"/api/cloud/getCloudById?cloudid="+entryid+"&token="+token;
    console.log("api cloud getcloudbyid : "+url);
    httpUtils.httpGet(url,cb);
}
exports.sendDocMediaInfo=function(doc,cb){
    //console.log(JSON.stringify(doc))
    this.sendMediaInfo(doc.ext.videoRes.shareId,doc.token,cb);
}

/*
this.getMediaById("tvmcj",476,function(err,result){
     if(err){
     console.log(err);
     }else{
     console.log(result);
     //.subject.entry[0].image_url
     }
 });
*/



