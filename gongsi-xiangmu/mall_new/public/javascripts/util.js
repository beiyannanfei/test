/**
 Created with JetBrains WebStorm.
 User: zwb
 Date: 2014/10/23
 Time: 14:35
 */
/**
 工具类
 */
//将url的参转换为hash
function url2Hash(_url){
    var parmhash={};
    var querstr=_url||location.search;
    var offset1=querstr.indexOf("?");
    if(offset1!=-1){
        querstr=querstr.substring(offset1+1);
    }
    if(querstr!=""){
        var parms=querstr.split("&");
        var parmsLen=parms.length;
        for(var i=0;i<parmsLen;i++){
            var _keyval=parms[i].split("=");
            var _key=_keyval[0];
            var _val=_keyval[1];
            try{
                parmhash[_key]=decodeURI(_val);
            }catch(ex){
                var offset0=-1;
                var n=0;
                while((offset0=_val.indexOf("%%"))!=-1){
                    _val=_val.substring(0,offset0)+'%25'+_val.substring(offset0+1);
                    n+=4;
                }
                parmhash[_key]=decodeURI(_val);
            }
        }
    }
    return parmhash;
}
function clearHash(_hash){
    for(var key1 in _hash){
        delete _hash[key1];
    }
}
function buildAgentId(str){
    return "agent@"+(new Date().getTime())+"@"+str2hashcode(str);
}
function str2hashcode(str){
    var hash = 1,
        charCode = 0,
        idx;
    if(true){
        hash = 0;
        for(idx = str.length - 1; idx >= 0; idx--){
            charCode = str.charCodeAt(idx);
            hash = (hash << 6&268435455) + charCode+(charCode << 14);
            charCode = hash&266338304;
            hash = charCode != 0 ? hash ^ charCode>>21 : hash;
        }
    }
    return hash;
}
function formatpublisherData(_published){
    var _publishedstr=null;
    try{
        _publishedstr=_published.substr(0,4)+"-"+_published.substr(4,2)+"-"+_published.substr(6,2);
        var _hv=_published.substr(9,2);
        var _mv=_published.substr(11,2);
        var _sv=_published.substr(13,2);
        if(_hv=="24"){

        }else if(_hv=="00" && _mv=="00" && _sv=="00"){

        }else if(_hv=="00" && _mv=="00"){

        }else{
            _publishedstr+=" "+_hv+":"+_mv;
        }
    }catch(ex){}
    return _publishedstr;
}
function parseLoadUrlResult(_dataArray){
    var _dataArrayLen=_dataArray==null?0:_dataArray.length;
    //console.log("parseLoadUrlResult="+_dataArrayLen,_dataArray);
    var vals=[];
    for(var dataoffset=0;dataoffset<_dataArrayLen;dataoffset++){
        var formatdata={};
        var _op=_dataArray[dataoffset];
        formatdata.basicdata=_op;
        var infoid=_op.id;
        var _published=_op.published;// 20120619 224431
        if(infoid==null || _published==null){
            console.log(dataoffset+">>infoid or  published is null",_op);
            continue;
        }
        var _publishedstr=formatpublisherData(_published);

        if(_publishedstr==null){
            console.log("published is null",_op);
            continue;
        }



        var _title=_op.title;
        var _image=_op.image||"";
        var _objurlstr=_op["url"]||_op.video||_image;

        var _summary=_op.summary||_op.content;
        //	var _content=_op.content;

        var _region=_op.region;//地区
        var _publishedUnix=_op.publishedUnix;

        var _source=_op.source;

        var _tags=[];
        var sourcecss="";
        if(_source=="InternetNews" || _source=="InternetWebs"){//
            sourcecss="web";
            _tags.push(_op.sourceWebsite||"网站名称");
        }else if(_source=="WeiBoNews"){
            if(_op.bigimage!=null){_image=_op.bigimage;}
            sourcecss="wb";
            formatdata.faceImg=_op.faceImg;
            _tags.push(_op.commentCount+"|"+_op.transmitCount);
            _tags.push(_op.sourceWebsite||"网站名称");
            _tags.push(_op.userType||"用户类型");
        }else if(_source=="NewspaperNews"){
            sourcecss="newspaper";
            _tags.push(_op.newspapersName||"报刊名称");
        }else if(_source=="Picture"){
            sourcecss="pic";
            _tags.push(_op.forumWebsite||"来源网站");
        }else if(_source=="Video"){
            sourcecss="av";
            _tags.push(_op.forumWebsite||"来源网站");
        }else if(_source=="ForumNews"){
            sourcecss="bbsrs";
            _tags.push(_op.comeFrom||"来源网站");
        }else if(_source=="tvmcloud"){
            sourcecss="tv";
            _tags.push(_op.channel||"频道");
            _tags.push(_op.program||"栏目");
        }else if(_source=="localimage"){//本地图片
            sourcecss="pic";
            if(_op.comeFrom)
                _tags.push(_op.comeFrom);
        }else if(_source=="localvideo"){//本地视频
            sourcecss="av";
            if(_op.comeFrom)
                _tags.push(_op.comeFrom);
        }else if(_source=="CopyrightPicture"){//
            sourcecss="pic";
            if(_op.forumWebsite)
                _tags.push(_op.forumWebsite);
        }else{//电视显示频道
            console.log("未知来源："+_source);
            console.log(_op);
            continue;
        }
        formatdata.id=infoid;
        formatdata.type=sourcecss;//用来显示类型图标的css名称
        formatdata.biaoti=_title;
        formatdata.datetime=_publishedstr;
        formatdata["tags"]=_tags;
        formatdata["url"]=_objurlstr;
        if(_image.indexOf("http")!=-1)
            formatdata["image"]=_image;
        formatdata.summary=_summary;
        formatdata.source=_source;
        vals.push(formatdata);
    }
    return vals;
}
function gotourl(urlstr){
    var querystr="";
    var urlparm=url2Hash();
    for(var key in urlparm){
        var val=urlparm[key]||"";
        if(val!=""){
            if(querystr==""){
                querystr=key+"="+val;
            }else{
                querystr+="&"+key+"="+val;
            }
        }
    }
    var _offset=urlstr.indexOf("?");
    if(_offset==-1){
        urlstr+="?"+querystr;
    }else{
        urlstr+="&"+querystr;
    }
    location.replace(urlstr);
}


