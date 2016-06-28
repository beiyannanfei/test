$(function(){
		for(var i = 5;i<20;i++){
		$('.menu li.li0').find('dl').eq(i).addClass('h')
		$('.menu li.li2').find('dl').eq(i).addClass('h')
	}
	//$('#search').focus(function(){if($(this).val() =='Search'){$(this).val('').attr('style','color:#797979')}return false});
	//$('#search').blur(function(){if($(this).val() ==''){$(this).val('Search').removeAttr('style')}return false});
	//$('#search2').focus(function(){if($(this).val() =='请输入关键词'){$(this).val('').attr('style','color:#797979')}return false});
	//$('#search2').blur(function(){if($(this).val() ==''){$(this).val('请输入关键词').removeAttr('style')}return false});
	$('.menu>li').hover(function(){$(this).addClass('hover');$(this).find('div.b').show()},function(){$(this).removeClass('hover');$(this).find('div.b').hide()});
	$('.case_box').eq(0).show().find('.case').eq(0).show();
	$('.success_input select').change(function(){
		var selectID = $('.success_input select').index(this);									   
		var optionID = $(this).parents('div').find('select option').index($(this).find('option:selected'));
		$('.case_box').hide().find('.case').hide();
		$('.case_box').eq(selectID).show().find('.case').eq(optionID).show();
	});
	$('.country_btn').live('click', function() {
        $('#win').fadeTo(500,0.5);
        $('#win').css('height', $('body').height());
        $('.close').fadeIn();
		$('.country').fadeIn();
    });
    $('#colse,#win,.close').live('click', function() {
        $('.close').fadeOut();
		$('.country').fadeOut();
        $('#win').fadeTo(500,0).hide();
    });
	$('#Map area').hover(function(){
		var index = $('#Map area').index($(this)) + 1;
		$('.Img').attr('src','/gbcn/images/map_0'+index+'.gif');
	},function(){
		$('.Img').attr('src','/gbcn/images/map01.gif');
	});
	$('#Map2 area').hover(function(){
		var index = $('#Map2 area').index($(this)) + 1;
		$('.globalImg').attr('src','/gbcn/images/global_0'+index+'.gif');
	},function(){
		$('.globalImg').attr('src','/gbcn/images/global.jpg');
	})
	$('.global_sales_offices .index a').live('click',function(){$('.global_sales_offices .index a').removeClass('hover');$(this).addClass('hover')});	
	$('.countryName dl dt a').live('click',function(){
		var IsClikked = $(this).attr('isclicked');
		if(IsClikked == '1')
		{
			return;
		}else{
			$('.countryName dl dt a').attr('isclicked','0');
			$(this).attr('isclicked','1');
			$(this).parents('.countryName').find('dt').removeClass('focus').find('a').removeClass('hover');
			$(this).addClass('hover').parents('dt').addClass('focus');
			var indexcountry = $(this).parents('dl').find('dt a').index(this);
			$(this).parents('.countryName').find('dd').slideUp();
			$(this).parents('dl').find('dd').eq(indexcountry).slideDown();
		}
	});
	$('.countryName a.btn').live('click',function(){
		$(this).parents('.countryName').find('dd').slideUp();
		$(this).parents('.countryName').find('dt').removeClass('focus').find('a').removeClass('hover');
		$('.countryName dl dt a').attr('isclicked','0');
		
	});
	$('.info_intro .btn').toggle(function(){
		$(this).parents('.info_intro').find('.intro1').hide().end().find('.intro2').show();
		$(this).html('收起>>');
	},function(){
		$(this).parents('.info_intro').find('.intro2').hide().end().find('.intro1').show();
		$(this).html('详细>>');
	})

$(function(){
var _len = $('.side_history li').length;
var _h = _len*32
if(_len>4){
 $('.side_history li').eq(4).after('<a href="#1" class="history_btn fr">更多>></a>')
};
$('.history_btn').bind('click',function(){
 $(this).remove();
 $('.side_history').animate({height:_h})
})
})

	$(".video_srcoll div ul li").live('click',function(){
		$(".video_srcoll div ul li.focus").removeClass('focus');
		$(this).addClass('focus');
		var _tit = $(this).find('img').attr('rel1');
		var _text = $(this).find('img').attr('rel2');
		$('.videoText strong a').empty().append(_tit);
		$('.videoText p.pt10').empty().append(_text);
		$('.videoShow a').attr('href',''+$(this).find('img').attr('rel')+'').find('img').attr('src',''+$(this).find('img').attr('src')+'')
	})
	$(".sub_journal .div div").jCarouselLite({btnNext: ".sub_journal .div .next",btnPrev: ".sub_journal .div .prev",visible:1,speed:500,circular:false});
	$(".video_srcoll div").jCarouselLite({btnNext: ".video_srcoll .next",btnPrev: ".video_srcoll .prev",visible:4,speed:500,circular:false});
});