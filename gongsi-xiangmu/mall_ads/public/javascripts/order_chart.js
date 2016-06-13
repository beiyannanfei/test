$(function(){
	$('#data').focus(function () {
        WdatePicker({dateFmt: 'yyyy-MM-dd'});
    })

    $('#data').blur(function () {        
        var day = $(this).val();
        if (day){
        	loadTime(day);
        }
    })


	var userMap = {}
    $('#time').change(function(){
    	var id = $(this).find('option:selected').val()
        ajaxData(id)
    })

    function bindEvent($dom){
    	$('.lottery', $dom).click(function(){
    		$('.pop_cnt').show()
    		var id = $(this).attr('id')
    		var users = userMap[id]
    		var html = ''
    		$.each(users,function(i,v){
    			html += '<li>'+
           				'<img src="' + v.icon + '/64' + '">'+
           				'<p class="message">' + v.name + '</p>'+
           				'</li>'
    		})
    		$('.info1').html(html)
    	})
    }

    $('#wrong').click(function(){
    	$('.pop_cnt').hide()
    })
    $('#save').click(function(){
    	$('.pop_cnt').hide()
    })
    $('.close').click(function(){
    	$('.pop_cnt').hide()
    })

    function ajaxData(id){
        $.ajax({
            url:'/admin/orderCount/prizeList?args='+id,
            type:'GET',
            beforeSend:function(){
                $('.load').show()
            },
            success:function(data){
                $('.load').hide()
                $('#total').text('奖品总数：'+data.data.info.totalPrize)
                $('#money').text('金额总数：'+data.data.info.totalMoney)
                var html = '';
                var chartMessage = $('#chart_message');
                var message = data.data.info;
                $.each(message.prize,function(i,v){
                    html += '<tr>'+
                            '<td>' + v.name + '</td>'+
                            '<td>' + v.num + '</td>'+
                            '<td>' + v.money + '</td>'+
                            '<td>' + (v.users.length) + '</td>'+
                            '<td>'+
                            '<button class="btn btn-success lottery" id="' + i +'">中奖名单</button>'+
                            '</td>'+
                            '</tr>';

                    userMap[i] = v.users


                })
                var $dom = $(html)
                chartMessage.empty().append($dom)
                bindEvent($dom)
            }
        })
    }

    function loadTime(day){
    	$.ajax({
        	url:'/admin/orderCount/timelist?day='+day.toString(),
        	type:'GET',
            beforeSend:function(){
                $('.load').show()
            },
        	success:function(data){
                $('.load').hide()
        		if (data.data.info.length == 0) {
        			$('#time').html('');
        			return alert('该日期没有时间段')
        		} else {
        			var html = '';
        			$.each(data.data.info,function(i,v){
        				var startTime = v.startTime
        				var endTime = v.endTime
        				var time = startTime + '-' + endTime
        				html += '<option value="' + v._id + '">' + time + '</option>'
        			})
        			$('#time').html(html)
                    var id = $('#time').find('option:selected').val()
                    ajaxData(id)
        		}
        	}
        })
    }
})