function sethrefEvent(infoid,isnotocuh){
    var obj=$("#info_"+infoid);
    if(obj.length==0){
        obj=$("#"+infoid);
    }

    var hrefobjs=obj.find("a");
    var hrefobjslen=hrefobjs.length;
    var hrefoffset=0;
    for(var kk=0;kk<hrefobjslen;kk++){
        var _hrefobj1=$(hrefobjs[kk]);
        var _target=_hrefobj1.attr("target");
        if(_target==null){
            continue;
        }

        _hrefobj1.attr("target","_self");
        var _hrefstr=_hrefobj1.attr("href");
        if(_hrefstr!=null && _hrefstr.indexOf("http")==0){
            var newhrefid="href_"+kk+"_"+infoid;
            _hrefobj1.attr("href","javascript:goplay('"+newhrefid+"')");
            _hrefobj1.attr("oldhref",_hrefstr);
            _hrefobj1.attr("id",newhrefid);
            _hrefobj1.attr("infoid",infoid);
            //如果是ipad加上块的click事件，不用点链接可以查看详细信息 && navigator.userAgent.match(/iPad|iPhone/i)

            if(!isnotocuh && hrefoffset==0) {
                (
                    function(_firsthrefid){
                        obj.click(function(){
                            if(event.srcElement.nodeName!="A" && event.srcElement.parentNode.nodeName!="A"){
                                goplay(_firsthrefid);
                            }
                        });
                    }
                    )(newhrefid)
            }
            hrefoffset++;
        }else{
            _hrefobj1.attr("href","javascript:void(0)");
        }
    }
}

