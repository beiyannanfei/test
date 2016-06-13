/*
事件中心
*/
function xdEventFun(options){
	var _options=options||{}
		,t=this
		,isTouch=('ontouchstart' in window)
		,MES="mousedown",MEM="mousemove",MEE="mouseup"
		,TES="touchstart",TEM="touchmove",TEE="touchend"
		,CLICK="click"
		,_dragObj 		//可拖动的对象
		,_isDrag		//可拖动变量
		,startY,endY
		,isMove=null
		,isDownMove=null
		,_winW=window.innerWidth,_winH=window.innerHeight
		,_left,_top,_width,_height,_maxLeft,_maxTop
		,_X=0,_Y=0
		,_x=0,_y=0
		
		,_action=_options.action||"action"
		
		,getEvent=function(e){
			return (e.touches&&e.touches[0])||e
		}
		,getTouchType=function(e){
				return (e.touches&&e.changedTouches[0])||e
		}
		,DO=document,sX=sY=eX=eY=oLeft=oTop=nLeft=nTop=0,mRun,mStop,mDOWN,mUP
		;	
		
		t.eventDown=_options.eventDown||function(){}
		t.eventMove=_options.eventMove||function(){}
		t.eventUp=_options.eventUp||function(){}		
		t.eventClick=_options.eventClick||function(){}
		t.eventEnd=_options.eventEnd||function(){}
		
		function unEvent(){
			delEvent(DO,TES,DD);
			delEvent(DO,TEM,DM);
			delEvent(DO,TEE,DU);
			delEvent(DO,MES,DD);
			delEvent(DO,MEM,DM);
			delEvent(DO,MEE,DU)
		}			
		function unBind(){
			unEvent()
			delEvent(_,TES,oDD);
			delEvent(_,MES,oDD);
		}
	t.handleEvent=function(e){
		var ele=e.srcElement||e.target;
			switch(e.type){
				case TES:case MES:	
					var attribute,argument,action;				
					do{
						if(ele.nodeType!==1)return false
						if(attribute=ele.getAttribute(_action))break			
						}while(ele=ele.parentNode)	
					if(!attribute)return false;										
					argument=attribute.split(".,");
					action=argument[0];
					isMove=action==="drag"?1:0;//判断是否有拖动的标识
					
					if(isMove){
						_isDrag=true;
						var p;
						_dragObj=document.getElementById(argument[1]);
						p=_dragObj.getBoundingClientRect()
						_left=p.left;
						_top=p.top;
						_width=p.width;
						_height=p.height;
						_maxLeft=_winW-_width;
						_maxTop=_winH-_height;
						touchStart(e)
						;
					}else{
						var eB=e.button;
						if(typeof(eB)==="number")
							eB===0&&eventDown(argument,ele,e)
						else
							eventDown(argument,ele,e)
					}
				break
				case TEM:case MEM:				
					(_isDrag&&isMove&&touchMove(e))||eventMove(ele,e)					
				break
				case TEE:case MEE:
					(isMove&&touchEnd(e))||eventUp(ele,e)
				break
				case CLICK:
					eventClick(ele,e)
				break
				}
			}
//		addEvent(document,TES,t,false);
//		addEvent(document,TEM,t,false);
//		addEvent(document,TEE,t,false);	
		addEvent(document,MES,t,false);
		addEvent(document,MEM,t,false);
		addEvent(document,MEE,t,false);		
	   addEvent(document,CLICK,t,false);
//if(navigator.userAgent.toLowerCase().indexOf("window")<0){		
//	}
//document.ondragstart=function(e){noPop(e)};	


/*事件中心=========================================*/

//触发事件===============================================		
function touchStart(e){			
	var ev=getEvent(e);					
		_X=ev.pageX;
		_Y=ev.pageY;				
		noPop(e)
		return false
}
//移动事件===============================================
function touchMove(e){	
	var ev=getEvent(e)
		,pageX=ev.pageX
		,pageY=ev.pageY
		,distX=pageX-_X
		,distY=pageY-_Y
		,top=_top+distY
		,left=_left+distX			
		,sty=_dragObj.style;
		sty.left=(left<0?0:left>_maxLeft?_maxLeft:left)+"px";
		sty.top=(top<0?0:top>_maxTop?_maxTop:top)+"px";	
}
//结束事件================================================		
function touchEnd(e){
	_isDrag=null;
	window.getSelection().removeAllRanges();
	noPop(e);
	return false
}	
//按下事件=================================================	
function eventDown(argument,ele,e){
	t.eventDown(argument,ele,e)
	}
	
//移动事件================================================	
function eventMove(ele,e){
	var attribute,argument;				
	do{
		if(ele.nodeType!==1)return false
		if(attribute=ele.getAttribute(_action))break			
		}while(ele=ele.parentNode)	
	if(!attribute)return false;										
	argument=attribute.split(".,");
	t.eventMove(argument,ele,e)
	}
	
//点击事件================================================	
function eventClick(ele,e){
	var attribute,argument;				
	do{
		if(ele.nodeType!==1)return false
		if(attribute=ele.getAttribute(_action))break			
		}while(ele=ele.parentNode)	
	if(!attribute)return false;										
	argument=attribute.split(".,");
	t.eventClick(argument,ele,e)
	}	
	
//弹起事件=================================================	
function eventUp(ele,e){
	t.eventUp(ele,e)
	}	

function addEvent(_,Eve,Fun,b){_.addEventListener(Eve,Fun,b||false)};
function delEvent(_,Eve,Fun,b){_.removeEventListener(Eve,Fun||null,b||false)};
function noPop(e){e.preventDefault();e.stopPropagation()};		
}