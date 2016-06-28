function createPageHTML(_nPageCount, _nCurrIndex, _sPageName, _sPageExt){
	if(_nPageCount == null || _nPageCount<=1 || _nCurrIndex>=_nPageCount){
	return;
	}



	var news_line = "<td height=1 background=../../images/news_linebg.gif></td>";//浅线
	var nCurrIndex = _nCurrIndex || 0;
	var firstPage = "<td><table width=55 border=0 cellpadding=0 cellspacing=0><tr> <td width=11><img src=/pub/gbcn/images/ico43.gif width=11 height=12></td><td width=24><a href=\""+_sPageName+"."+_sPageExt+"\" class=page target=_self>首页</a></td></tr></table></td>";
	var nextPage = "<td><table width=67 border=0 cellpadding=0 cellspacing=0><tr> <td width=11><img src=/pub/gbcn/images/ico45.gif width=11 height=12></td><td width=36><a href=\""+_sPageName+"_"+(nCurrIndex+1)+"."+_sPageExt+"\" class=page target=_self>下一页</a></td></tr></table></td>";
	var prePage = "<td><table width=67 border=0 cellpadding=0 cellspacing=0><tr> <td width=11><img src=/pub/gbcn/images/ico44.gif width=11 height=12></td><td width=36><a href=\""+_sPageName+"."+_sPageExt+"\" class=page target=_self>上一页</a></td></tr></table></td>";
	var prePage_1 = "<td><table width=67 border=0 cellpadding=0 cellspacing=0><tr> <td width=11><img src=/pub/gbcn/images/ioc44.gif width=11 height=12></td><td width=36><a href=\""+_sPageName+"_"+(nCurrIndex-1)+"."+_sPageExt+"\" class=page target=_self>上一页</a></td></tr></table></td>";
	var lastPage = "<td><table width=55 border=0 cellpadding=0 cellspacing=0><tr> <td width=11><img src=/pub/gbcn/images/ico46.gif width=11 height=12></td><td width=24><a href=\""+_sPageName+"_" +(_nPageCount-1)+"."+_sPageExt+"\" class=page target=_self>尾页</a></td></tr></table></td>";
	var firstPage_off = "<td><table width=55 border=0 cellpadding=0 cellspacing=0><tr> <td width=11><img src=/pub/gbcn/images/ico43.gif width=11 height=12></td><td width=24><a href='javascript:void(0)' class=page>首页</a></td></tr></table></td>";
	var nextPage_off = "<td><table width=67 border=0 cellpadding=0 cellspacing=0><tr> <td width=11><img src=/pub/gbcn/images/ico45.gif width=11 height=12></td><td width=36><a href='javascript:void(0)' class=page>下一页</a></td></tr></table></td>";
	var prePage_off = "<td><table width=67 border=0 cellpadding=0 cellspacing=0><tr> <td width=11><img src=/pub/gbcn/images/ico44.gif width=11 height=12></td><td width=36><a href='javascript:void(0)' class=page>上一页</a></td></tr></table></td>";
	var lastPage_off = "<td><table width=55 border=0 cellpadding=0 cellspacing=0><tr> <td width=11><img src=/pub/gbcn/images/ico46.gif width=11 height=12></td><td width=24><a href='javascript:void(0)' class=page>尾页</a></td></tr></table></td>";
	

　　if(parseInt(_nPageCount)>=1){
		//alert(_nPageCount);
		document.write(news_line);
	}　
	document.write("<td width=244 height=14><span class=title>总共</span><span class=title_text>"+_nPageCount+"</span><span class=title>页&nbsp;</span><span class=title>当前第</span><span class=title_text>"+(nCurrIndex+1)+"</span><span class=title>/</span><span class=title_text>"+_nPageCount+"</span><span class=title>页&nbsp;&nbsp;</span></td> ");
    document.write('<td align="right"><table border="0" cellspacing="0" cellpadding="0"><tr>');
	if(nCurrIndex == 0)
	{
		document.write(firstPage_off);
		document.write(prePage_off);
		document.write(nextPage);	
		document.write(lastPage);
			document.write("<td><select name=\"select\" style=\"margin-bottom:-3px;\" onchange=\"location.replace(this.value)\">");
			document.write("<option selected >跳至</option>");
			for(var i=0; i<_nPageCount; i++)
			{
			if(i==0)
			document.write("<option value=\""+_sPageName+"."+_sPageExt+"\">1</option>");
			else
			document.write("<option value=\""+_sPageName+"_" + i + "."+_sPageExt+"\">"+(i+1)+"</option>");
			}
			document.write("</select></td>");
		
	}
	else
		if(nCurrIndex==(_nPageCount-1))
		{
			document.write(firstPage);
			if(_nPageCount==2) {
                            document.write(prePage);
                        }
			else {
                            document.write(prePage_1);
                        }
			document.write(nextPage_off);
			document.write(lastPage_off);
		}
		else
		{
			document.write(firstPage);
			if(nCurrIndex==1) {
                            document.write(prePage);
                        }
			else {
                            document.write(prePage_1);
                        }
			document.write(nextPage);
			document.write(lastPage);
			
			document.write("<td><select name=\"select\" style=\"margin-bottom:-3px;\" onchange=\"location.replace(this.value)\">");
			document.write("<option selected >跳至</option>");
			for(var i=0; i<_nPageCount; i++)
			{
			if(i==0)
			document.write("<option value=\""+_sPageName+"."+_sPageExt+"\">1</option>");
			else
			document.write("<option value=\""+_sPageName+"_" + i + "."+_sPageExt+"\">"+(i+1)+"</option>");
			}
			document.write("</select></td>");
			
	}
        document.write('</tr></table></td>');

	
}