function goplay(infoid){
    var _hrefobj1=$("#"+infoid);
    var _hrefstr=_hrefobj1.attr("oldhref");
    var _infoid=_hrefobj1.attr("infoid");
    var _jsonstr=$('#json_'+_infoid).text();
    var _jsonobj =null;
    try{
        _jsonobj = JSON.parse(_jsonstr);

        if(typeof(onplaybegin)=="function"){//epublisher界面下
            if(_jsonobj.source=="localvideo"){//为了适配play页,play页不支持当前数据源，将数据源设置为互联网视频为了正常播放
                _jsonobj.source="Video";
            }
        }

    }catch(ex){
        alert("数据格式错误！");
        console.log(ex);
        console.log('#json_'+_infoid)
        console.log(_jsonstr)
        return;
    }
    _jsonobj.url=_hrefstr;
    _jsonobj.title=_hrefobj1.text();
    //_jsonobj.content="";
    //_jsonobj.summary=_jsonobj.title;
    if(playBox==null){
        playBox=new playFrame();
    }
    if(playBox!=null){

        playBox.display(_jsonobj,function(_type){
            /* */
            var hiddenobjs=$("[playhidden=1]");
            var hiddenobjslen=hiddenobjs.length;
            if(_type==0){
                try{
                    playBox.open_init();
                }catch(ex){}
                if(navigator.userAgent.match(/iPhone|iPad/i)) {
                    for(var kk=0;kk<hiddenobjslen;kk++){
                        var tempobj=$(hiddenobjs[kk]);
                        var hiddenobjsHeight=tempobj.height();
                        tempobj.attr("hiddenobjsHeight",hiddenobjsHeight);
                        hiddenobjs[kk].style.cssText="height:10px;";
                    }
                }
                if(typeof(onplaybegin)=="function"){
                    onplaybegin();
                }
            }else{
                try{
                    playBox.close_quit();
                }catch(ex){}
                if(navigator.userAgent.match(/iPhone|iPad/i)) {
                    for(var kk=0;kk<hiddenobjslen;kk++){
                        hiddenobjs[kk].style.display="";
                        var tempobj=$(hiddenobjs[kk]);
                        var hiddenobjsHeight=tempobj.attr("hiddenobjsHeight");
                        hiddenobjs[kk].style.cssText="height:"+hiddenobjsHeight+"px;";
                    }
                }
            }

        });
    }else{
        alert("playBox加载失败!");
    }
}


