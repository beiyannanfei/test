function check(){
	 var strkey=$.trim($("#searchKey").val());
	 if(strkey=="请输入关键词" || strkey==""){
		 alert("请输入关键词");
		 return false;
	 }
	 if(strkey){
		var reg=new RegExp('([()\\[\\],/@=><!&\]+)','img');
		 if( reg.test(strkey) ){
			alert("检索词中包含特殊运算符");
			return false;
		}
		strkey = strkey.replace("\'","\\'");
		var str="doctitle/5,doccontent/3 +='"+$.trim(strkey) + "'";
		 $("#searchword").val(str);
		 return true;
	 }
}

function keydown(){
  var strkey=$.trim($("#searchKey").val());
  if (event.keyCode == 13 && strkey && strkey!="请输入关键词")check();
}


function check2(){
	 var strkey=$.trim($("#searchKey2").val());
	 if(strkey=="请输入关键词" || strkey==""){
		 alert("请输入关键词");
		 return false;
	 }
	 if(strkey){
		var reg=new RegExp('([()\\[\\],/@=><!&\]+)','img');
		 if( reg.test(strkey) ){
			alert("检索词中包含特殊运算符");
			return false;
		}		
		strkey = strkey.replace("\'","\\'");
		var str="doctitle/5,doccontent/3 +='"+$.trim(strkey) + "'";
		var selectedChnl=$("#chnlname").val();
		 if(selectedChnl){
			if(selectedChnl=="%cndata/magazine%"){
				str = " docpuburl='"+selectedChnl+"' and " + str;
			}else{
				str = " chnlname='"+selectedChnl+"' and " + str;
			}
		 }
		 $("#searchword2").val(str);
		 return true;
	 }
}
function keydown2(){
  var strkey=$.trim($("#searchKey2").val());
  if (event.keyCode == 13 && strkey && strkey!="请输入关键词")check2();
}



function advcheck(){
	 var strkey=$.trim($("#searchKey3").val());
	 if(strkey=="请输入关键词" || strkey==""){
		 alert("请输入关键词");
		 return false;
	 }
	 if(strkey){
		var reg=new RegExp('([()\\[\\],/@=><!&\]+)','img');
		 if( reg.test(strkey) ){
			alert("检索词中包含特殊运算符");
			return false;
		}
		strkey = strkey.replace("\'","\\'");
		 var strSql="";
		 var strArr=[];

		 //1、日期
		 var dateSql = "";
		 var selectType = $("input[name='dateType']:checked").val();
		 switch(selectType){
			 case "0":
						break;
			 case "1":
						var now=new Date();
						var pp=0;
						var kk=0;
						var selectNo=$("select[name='selectdate'] option:selected").val();
						pp=now.getTime()-selectNo*1000*60*60*24;
						kk=new Date(pp);
						var startime=kk.getFullYear()+"."+(kk.getMonth()+1)+"."+kk.getDate();
						var endtime=now.getFullYear()+"."+(now.getMonth()+1)+"."+now.getDate();
						dateSql = "DOCRELTIME="+startime+ " to "+endtime;
						break;
			 case "2":
						var startime = $("#StartTime").val();
						var endtime = $("#EndTime").val();
						if(startime && endtime  && endtime<startime){
							alert("结束时间不能小于开始时间");
							return false;
						}
						if(startime && endtime && endtime>= startime)
							dateSql = "DOCRELTIME="+startime+ " to "+endtime;
						break;
			 default:
						break;
		 }

		//3、栏目
		var selectedChnls=[];
		 var chnlname="";
		 var puburl="";//期刊须特殊处理
		 var chnlnameArr = [];
		 var ncount=0;
		 $("input[name='chnlname']:checked").each(function(){
			 ncount++;
			 if($(this).val()!="%cndata/magazine%")
				chnlnameArr.push($(this).val());
			 else
				puburl = "docpuburl='" + $(this).val() + "'";
		 });
		 if(chnlnameArr.length>0){
			chnlname = "chnlname=("+chnlnameArr.join(",")+") ";
		 }


		 
		//3、检索字段
		 var seafield = "";
		 var fieldArr = [];
		 $("input[name='searchfield']:checked").each(function(){
			fieldArr.push($(this).val());
		 });
		 if(fieldArr.length>1){
			seafield = fieldArr.join(",") + "+='"+$.trim(strkey) +"'";
		 }else if(fieldArr.length==1){
			seafield = fieldArr.join(",") + "='"+$.trim(strkey) + "'";
		 }else{ 
			seafield = "doctitle/5,doccontent/3+='"+$.trim(strkey) +"'";
		 }


		 if(dateSql)strArr.push(dateSql);

		 if(ncount>0 && ncount<7){//排除全选或不选情况
			  if(chnlnameArr.length>0){
				selectedChnls.push(chnlname);
			  }
  			  if(puburl!=""){//期刊须特殊处理
				selectedChnls.push(puburl);
			  }

			  if(selectedChnls.length>0)
				strArr.push(selectedChnls.join(" or "));
		 }


		 strArr.push(seafield);

		 $("#searchword3").val(strArr.join(" and "));
		 return true;
	 }
}
function keydown3(){
  var strkey=$.trim($("#searchKey3").val());
  if (event.keyCode == 13 && strkey && strkey!="请输入关键词")advcheck();
}