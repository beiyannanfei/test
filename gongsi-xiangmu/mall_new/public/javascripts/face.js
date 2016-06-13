// JavaScript Document
self.xdDialog.contentData={type:"text",mid:" "};
function aa(){var a=0;};
$(function(){

/*选择工具*/
$(".mass_area_top li").hover(function(){
	$(this).find("div").show();
	$(this).siblings().find("div").hide();
	},function(){
		$(this).find("div").hide();
		});
var frame= $("<iframe id='ttimg' name='ttimg' src='ys.htm' contenteditable='true' width='100%' height='100%' style='padding:0;'></iframe>");
$(".mass_area_top li").on('click',function(e){
	var frmUrl = [
	    "",
		"popup_tw.htm"
	];
 	
    var num = $(this).index();
	if(num==0){
		$(".area_con_t").css("height","200px").html('');$(".area_con_b").show();
		self.xdDialog.contentData={mid:" ",type:"text"}
	}else if(num == 1 || num==2){
		var frmUrl_ = '<iframe src="'+frmUrl[num]+'" width="100%" height="100%">';
		
		self.xdDialog.open({
			html:frmUrl_,
			style:"width:960px;height:600px;overflow:hidden",
			title:"hidden"
		})
		$(".area_con_t").css("height","236px").html('')
		$(".area_con_t").append(frame);
		$(".area_con_b").hide();
		
	}   
})

$(".mass_area_top .txt").click(function(){
	$(this).find("i").css("background-position","0 -28px");
	$(".mass_area_top .mage-text").find("i").css("background","urlimg/area_ico.png) 0 -359px");
});	

$(".mass_area_top .mage-text").click(function(){
	  $(this).find("i").css("background","url(img/area_ico.png) 0 -389px");
	  $(".mass_area_top .txt").find("i").css("background","url(img/area_ico.png) 0 2px");
});	
// 接受数据
self.xdDialog.getValue=function(data){
	ttimg.document.body.innerHTML='';
	if(data==''){
	ttimg.document.body.innerHTML=data;
	}
	else{ttimg.document.body.appendChild(data);}
	}


/*表情*/
var ulFace=document.getElementById("area_con_text").getElementsByTagName("li");
function face(){
	for(var i=0;i<ulFace.length;i++){
		var len=-(i*24)+'px';
	   ulFace[i].style.backgroundPositionX=len;
	   ulFace[i].setAttribute("index",i);
		}
	}
face();
/*显示表情*/
faceButton.onclick=function(){
	faceBox.style.display="block";
	return 
	};
faceList.addEventListener("mouseover",function(e){
	var ele=e.srcElement; 
	if(ele.tagName==="LI"){
		index=ele.getAttribute("index")
		theFace.src="img/"+index+".gif";
		ele.onclick=function(){
			var img=new Image();
			img.src=theFace.src;
			edit.appendChild(img)
			}
	}
})
$(document).click(function(e){
	var target=$(e.target);
	if(!target.is("#review .area_con_b a")){
		$(window).find(".face").hide();
		}
	})

  $(document).click(function(e){
	var target=$(e.target);

	if(!target.is(".target_show")){
		$(".target_uni ul").hide();
		}
 })	
})