//var ediscoveryurl="http://ediscovery.tvmining.com";
var ediscoveryurl="";
function getCache(){
    var cachejsonobj=$("#cachejson");
    var _cacheval=cachejsonobj.text();
    var _cachevalObj=null;
    if(_cacheval!=""){
        _cachevalObj=JSON.parse(_cacheval);
    }
    return _cachevalObj;
}
function setCache(_jsonObj){
    var cachejsonobj=$("#cachejson");
    if(cachejsonobj.length==0){
        cachejsonobj=$("<textarea id='cachejson' style='display:none'></textarea>");
        $("body").append(cachejsonobj);
    }
    cachejsonobj.text(_jsonObj==null?"":JSON.stringify(_jsonObj));
}
function getpageLen(_datalistlen,_pagecount){
    var _countpage=parseInt(_datalistlen/_pagecount);
    if(_datalistlen%_pagecount>0){
        _countpage++;
    }
    return _countpage;
}
function loadUrl(_parms,_callback){
    //console.log("loadUrl",_parms);
    _parms=_parms||{};

    var urlparm=url2Hash();

    for(var keyA in urlparm){
        var valA=urlparm[keyA]||"";
        if(valA!=""){
            var valparmB=_parms[keyA]||"";
            if(valparmB==""){
                _parms[keyA]=valA;
            }
        }
    }



    var _pageoffset=parseInt(_parms.page||1);//第几页
    var _pagecount=parseInt(_parms.pagecount||20);//每页多少行

    var _sources=_parms.sources||"";
    var _agentid=_parms.agentid || urlparm.agentid || "";

    //处理缓存数据func
    var parseivisiondata=function(returnval){
        var _datalist=returnval.vals||[];
        var _datalistlen=_datalist==null?0:_datalist.length;
        if(_pageoffset==1){//第一页算页数和信息条数
            var _countpage=getpageLen(_datalistlen,_pagecount);
            returnval.count=_datalistlen;
            returnval.countpage=_countpage;
            returnval.onepagecount=_pagecount;
            returnval.layout="flow";
        }
        if(_datalistlen>0){
            var parsedatalen=(returnval.showall)?_datalistlen:_pagecount;
            returnval.vals=parseLoadUrlResult(_datalist.splice(0,parsedatalen));
        }

        _callback(returnval);
        returnval.vals=_datalist;
        setCache(returnval);
    }
    //console.log(_pageoffset,_parms,getCache());
    if(_agentid!=""){//从中控读取信息
        //	alert(_agentid+">>从中控读取信息>>"+_pageoffset);
        if(_pageoffset==1){
            faop.agentstoretype=2;
            faop.getAgent(_agentid,function(_datalist){
                var returnval={"vals":_datalist};
                parseivisiondata(returnval);
            });
        }else{
            var _cachevalObj=getCache();
            if(_cachevalObj!=null){
                parseivisiondata(_cachevalObj);
            }
        }
        return;
    }
    var urlstr=HOST+"/agent/agent.php?"+TOKEN;
    if(_parms.keyword==null || _parms.keyword==""){
        //没有关键字读缓存数据
        var _cachevalObj=getCache();
        if(_cachevalObj!=null){
            parseivisiondata(_cachevalObj);
        }
        return;
    }
    $.ajax({
        url :urlstr ,
        data:_parms,
        dataType : 'json',
        success : function(ref){
            var _status=ref.status||"";
            if(_status=="Not logged"){
                try{
                    LOGOUT();
                }catch(ex){}
                return;
            }
            //{"status":"Not logged"}
            if(_parms.fromvalue==1){//只有filter数据
                _callback(ref);
                return;
            }
            var countpage=0;
            if(ref.totalPages!=null){
                countpage=ref.totalPages.countpage;
            }
            var count=0;
            if(ref.total){
                count=ref.total.count;
            }
            //console.log(ref);
            var _dataArray=ref.dataArray;
            var _dataArraylen=_dataArray==null?0:_dataArray.length;
            var returnval={"count":count,"countpage":countpage,"vals":[]};
            if(_dataArraylen>0){
                returnval.vals=parseLoadUrlResult(_dataArray);
            }
            _callback(returnval);
        },
        error:function(){
            //alert("请求失败1！");
        }
    });
}
function clslogininfo(_callback){
    var urlstr=ediscoveryurl+"/agent/logout.php?"+TOKEN;

    $.ajax({
        type: "get",
        url: urlstr,
        dataType : 'json',
        success : function(){
            if(_callback!=null){
                _callback();
            }
        },
        error:function(ref){
            console.log("gotologin",ref);

        }
    });
}
function goUAServerGroupMember(_parm,_callback){
    var urlstr=ediscoveryurl+"/agent/usergroup.php?"+TOKEN;
    $.ajax({
        type: "get",
        url: urlstr,
        data:_parm,
        dataType : 'json',
        success : _callback,
        error:function(ref){
            console.log("goUAServerGroupMember",ref);

        }
    });
}
function autologin(_callback,_validateCode,_fromclient){
    _validateCode=_validateCode||url2Hash(TOKEN)["validateCode"];
    _fromclient=_fromclient||"epublisher";
    var urlstr=ediscoveryurl+"/agent/Authenticate.php?validateCode="+_validateCode+"&fromclient="+_fromclient;
//	console.log(TOKEN,urlstr);
    $.ajax({
        type: "get",
        url: urlstr,
        data:{},
        dataType : 'json',
        success : _callback,
        error:function(ref){
            console.log("autologin",ref);

        }
    });
}
function gotologin(_parm,_callback){
    var urlstr=HOST+"/agent/login.php";
    _parm["HOST"]=urlstr;
    urlstr=ediscoveryurl+"logincheck";
    $.ajax({
        type: "get",
        url: urlstr,
        data:_parm,
        dataType : 'json',
        success : _callback,
        error:function(ref){
            console.log("gotologin",ref);

        }
    });
}
//得到频道栏目信息
function getResourceinfo(workerid,fieldname,_callback){
    //http://218.241.171.213:8080/workers/tvmcloud/pindao/valuelist
    var urlstr=ediscoveryurl+"/agent/epublisher.php?action=valuelist&parameter="+workerid+"/"+fieldname+"&"+TOKEN;
    /*
     var psip=getpublishersevAdd();if(psip=="")return;
     urlstr=psip+"/workers/"+workerid+"/"+fieldname+"/valuelist";
     */
    $.ajax({
        type: "POST",
        url: urlstr,
        data:"",
        dataType : 'json',
        success : _callback,
        error:function(ref){
            console.log("得到频道栏目信息getworkerinfo",ref);

        }
    });
}
function getstore(_key,ref){
    //ref(localStorage[_key]||"");
    invokeMethod("getvalue",ref,{"key":_key});
}
function savestore(_key,_val,ref){
    /*
     localStorage[_key]=_val;
     if(ref!=null)
     ref();
     */

    invokeMethod("savevalue",ref,JSON.stringify({"key":_key,"value":_val}));
}
var defaultpuSvr=location.hostname+":8888";//部署在apache,tomcat用8888端口用这个
//var defaultpuSvr=location.host;  //部署在tomcat用这个
var AGENT=AGENT||"";
var publishserverip=AGENT||defaultpuSvr;
function setepipaddress(){
    setPubSrv(promptPubSrv());
}
function setPubSrv(_address,defaultaddress){

    publishserverip=_address||defaultaddress||defaultpuSvr;
}
function promptPubSrv(){
    var str=window.prompt("请输入PublisherServer地址：","127.0.0.1:8080");
    if(str!=null){
        str=$.trim(str);
        if(str==""){
            str=null;
        }
    }
    return str;
}
function checkIpAddress(ipaddr){
    var offset1=ipaddr.indexOf(":");
    if(offset1!=-1){
        var port1=parseInt(parseInt(ipaddr.substring(offset1+1))||0);
        if(port1<=80){
            return false;
        }
        ipaddr=ipaddr.substring(0,offset1);
    }
    var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (re.test(ipaddr)){
        //split into units with dots "."
        var parts = ipaddr.split(".");
        //if the first unit is zero
        if (parseInt(parseFloat(parts[0])) == 0){
            return false;
        }
        if (parseInt(parseFloat(parts[3])) == 0){
            return false;
        }
        for (var i=0; i<parts.length; i++){
            if (parseInt(parseFloat(parts[i])) > 254){
                return false;
            }
        }
        return true;
    } else{
        return false;
    }
}
function getpublishersevAdd(){
    if(publishserverip==""){
        setPubSrv(promptPubSrv(),location.host);
    }
    if(publishserverip!=""){
        var offset1=publishserverip.lastIndexOf("/");
        if(offset1==0){
            publishserverip=location.host;
        }else	if(offset1>8){
            publishserverip=publishserverip.substring(0,offset1);
        }

        if(publishserverip.indexOf("http://")==-1){
            publishserverip="http://"+publishserverip;
        }
    }
    return publishserverip;
}

