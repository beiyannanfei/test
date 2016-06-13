/*
xdjs: 心动js脚本库
版本：1.9 
最后一次修改是2011-12-1
把相应的功能模块化
2012-01-10 添加播放器 T.createFlash
2012-01-11 修改了tagSet()position参数，把原来的顺序修改成数字递增式
2012-01-12 修改了ajax类中的 back 返回参数，改为回调函数 callBack ,去掉 ajax.Over()的方法;
		   去掉返回结果this.Data， 改为直接参数输出。
		   修改了stop方法
2012-01-30 添加了opacity方法
		   添加了fileName方法
		   修改了domain方法
2012-02-24 修改noClick方法		

2013-11-18 新增getSearch([location])方法，取URL search字段   
			
		   
*/
(function($$){
	var W=window,DO=document,DA=DO.all,DB=DO.body,DD=DO.documentElement,DC=DO.createElement,$;
	function xdClass(obj){
		var T=this,_=obj||T;
		

		
		T.delAtt=function(att){delAtt(T,att)}
		
		
		T.getAtt=function(att){
			return getAtt(T,att)			
			};
			
		
		T.setAtt=function(att,val){
			setAtt(T,att,val)
			}	
			
		
		T.addEvent=function(Eve,Fun,b){			
			if(!T["_"+Eve])T["_"+Eve]=[]
			
			addEvent(T,Eve,Fun,b)
			T["_"+Eve].push(Fun)
		};
		
		
		T.delEvent=function(Eve){
			if(T["_"+Eve])delEvent(T,Eve,T["_"+Eve].pop());
			
			};
			
		
		T.getChildNodes=function(tag){
			return getChildNodes(T,tag)
			}	
		
		
		T.getFirstChild=function(tag){
			return getChild(T,tag)
			}	
				
		
		T.getLastChild=function(tag){
			return getChild(T,tag,1)
			}		
				
		
		T.swapNode=function(tag){
			swapNode(T,tag)
			}		
		
		
		T.removeNode=function(){
			removeNode(T)
			}		
		
		T.createNode=function(tag,type,pos){
			return createNode(T,tag,type,pos)
			}		
		
		
		T.getProperty=function(){
			return getProperty(T)
			}
			
		 
		T.createJS=function(content,type,pos){
			createJS(T,content,type,pos)
			 };
		
		
		T.setJsonp=function(callback,type,pos,noSave){
			setJsonp(T,callback)
			}
		
		
		T.noSelect=function(b){
			noSelect(_,b)
			}
			
		
		T.noContextMenu=function(b){
			noContextMenu(_,b)
			}
			
		
		T.noCopy=function(b){
			noCopy(_,b)
			}
		
		T.drag=function(run,B,ran){
			return drag(_,run,B,ran)
			}
				
		
		T.createSelect=function(opts,type,p){
			return createSelect(_,opts,type,p)
			}		
		
		
		T.events=function(event,fun){
			return events(T,"on"+event,fun)
			}		
				
		
		T.getStyle=function(sty){
			return getStyle(_,sty)
			}		
		
		
		T.setStyle=function(css){
			setStyle(css,_)
			}
		
		T.getObjWH=function(p){
			return getObjWH(_,p)
			}	
		
		
		T.createLink=function(url){
			createLink(url,_)
			}		
		
		
		T.createFlash=function(type,parme,ver,err,pos,boxType){
			createFlash(_,type,parme,ver,err,pos,boxType)
			}	
		T.onPropertyChange=function(fun,att){
			onPropertyChange(_,fun,att)
			}		
							
	T.number={		
	
		round:function(N){
			var n
			switch(N){
				case 0:n=Math.round(_);break;
				case -1:n=+(/^[^.]+/.exec(_.toString()));break
				default:
				var O=_.toString().split(".")
				var C=O[0],F=O[1]			
				if(F.substr(N,1)<5){
					n=Number(C+"."+F.substr(0,N))
					
					}else{	
					var e="0.",s
					for(var i=0;i<N-1;i++)e+=0 
					e=e+1
					s=(1+(+F.substr(0,N)))*e
					
					

					n=(s==1?Number(C)+s:Number(C+s.toString().substr(1,N+1)))
					}
				break
					}
			return n
				}
	
	
	
	
	}






T.setFixedDiv=function(tag,T,L,ID,type){
	var tag=tag||"div",O,css="",id=ID?ID:"xdFixedDiv",ty="style|"+(type!=""?type:""),T=T||1,L=L||1
	/*
	tag:要创建的标签名称
	*/
	with(this){
	if(browserN="IE"&&browserV<7){
		 css="_position:absolute;_left:expression(documentElement.scrollLeft+"+L+");_top:expression(documentElement.scrollTop+"+T+")"
		setStyle("body{background-image:url(xd.jpg);background-attachment:fixed}")
	}else{css="position:fixed;top:"+T+"px;left:"+L+"px"}
		O=tagSet(tag,"id|"+id+","+ty+";"+css,"b2")
	return O
	}
 };	 
		

	T.styles=function(n){
		
		var rule=(isNaN(n)?n:styleSheets[n])
		
		return {
		rules:rule.rules,
		index:function(name){
			var l=rule.length
			for(var i=0;i<l;i++){
				if(l[i]==name)return i
				}
			},

		addRules:function(name,css,index){
			
			if(rule.addRule)
				rule.addRule(name,css,index);
				else
				rule.insertRule(name+"{"+css+"}",index)
			},

		delRules:function(index){
			if(rule.removeRule)
				rule.removeRule(index);
			else
				rule.deleteRule(index)
			}
		}
	};
	
T.checkChange=function(checkbox){
	var check=_.checked;
	var box=checkbox,boxL=checkbox.length;
		for(var i=0;i<boxL;i++){
			box[i].checked=check
			}
	};	


T.scrollGet=function(T){
	 var v
	 switch(T){
		 case "w":
		 	v=(this.domMod=="C"?DE.scrollWidth:DB.scrollWidth)
		 break
		 case "h":
		 	v=(this.domMod=="C"?DE.scrollHeight:DB.scrollHeight)
		 break
		 case "l":
		 	v=(this.domMod=="C"?DE.scrollLeft:DB.scrollLeft)
		 break
		 case "t":
		 if(this.domMod=="C"){
		 	v=((browserN=="chrome"||browserN=="safari")?DB.scrollTop:DE.scrollTop)
		 }else{
			v=DB.scrollTop
			 }
		 break		 
		 }
	return v
 };

T.winType=function(t){
	 var v={}
	 if(this.domMod=="C"){
		 v={ "ww":DE.clientWidth ,
			 "wh":DE.clientHeight,
			 "wl":window.screenLeft,
			 "wt":window.screenTop,
			 "sw":DE.scrollWidth,
			 "sh":DE.scrollHeight,
			 "sl":((browserN=="chrome"||browserN=="safari")?DB.scrollLeft:DE.scrollLeft),
			 "st":((browserN=="chrome"||browserN=="safari")?DB.scrollTop:DE.scrollTop)
		}
	}else{
			v.t=""
	}
	return v[t]		
	};

T.scrollSet=function(str,n){if(str==0){return DE.scrollLeft=n}else{return DE.scrollTop=n}};
 
T.eventC=function(event){
	if(browserN=="msie")_[event]()
	else{
		var evt=DO.createEvent("MouseEvents");  
			evt.initEvent(event,true,true);
			_.dispatchEvent(evt)
	}
 };

T.extend=function(n,f){
	
	 f.apply(this)
/*	function b(){
		f.apply(f)
		}	
	 function d(){
		b()
	var i,s="",o=new F;
		for(i in o){
			f[i]=o[i]
			}
			
		}
	d()	
	
	};
T.setOpa=function(v){	
	opacity(_,v)
};


T.binaryToBlob=function(data){
    var bb=new BlobBuilder();
    var arr=new Uint8Array(data.length);
		for(var i=0,l=data.length;i<l;i++)
			arr[i]=data.charCodeAt(i);
		bb.append(arr.buffer);
    return bb.getBlob();
};	

T.dataUrlToBlob=function(dataurl){
    
    var datas = dataurl.split(',', 2);
    var blob=T.binaryToBlob(atob(datas[1]));
		/*atob原生的base64解码 , atob(datas[1])复原二进制*/
		blob.fileType=datas[0].split(';')[0].split(':')[1];
		
    return blob;
};

T.toBlob=function(callback,type){
	var data=_.toDataURL(type);
	var blob=T.dataUrlToBlob(data);
	
	callback.call(T,blob)
	}	
}

//Array.prototype.typeof="array";
//Object.prototype.typeof="object";
//if(window.HTMLElement)HTMLElement.prototype.typeof="DOM";

var isTouch="ontouchstart" in window
function getBrowser(){
		var agent=navigator.userAgent.toLowerCase()		
		,OS,BN
		,os=["windows","ipad","ipod","iphone","android"],osL=os.length
		,bn=["(msie).([^;]+)","(firefox).([^\\s]+)","(safari).([^\\s]+)","(chrome).([^\\s]+)","(opera).([^\\s]+)"],bnL=bn.length
		,i=0;
		for(;i<osL;i++){
			n=os[i]
			if(agent.indexOf(n)>-1){  
				OS=n
				break
			}
		}
		for(i=0;i<bnL;i++){
			var re=new RegExp(bn[i]).exec(agent)
			 if(re){
				 return {N:re[1],V:re[2],OS:OS,touch:isTouch};
				 break 
			 }
		}
		return {N:"msie",V:0,OS:"0",touch:0}			
	 }	
var browser=getBrowser()
	,browserN=browser.N,browserV=browser.V	
	,evtS="mousedown",evtM="mousemove",evtE="mouseup",evtC="click"
	,addEvent,delEvent,getAtt,noPop,getFunName
	,addRule=function(styleObj,selector,css,index){
		styleObj.insertRule(selector+"{"+css+"}",index||0)	
	}
	,domMode=document.compatMode=="CSS1Compat"?"C":"B"
	,BlobBuilder,wURL,createObjectURL,MutationObserver,onPropertyChange
	,styleBG={border:["borderWidth","borderStyle","borderColor"]
					,background:["backgroundColor","backgroundImage","backgroundRepeat","backgroundAttachment","backgroundPosition"]} 
	,opacity=function(_,a){return _.style.opacity=a/100}
	,cssPrefix=(function(){  
    var style=document.documentElement.style,key=',webkit,Moz,o,ms,khtml'.split(','),i=0 ,il=key.length,cs;
		for(;i<il;i++){
			cs=key[i]
			if(cs+"Animation" in style){
				return cs
				break
				}
			}
	})()
	,getCurrentStyle=window.getComputedStyle?function(_){return window.getComputedStyle(_,null)}:function(_){return _.currentStyle}
	,tempTime=setInterval(function(){if(DO.body){DA=DO.all;DB=DO.body;DD=DO.documentElement;DC=DO.createElement;clearInterval(tempTime)}},0)
	,getStyleFun=function(_,sty){
		if(styleBG[sty]){
			var type=styleBG[sty],str="",i=0,l=type.length,s;
				for(;i<l;i++){
					s=getCurrentStyle(_)[type[i]]
					if(s)str+=s+" "
					}
			}else{
				str=getCurrentStyle(_)[sty]
			}
		return str
	}


var mutationString=["MutationObserver","MozMutationObserver","WebKitMutationObserver"];
while(i=mutationString.shift()){
	if(i in window){MutationObserver=window[i]}
}

if(MutationObserver){
	onPropertyChange=function(obj,fun,att){	
	var MutationObserver=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver
		,observer=new MutationObserver(fun)
		,p=att||"";	
		observer.observe(obj,{
			attributes:true,	
			
			
		});	
	}
};
if(document.addEventListener){
	addEvent=function(_,Eve,Fun,b){_.addEventListener(Eve,Fun,b||false)};
	delEvent=function(_,Eve,Fun,b){_.removeEventListener(Eve,Fun||null,b||false)};
}else{
	addEvent=function(_,Eve,Fun){_.attachEvent("on"+Eve,Fun)};
	delEvent=function(_,Eve,Fun){_.detachEvent('on'+Eve,Fun||null)};	
}
noPop=function(e){
	return e.preventDefault?function(e){e.preventDefault();e.stopPropagation()}
	:function(e){e.returnValue=false;e.cancelBubble=true};
}
if(Function.name){
	getFunName=function(f){return f.name}
	}else{
	getFunName=function(f){
		var n,str=f.toString(),i=str.indexOf("(");
			n=str.substring(8,i)
		return n
		}
	};
if(isTouch){
	evtS="touchstart";evtM="touchmove";evtE="touchend"
	}
switch(browserN){
	case "msie":
		opacity=function(_,a){return _.style.filter="alpha(opacity="+a+")"};
		onPropertyChange=function(obj,fun){
			$.addEvent(obj,"propertychange",fun)
		}
		addRule=function(styleObj,selector,css,index){
			styleObj.addStyle(selector,css,index||0)	
		}
	break
	case "firefox":
	
		wURL=W.URL;
		MutationObserver=window.MozMutationObserver;
	break
	case "opera":
		wURL=false
	break
	case "chrome":

		wURL=W.webkitURL;
		MutationObserver=window.WebKitMutationObserver;
	break
	case "safari":
	break
	}

browser.cssPrefix=cssPrefix;
/*扩展================================================================================================================================*/
function extend(){
	var tt=this;
	tt.browser=browser;
	tt.addEvent=addEvent;
	tt.addRule=addRule	
	tt.cookieGet=cookieGet;
	tt.cookieSet=cookieSet;
	tt.cookieDel=cookieDel;
	tt.cloneNode=cloneNode;
	tt.delEvent=delEvent;	
	tt.delAtt=delAtt;
	tt.domLoaded=domLoaded;
	tt.domReady=domReady;
	tt.getAtt=getAtt;
	tt.setAtt=setAtt;
	tt.getChildNodes=getChildNodes;	
	tt.getFirstChild=getChild;
	tt.getLastChild=function(_,tag,index){return getChild(_,tag,index)};	
	tt.swapNode=swapNode;
	tt.createNode=createNode
	tt.removeNode=removeNode;
	tt.getProperty=getProperty;
	tt.createJS=createJS;
	tt.setJsonp=setJsonp;
	tt.rgb2hex=rgb2hex;
	tt.noSelect=noSelect;
	tt.noContextMenu=noContextMenu;
	tt.noCopy=noCopy;
	tt.pageName=pageName;
	tt.domain=domain;
	tt.flashPlayer=flashPlayer;
	tt.createSelect=createSelect;
	tt.getFunName=getFunName;
	tt.getStyle=getStyle;
	tt.setStyle=setStyle;
	tt.createLink=createLink;
	tt.getObjWH=getObjWH;
	tt.typeOf=typeOf;
	tt.mouseWheel=mouseWheel;
	tt.getSearch=getSearch;
	tt.isTouch=isTouch;
	tt.events=events;
	tt.evtS=evtS;
	tt.evtM=evtM;
	tt.evtE=evtE;
	tt.cssPrefix=cssPrefix;
	tt.onPropertyChange=onPropertyChange;
	tt.trim=trim;
	tt.fullW2helfW=function(str,n){
		var news="",l=str.length;
		for(var i=0;i<l;i++){
			t1=str.charCodeAt(i);
			if(n)
			news+=((t1>=34&&t1<127)?String.fromCharCode(t1+65248):str.charAt(i))
			else
			news+=((t1>=65281&&t1<65375)?String.fromCharCode(t1-65248):str.charAt(i))
		}
		return news		
	};
	tt.drag=drag;
	

	tt.array=function(oldArr){

		return {
		concat:function(){
		
		var a=arguments,l=a.length;
		
		for(var i=0;i<l;i++){
			Array.prototype.push.apply(oldArr,a[i])
			}
		},

		clone:function(newArr){
			
			/*
			为什么不采用赋空值的方法？
			如果此时赋空值，哪么下面的操作将不会是原数组而是新的变量
			*/
			for(;oldArr.length;oldArr.shift())oldArr.shift()	
			Array.prototype.push.apply(oldArr,newArr)
		},

		del:function(o,g){
		
		
		
		
		
		var g=g||0,arr=(g==-1?oldArr.reverse():oldArr);
		for(var i=0,l=oldArr.length;i<l;i++){
			if(oldArr[i]==o){
				oldArr.splice(i,1)
				if(g!=0)
					break
					i-- 
				}
			}
		
		g==-1?oldArr.reverse():oldArr
		},				

	index:function(o){
		var l=oldArr.length,i=0
		for(;i<l;i++)	
			if(oldArr[i]==o)
				return i;
		},

	items:function(o){
		for(var s=0,i=0,l=oldArr.length;i<l;i++){
			if(oldArr[i]==o)s++
			}
		return s
		},

	filter:function(){
		for(var i=0;i<oldArr.length;i++){
		
			for(var s=i+1;s<oldArr.length;s++){
				if(oldArr[i]==oldArr[s]){
			
					oldArr.splice(s,1)
					
					s-=1
					}
				}
			}
		
	},

	sort:function(){
		oldArr.sort(function(){var arg=arguments;return arg[0]-arg[1]})
		
		}				
	}
}	
	tt.getSearch=getSearch;
	tt.splitType=splitType;
	tt.subStr=function(str,L,u){
			
			
			
			var i=I=N=S=0,V,U=u||"",l=str.length;
			var re=new RegExp("[^\x00-\xff]","")
			
			if(/[^\x00-\xff]/g.test(str)){
				
				while(i<l){
				
				
				
				if(re.test(str.charAt(i))){I+=2}else{I+=1}
				
				if(I>L){V=str.substr(0,i)+U;break}
				
				i++
				}
			 if(!V)V=str.substr(0,L)
			}else{
				V=(str.length>L)?str.substr(0,L)+U:this
			}	
			return V		
		}
	tt.setAjax=function(a,b,c,d,e){
		return new function(){
			var t=this;
			t.method=a||"get";      
			t.action=b;      
			t.async=(c!=undefined?c:true);  
			t.cache=d||0;        
			t.callBack=(typeOf(e)=="function"?e:0)         
			t.data="";	
			t.Data="";  
			t.Open=t.Send=t.Test=t.Over=Function;
			t.Err=function(){xmlhttp=null}
			t.xmlObj=null;	
			t.send=function(xmlCache){
			var xmlhttp=t.xmlObj||xmlObj();
			  xmlhttp.open(t.method,t.action,t.async);
			/*
			创建或设置对象 ，尤其注意如果 xmlhttp对象在初始建立，在页面加载同时发送请求，xmlhttp.readyState会返回0，这个问题容易引起错误
			所以初始化些对象时一定是在第一次调用时在同一区域创建			
			*/
			  if(t.method.toUpperCase()=="POST"){
				  if(t.cache)xmlhttp.setRequestHeader("Cache-Control","no-cache")
				  xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded; charset=UTF-8");
				}else{
				if(t.cache){
					var c="cache="+Math.random()
						c=(t.action.indexOf("?")!=-1?"&":"?")+c
						t.action+=c
					}
					t.data=null
				}
				 
				  xmlhttp.onreadystatechange=function(){
					  switch(xmlhttp.readyState){					
						case 2:t.Send();break;
						
						case 4:
						  if(xmlhttp.status===200||xmlhttp.status===304){
							  if(t.callBack)t.callBack.call(t,xmlhttp.responseText) ;
							  t.xmlObj=(xmlCache?xmlhttp:null);
								xmlhttp=null	 
							 }else{
							  if(typeOf(t.Err)=="function")t.Err.call(t)
								}
						break
						default:
							if(xmlhttp.status===404){
								t.error&&t.error();
								xmlhttp.abort()
								}						
						break 
						}

					  }
				  xmlhttp.onerror=function(){
					  console.log(arguments)
					  }	  
				  xmlhttp.send(t.data);
				  t.stop=function(){
					xmlhttp.abort()
					}						  
				};
	
			}	
		};	
	
	
	tt.noPop=function(e){
		if(e.preventDefault){
			e.preventDefault();e.stopPropagation()
			}else{e.returnValue=false;e.cancelBubble=true}
		};	
	}
/*extend结束了------------------------------------------------------*/	




$=function(arg,selector,tag,label){
	var _,D=document,o=(typeof(arg)=="string"?D.getElementById(arg):arg),sel=selector||0;
		switch(sel){
			case 0:
				_=o;
			break
			case 1:
				_=D.getElementsByName(arg)
			break
			case 2:
			if(D.getElementsByClassName){
				_=o.getElementsByClassName(tag)
				}else if(D.querySelector){
				_=o.querySelectorAll("."+tag)
				}else{
					var tags=o.getElementsByTagName(label?label:"*"),tl=tags.length,_=[],q=0,_tag,reg=new RegExp;
						reg.compile(t+"\\s"+t+"|"+t+"\\s|\\s"+t+"\\s","ig")
					for(var i=0;i<tl;i++){
						_tag=tags[i];
						if(_tag.className){
							_[q]=_tag;
							q+=1
						}
						reg.test()
					}
				}
			break
			case 3:
				switch(tag){
					case "checkbox":case "radio":case "number":case "range":
						var t=o.getElementsByTagName("input"),tl=t.length,i=0,_=[];
							for(;i<tl;i++){
								if(t[i].type==tag)_.push(t[i])
								}
							t=null;	
					break;
					default:
						_=o.getElementsByTagName(tag);
					break	
					}
			break
			}
	
		
	xdClass.apply(_);
	return _?_:null;
}


function typeOf(_){
			var a=typeof(_)
				if(a=="object"){
					if(_===null){
						a=null
					}else{		
						a=_.typeof||"DOM"
					}
				}
			return a
		};	
if(!window.JSON){
	window.JSON={
		parse:function(str){return eval("("+str+")")},
		stringify:function(obj,value){
			var i,str="",cont;
			for(i in obj){
				cont=obj[i];
				
			
				
				
				}
			return 
			}		
		}
	}	




function getAtt(_,att){
	return att=="class"?_.className:_.getAttribute(att)
	}

function delAtt(_,att){
	_.removeAttribute(att)
	}

function setAtt(_,att,val){
	if(typeOf(att)=="object"){
		for(var i in att){
			if(att.propertyIsEnumerable(i))
				Att(i,att[i])	
			}
		}else{	
			Att(att,val)
		}
	function Att(att,val){
			switch(att){
				case "style":_.style.cssText=val;break;
				case "class":_.className=val;break;
				case "html":_.innerHTML=val;break;
				default:_.setAttribute(att,val);break
			}
		}	
	};
	

function getProperty(_){
	var a={w:0,h:0,l:0,t:0};	
		a.w=_.offsetWidth
		a.h=_.offsetHeight
	do{
		a.l+=_.offsetLeft;
		a.t+=_.offsetTop;		
		}while(_=_.offsetParent)
	return a;	
	}



function getChildNodes(_,tag){
	var nodes=[],node=_.firstChild;
	if(tag){
		
		tag=tag.toUpperCase();
		while(node){ 
			if(tag==node.tagName)nodes.push(node);
			node=node.nextSibling;
		} 
	}else{
		
		while(node){ 
			if(node.tagName)nodes.push(node);
			node=node.nextSibling;
		} 
	}
		return (nodes==""?null:nodes); 	
	};
	

function getChild(_,tag,index){
	var node=index?_.lastChild:_.firstChild;
	if(tag){
		tag=tag.toUpperCase();
		while(node){
			if(node.tagName==tag)break
			node=index?node.previousSibling:node.nextSibling;
		}
	}else{
		while(!node.tagName ){			
			node=index?node.previousSibling:node.nextSibling;
		}
	}
		return node	||null
	}	


function swapNode(_,tag){
	var box1=_.parentNode,box2=tag.parentNode,
	p1=_.nextSibling,p2=tag.nextSibling;
	box1.insertBefore(tag,p1);
	box2.insertBefore(_,p2);
	}
	

function removeNode(_){
	var box=_.parentNode
	box.removeChild(_)
	
	}
	

function createNode(_,tag,type,position){
    
	var p=position||0; 
	var node=(typeof(tag)=="string"?DO.createElement(tag):tag);
		if(type)setAtt(node,type)
		switch(p){ 
			case "p1": 
				_.parentNode.insertBefore(node,_); 
				break; 
			case "p2": 
				_.insertBefore(node,_.firstChild); 
				break; 
			case "p3":
				_.appendChild(node)
				break; 
			case "p4":
				if(_.nextSibling)
					_.parentNode.insertBefore(node,_.nextSibling); 
					
				else 
					_.parentNode.appendChild(node); 
					
			break;
			default:
			var child=getChildNodes(_)
				if(child){
					if(child[p])_.insertBefore(node,child[p]); 
				}else{
				_.parentNode.insertBefore(node,_.nextSibling)
				}
			break
			 
		} 
	return node
	
 };


function cloneNode(_,b){
	return _.cloneNode(b)
	}


function createJS(_,content,type,p){
	var js=createNode(_,"script",type,p);
		js.text=content;
	}
	

function createLink(url,_){
	var link=DO.createElement("link")
		link.href=url;
		link.rel="stylesheet";
		_?_.appendChild(link):DD.firstChild.appendChild(link)
	}


function setJsonp(_,callback,action){	
	return new function(){
	var js=createNode(_,"script",null,"p3")
		,fun
		if(typeof(callback)==="function"){
			fun=window["F"+(new Date()).valueOf()]=callback
			}
		js.src=action;
	 js.onreadystatechange=js.onload=function(e){
		 var read=js.readyState
		 removeNode(js)	 
		 }
	js.onerror=err
	function err(status){
		removeNode(js)
		}
	}
}


function createSelect(box,opts,type,p){
	var sel=createNode(box,"select",type,p);
		if(typeOf(opts[0])!="object")opts=arr2opt(opts);
		for(var i=0,l=opts.length;i<l;i++){
			opt=opts[i];
			sel.options[i]=new Option(opt.v,opt.t)
		}
	return sel
	}


function setStyle(css,_){
	var sty=DO.createElement("style")
	sty.setAttribute("type","text/css");
	sty.styleSheet?sty.styleSheet.cssText=css:sty.innerHTML=css
	_?_.appendChild(sty):DD.firstChild.appendChild(sty);
}
	

function xmlObj(){
	try{
		return (new ActiveXObject("Msxml2.XMLHTTP")||new ActiveXObject('Microsoft.XMLHTTP'))
		}catch(e){
		return new XMLHttpRequest()
	}	
}


function noSelect(_,b){
var v=(b?["","",""]:[function(){return false},"on","none"]);
			_.onselectstart=v[0];
	if(typeOf(_)!="DOM")_=_.documentElement
	switch(browserN){
		case"opera":
			_.unselectable=v[1]
		break
		case"chrome":case"safari":
			_.style.WebkitUserSelect=v[2]
		break
		case"firefox":
			_.style.MozUserSelect=v[2]
		break
	}
	
};


function domain(str){
	var s=str||location.host;
		return s.replace(/[\w]\/.+|:[^\/].+/g,'')	
	}


function pageName(str){
		return unescape(str?str.replace(/^.*\/+|[?#].*/g,""):location.pathname.replace(/^.*\/+/g,""))
	}


function getSearch(name,str){
	var s=str||location.search
		,r=new RegExp(name+"=([^#&]+)","i"),result=s.match(r)||[]
		
	return result[1]
	}



function noContextMenu(_,b){
	_.oncontextmenu=function(){return (b?"":false)}
	};
	

function noCopy(_,b){
	_.oncopy=function(){return (b?"":false)}
	}
	

function rgb2hex(rgb,n){
	
	
	var str="",c;
		if(!n){
		rgb.replace(/(\d+)/g,function($1){
									   c=(+$1).toString(16);
									   
									   str+=($1<16?"0"+c:c)
									   
									  })
			str="#"+str						  
		}else{
			c=rgb.replace("#","")
			
			c.replace(c.length<6?/./g:/../g,function($1){
				str+=","+parseInt($1.length<2?$1+$1:$1,16).toString(10)
				})
			str="rgb("+str.substr(1)+")"
			}
		return str
	}
	

function trim(str){
	return str.replace(/^\s+|\s+$/g,"")
	}







function arr2opt(arr){
	for(var i=0,l=arr.length,opts=[],opt;i<l;i++){
		opt=arr[i]
		if(typeOf(opt)=="object")opt=JSON.stringify(opt) 
		opts[i]={v:opt,t:opt}
		}
		return opts
	}


function events(lists,evt,fun){
	var i=0,l=lists.length;
		for(;i<l;i++){
		(function(i){
			lists[i][evt]=function(e){	fun.call(this,e||event,i,lists.length)}			
			}(i))
	}
}




function getStyle(_,sty){
	return getStyleFun(_,sty)	
	}	
	

function createSylte(){
	var style=document.createElement("style")
	}






function flashPlayer(){
	var avo,v,ve;
	if(browserN=="msie"){
		try{
			avo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			v=avo.GetVariable("$version");
			ve=v.replace(/[a-z\s]/ig,"").split(",")
			}catch(e){
				ve=0
				}
	}else{
		var a=navigator.plugins["Shockwave Flash 2.0"],b=navigator.plugins["Shockwave Flash"];
		if(a||b){
			v=(b||a).description;ve=v.replace(/[a-z]/ig,"").replace(/^[\s]+/ig,"").match(/\d+/ig)
		}else{
			ve=0
		}
	}return ve
}
	
function versionComparison(a,b,c){
		var d=(typeOf(a)=="array"?a:a.match(/[a-z0-9A-Z]+/g));
		var f=b.toString().split("."),v=false,l=d.length,i=0,c=(c=="<"?0:1);
		
		for(i;i<l;i++){
			if(+d[i]>+f[i]){
				v=true;
				break
			}
		}
		return c?v:!v
	};	
function locusCount(p,S,E){
	var tem,s=S,e=E,_=[],i=-1;
		if(p<1){
		if(p<=0)return false
			for(;s!=e;){
				tem=p*(e-s)
				tem=(tem>0?Math.ceil(tem):Math.floor(tem)) 
				s+=tem;
				_[i+=1]=s;
			}
		}else{
			tem=Math.ceil((e-s)/p);
			if(e<s){
					for(;s>e;s+=tem){_[i+=1]=s}
				}else{
					for(;s<e;s+=tem){_[i+=1]=s}
				}
		};
		if(_[_.length-1]!=e)_.push(e)
			return _
	};	

function getObjWH(_,p){
		var wh={}
		if(typeOf(_)=="DOM"){
			wh={w:_.offsetWidth,h:_.offsetHeight}
		}else{
			wh.w=DD.scrollWidth;
		 	wh.h=Math.max(document.body.scrollHeight,DD.scrollHeight)		
		}
		
		 return wh[p]||wh
	 
	}	




function drag(_,run,B,ran){
/*     R:0\1 初始运行状态，默认为不可拖动
	   B:0\1\2 设置绑定鼠标键值，默认是0即鼠标左键
	  为了不导致对象拖动时失去焦点所以要定制全局鼠标变量
	   F:{DM:function(){}
	     DD:function(){}
		 DU:function(){}
		 }
	  ran:移动范围限定，默认为0即没有限定
	  ran:{L:left,
		  R:right,
		  T:top,
		  B:bottom
		  }   
	  */
	
			/*
				Fun	程序运行时触发的函数
				sX/sY  鼠标按下的位置
				eX/eY  鼠标移动时的实时位置
				oLeft/oTop 对象当前Left/Top的位置
				nLeft/nTop 对象需要停止的Left/Top位置
				ini: 初始化的一个值，限定
				DB.setCapture(false);DB.attachEvent("onlosecapture",DU)方法只使用一次,这个方法在this.DU()内
			*/
		var evtS,evtM,evtE,evtC="click",DO=document,Fun,sX=sY=eX=eY=oLeft=oTop=nLeft=nTop=0 
		 if(isTouch){evtS="touchstart";evtM="touchmove";evtE="touchend"}else{evtS="mousedown";evtM="mousemove";evtE="mouseup"}				
			  var T={B:B||0,range:ran||0
			  ,run:function(){
				  addEvent(_,evtS,oDD);
				  if(typeof(T.mRun)=="function")T.mRun.call(_)
			  }
			  ,stop:function(){
				  unBind();
				  if(typeof(T.mStop)=="function")T.mStop.call(_)
				  }
			  ,unBind:function(fun){
					unBind();
					T=null;
					if(typeof(fun)=="function")fun()
				  }
				}		
			,mRun,mStop,mDOWN,mUP
			
			,DM=function(e){				
				var ev=e,range=T.range,RA=range,sXP,eXP,sYP,eYP,x,y;
				if(typeOf(range)=="array"){
					RA=range[0]
					};
				if(isTouch){ev=e.touches[0]}	
					x=ev.pageX;y=ev.pageY
					eX=x-sX;eY=y-sY					
					nLeft=oLeft+eX,nTop=oTop+eY
										
					switch(RA){
						case "XY":
							
							sYP=range[1];eXP=range[2];eYP=range[3];sXP=range[4]

							if(nLeft<sXP)
								nLeft=sXP
							else if(nLeft>eXP)
								nLeft=eXP
							_.style.left=nLeft+"px"
							if(nTop<sYP)
								nTop=sYP
							else if(nTop>eYP)
								nTop=eYP
							_.style.top=nTop+"px"				
							
						break;
						case "X":
							sXP=range[1];eXP=range[2];
							if(nLeft<sXP)
								nLeft=sXP
							else if(nLeft>eXP)
								nLeft=eXP
							_.style.left=nLeft+"px"
						break
						case "Y":
							sYP=range[1];eYP=range[2];
							if(nTop<sYP)
								nTop=sYP
							else if(nTop>eYP)
								nTop=eYP
							_.style.top=nTop+"px"
						break
						default:
					
						_.style.left=nLeft+"px"
						_.style.top=nTop+"px"
						break
					}	
					if(typeof(T.mMOVE)=="function")T.mMOVE.call(_,e,eX,eY,nLeft,nTop)
					noPop(e)
					return false
			}
		
			
			,DU=function(e){
				
				if(DA)DB.releaseCapture();
					
					unEvent()
					if(typeof(T.mUP)=="function")T.mUP.call(_,e)
					noSelect(DB)
			}
	
			
			,DD=function(e){
				var ev=e
				if(isTouch){ev=e.touches[0]}
				sX=ev.pageX;sY=ev.pageY
				
				if(DA){
					T.ini=0
				
				
				
					DB.setCapture(false)
					
				}else{
				
					window.getSelection().removeAllRanges()
				}
				
				
				noPop(e)
				return false
			}
	
		
			,oDD=function(e){
				if(mouseButton(e)==T.B){
					oLeft=_.offsetLeft
					oTop=_.offsetTop
					_.style.position="absolute"
					
					addEvent(DO,evtE,DU)
					addEvent(DO,evtM,DM)
					addEvent(DO,evtS,DD)
					noSelect(DB,1)
					
					if(typeof(T.mDOWN)=="function")T.mDOWN.call(_,e)
				}
			}	
			
			function unEvent(){
				delEvent(DO,evtS,DD);
				delEvent(DO,evtM,DM);
				delEvent(DO,evtE,DU);
			}
			
			function unBind(){
				unEvent()
				delEvent(_,evtS,oDD);
				}
	
			if(run)T.run()	
			
			
			return T
	 
};











function splitType(e,cl){
	var i,s="",sp=cl||"\n",num=1;
	for(i in e){
		switch(i){
			case "outerHTML":case"innerHTML":case "textContent":case "outerText":
				s+=cl+(num++)+"."+i+"..内容"
			break
			default:
				s+=cl+(num++)+"."+i+".."+e[i]
			break
			}
		
		}
	return s	
};	
function domLoaded(fun){
		addEvent(DO,"DOMContentLoaded",fun)
	}
function domReady(dom,fun){
	var i=0,time=setInterval(function(){
		if((i++)>5000){alert(dom+"加载超时或失败");
			clearInterval(time);
			}
		if(eval(dom)){
			clearInterval(time);			
			fun();
			arguments[0]=null;arguments[1]=null
			}		
		},1)	
	}
function mouseWheel(_,fun,speed){
	 var T=this,_=_,count=0;T.rFun=fun||Function;
		
		 T.speed=(isNaN(speed)?3:speed);
		 var Fun=function(e){
			var p={}
			 if(count>T.speed){
				 count=0
				 p.s=e.detail||-(e.wheelDelta) 
				 p.k=(p.s>0?1:-1)
				 T.rFun.call(p)
				 noPop(e)			 
				 return false
			}
			count+=1
		 }	
		 var Eve=(browserN=="FF"?"DOMMouseScroll":"mousewheel");	 
		 T.run=function(){addEvent(_,Eve,Fun)}	 
		 T.stop=function(){delEvent(_,Eve,Fun)}
		 return T
 };	

function createFlash(_,type,parme,ver,err,pos,boxType){
	var v1=flashPlayer(),ver=ver||0,htm,p="",plug=DA?"classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' ":"type='application/x-shockwave-flash' ";
	if(v1){
		if(versionComparison(v1,ver)){
			if(typeOf(type)=="object"){
				var attribute="";
				for(var i in type){
					if(type.propertyIsEnumerable(i)){
						attribute+=i+"='"+type[i]+"' "
						}
					}
				}

				if(typeOf(parme)=="object"){
					for(var e in parme){
						if(parme.propertyIsEnumerable(e)){
							p+='<param name="'+(e=="src"?"movie":e)+'" value="'+parme[e]+'">';
							};
						}
					}				
				htm='<object '+plug+attribute+'>'+p+'<param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="quality" value="high" /></object>'

			var div=createNode(_,"div",{html:htm},pos);
			var swf=div.childNodes[0];
			if(boxType){
				setAtt(div,boxType)
				setAtt(div,boxType)
			}else{
				div.parentNode.insertBefore(swf,div)
				div.parentNode.removeChild(div)					
			}
				return swf
		}else{
			htm=str.b()||""
			}
	}else{
		htm=str.a()||""
	}

} 
//function getSearch(str){
//	var s=str||location.search.substr(1),arr=(s&&s.split("&"))||[],arrL=arr.length,i=0,key=null,v=null,a=null,o={};
//		if(arrL)for(;i<arrL;i++){
//			a=arr[i].split("=")
//			o[a[0]]=a[1]	
//			};			
//		return o			
//	};
	
function cookieSet(key,val,time,tPath,tDomain){
	var d=new Date(),t
	switch(time){
	case 1:t=86400;break;
	case 2:t=2678400;break;
	case 3:t=32140800;break;
	case 4:t=1000000000;break;
	default :t=time}
	d.setTime(d.getTime()+(t*1000));
	var expires=(t?"; expires="+d.toGMTString():"");
	var path=(tPath?"; path="+tPath:"");
	var domain =(tDomain?"; domain="+tDomain:"");
	console.log(escape(key)+"="+escape(val)+expires+path+domain)
	DO.cookie=escape(key)+"="+escape(val)+expires+path+domain
 };	 
 

function cookieGet(key){
	 var V=document.cookie
	 var Reg1=new RegExp("\\b"+key+"=[^;]+","g");
	 var Reg2=new RegExp("\\b"+key+"=","g");
	 var k=V.match(Reg1)
	 if(!k)return "null"
	 var val=k.toString().replace(Reg2,"")
	 
	 return unescape(val)
 };


function cookieDel(key,path,domain){
	var a1=path,a2=domain;
	var expires="; expires="
	var path=(a1?"; path="+a1:"");
	var domain=(a2?"; domain="+a2:"");
	DO.cookie=escape(key)+"=null"+expires+path+domain
 };	

function mouseButton(e){var k=e.button;if(e.button==undefined)return 0;return browserN=="msie"?[0,0,2,3,1][k]:k};
extend.apply($)	
$$&&(window[$$]=$);
})("$");