function invokeMethod(_methodname,_callback,qparm){
    var urlstr=ediscoveryurl+"invoke/"+_methodname
    $.ajax({
        type: "POST",
        url: urlstr,
        data:qparm||"",
        dataType : 'json',
        success :function(ref){
            if(ref.status=="没有权限"){
                LOGOUT();
            }else{
                _callback(ref);
            }
        },
        error:function(ref){
            console.log("请求失败invokeMethod("+_methodname+")！",ref);
            if(ref.status==403){
                LOGOUT();
            }else if(ref.status==500){

            }
            //alert("error:"+urlstr);
        }
    });
}
function invokeiVision(_action,_callback,qparm){
    var psip=getpublishersevAdd();
    if(psip=="")return;
    var urlstr=psip+"/publish?action="+_action+"&viewtype=6&targetserver=iVision"+"&"+TOKEN;
    $.ajax({
        type: "POST",
        url: urlstr,
        data:qparm||"",
        dataType : 'json',
        success : _callback,
        error:function(ref){
            console.log(ref);
            //alert("请求失败2！"+urlstr);
        }
    });
}
function getupload2publisherurl(){
    var psip=getpublishersevAdd();
    if(psip=="")return;
    return psip+"/uploadfile";
}
function sendPublishData(targetserver,datajson,_reffunc){
    if(targetserver==null || targetserver==""){
        if(typeof(deploymentversion)=="string"){
            targetserver=deploymentversion;
        }else{
            alert("sendPublishData没有指定targetserver");
            return;
        }
    }
    var psip=getpublishersevAdd();
    if(psip=="")return;
    $.ajax({
        type: "POST",
        url: psip+"/publish?targetserver="+targetserver+"&"+TOKEN,
        data:datajson,
        success : _reffunc,
        error:function(){
            //alert("请求失败3！");
        }
    });
}

function openlogviewwindiv(){
    var psip=getpublishersevAdd();
    if(psip=="")return;

    var logviewwindivobj=$("#logviewwindiv");
    if(logviewwindivobj.length==0){
        var _html='<div id="logviewwindiv" style="z-index:888888;background-color:transparent;position:fixed;left:50%;top:20px;'
            +'border:0px solid black;border-radius:0px;margin-left: -450px;width:900px;height:600px;">'
            +'<iframe id="logviewwinifr"  style="width:100%;height:100%;" frameborder="0" marginheight="0" marginwidth="0" ></iframe>'
            +'<div style="margin-top:-600px" align="right"><img src="./images/close.png" style="cursor:pointer;max-height:22px;margin:0px -10px 0px 0px" onclick="closelogviewwindiv()"></div>'
            +'</div>'
        $("body").append(_html);
        logviewwindivobj=$("#logviewwindiv");
    }else{
        logviewwindivobj.show();
    }
    logviewwinifr.location.replace(psip+"/publish?viewtype=1"+TOKEN);
}
function closelogviewwindiv(){
    var logviewwindivobj=$("#logviewwindiv");
    logviewwindivobj.hide();
    logviewwinifr.location.replace("about:blank");
}
function loadScript(_src,_reffunc){
    var localvaljs = document.createElement('script');
    localvaljs.type = 'text/javascript';
    localvaljs.async = true;
    localvaljs.onload=function(){
        _reffunc();
    }
    localvaljs.src = _src;
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(localvaljs, s);
}
function alertmsg(str){
    var alertmsgdivobj=document.getElementById("alertmsgdiv");
    if(alertmsgdivobj==null){
        var _html='<div id="alertmsgdiv" style="text-align:center;opacity:0.6;width:100%;height:100%;position:fixed;left:0px;top:0px;background-color:black;">'
            +'<div style="margin-top:10%;'
            +'font-size:18px;z-index:1000;padding:12px 0px 12px 0px'
            +';text-align:center;background-color:black;opacity:1;color:white;">'+str+'</div></div>';
        document.body.insertAdjacentHTML("beforeEnd",_html);
    }else{
        alertmsgdivobj.style.display="block";
    }
}
function hidemsg(str){
    var alertmsgdivobj=document.getElementById("alertmsgdiv");
    if(alertmsgdivobj!=null){
        alertmsgdivobj.style.display="none";
    }
}
function data2str(_data,format){
    format=format||"yyyy-MM-dd hh:mm:ss";
    var o = {
        "M+" : _data.getMonth()+1, //month
        "d+" : _data.getDate(),    //day
        "h+" : _data.getHours(),   //hour
        "m+" : _data.getMinutes(), //minute
        "s+" : _data.getSeconds(), //second
        "q+" : Math.floor((_data.getMonth()+3)/3),  //quarter
        "S" : _data.getMilliseconds() //millisecond
    }
    //console.log(o);
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (_data.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
                RegExp.$1.length==1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
//长时间，形如 (2003-12-05 13:04:06)
function str2date(str){
    var strlen=str.length;
    if(strlen<19){
        if(strlen==10){
            str+=" 00:00:00";
        }else if(strlen==16){
            str+=":00";
        }
    }
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    if(r!=null){

        var d= new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]);
        if(d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]){
            return d;
        }
    }
    return null;
}
function 	viewlocalfile(_sourcefileobj,_targetElobj,_targetAttrName){
    var oFReader=new FileReader();
    oFReader.onload=function(e){
        $(_targetElobj).attr(_targetAttrName||"src",this.result);
    };
    oFReader.readAsDataURL(_sourcefileobj);
}



function loadmoredataWithScrollY(_obj,callback){
    var topval=_obj.scrollTop;
    var objheight=_obj.clientHeight;
    var lastChildObj=_obj.lastElementChild;
    if(lastChildObj!=null){
        var lastChildObjTop=lastChildObj.offsetTop;
        var lastChildObjHeight=lastChildObj.clientHeight;
        if(topval+objheight>lastChildObjTop-lastChildObjHeight-80){
            callback();
        }
    }
}

function uploadfileWithAjax(fileobj,upprocessviewdivobj,callback1,parms){
    function showimg(onefileobj){
        var upfilename=onefileobj.name;
        if(upfilename!=""){
            upfilename=upfilename.toLowerCase();
            var offset1=upfilename.lastIndexOf(".");
            if(offset1!=-1){
                var hzname=upfilename.substring(offset1+1);
                var typestr="";
                if(hzname=="jpg" || hzname=="png"){
                    typestr="image";
                }else if(hzname=="mp4" || hzname=="mov"){
                    //typestr="video";
                }
                if(typestr==""){
                    setTimeout(function(){
                        alert("不支持该数据格式！"+hzname+"#"+fileobj.type);
                    },500);
                }else{
                    if(typestr=="image"){

                    }else{//视频

                    }
                    var xhr = new XMLHttpRequest();
                    if(upprocessviewdivobj!=null){
                        xhr.upload.onprogress = function(_upevent){
                            if (_upevent.lengthComputable) {
                                var oksize=_upevent.loaded;
                                var percentComplete =oksize / _upevent.total;
                                var bfbint=parseInt(percentComplete*100);
                                var bfbstr=bfbint+"%";
                                if(bfbint==100){
                                    bfbstr="转储中...";
                                }
                                upprocessviewdivobj.innerHTML=bfbstr;
                            }
                        };
                    }
                    var urlstr=null;
                    if(location.pathname.indexOf("/admin/")!=-1){
                        urlstr="../uploadfile?parseItem=worldcupbl";
                    }else{
                        urlstr="uploadfile?parseItem=worldcupbl";
                    }
                    if(parms){
                        for(var key in parms){
                            urlstr+="&"+key+"="+parms[key];
                        }
                    }
                    xhr.open("POST",urlstr,true);
                    var formdata = new FormData();
                    formdata.append("xctp",onefileobj);
                    xhr.onload = function(res) {
                        if(this.status==200){
                            var _responseText=this.responseText;
                            var attachjson=JSON.parse(_responseText);
                            callback1({type:typestr,url:attachjson[0].value});
                        }else{

                        }
                    };
                    xhr.send(formdata);
                }
            }

        }
    }
    try{
        var fileobjs=fileobj.files;
        var fileobjslen=fileobjs.length;
        for(var i=0;i<fileobjslen;i++){
            var fobj1=fileobjs[i];
            showimg(fobj1);
            break;
        }
    }catch(ex){
        console.log(ex);
        //	alert(ex);
    }
    fileobj.parentNode.reset();
}