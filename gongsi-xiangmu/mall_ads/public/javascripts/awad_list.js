$(function(){
	var status = true;
	$.ajax({
		url:'/admin/prize/list?needCount=1',
		type:'GET',
		success:function(data){
			if (data.code == 200) {
				var domString = '',
					information = data.data,
					type,
					$parent = $('#awad_list');
				$.each(information,function (i,v) {
					if (v.type == 1) {
						type = '实物'
					} else if(v.type == 2){
						type = '消费码'
					} else if(v.type == 3){
						type = '第三方卡券（url）'
					} else if(v.type == 101){
						type = '微信卡券'
					} else if(v.type == 102){
						type = '微信红包'
					}
					domString += '<tr id="' + v._id + '">'
					domString += '<td>' + v.name + '</td>'+
								 '<td><p><img src="' + v.pic + '"></p></td>'+
								 '<td>' + type + '</td>';
					if ( v.type == 102 ) {
						domString += '<td>-------------------</td>'
					} else {
						domString += '<td>' + v.count + '</td>'
					}
					if (v.type == 102 || v.type == 101) {
						domString += '<td><span class="delete">删除</span><span class="message">中奖信息</span></td>'
					}

					if (v.type == 1 || v.type == 3 || v.type == 2) {
						domString += '<td><span class="edit">编辑</span><span class="delete">删除</span><span class="message">中奖信息</span></td>'
					}

					domString += '</tr>'
				})
				$parent.html(domString)
				$('.delete',$parent).click(function(){
					var id = $(this).closest('tr').attr('id')
					deleteData(id)
				})
				$('.message',$parent).click(function(){
					var id = $(this).closest('tr').attr('id')
					window.location.href = '/admin/page/orderList?id='+id
				})
				$('.edit',$parent).click(function(){
					var id = $(this).closest('tr').attr('id')
					window.location.href = '/admin/page/add-award?id='+id
				})
			}
		}
	})
	
	/*function createPage(pageSize, buttons, total) {
	    $(".pagination").jBootstrapPage({
	        pageSize : pageSize,
	        total : total,
	        maxPageButton:buttons,
	        onPageClicked: function(obj, pageIndex) {
	            var page = pageIndex;
	            loadGoods(page)
	            status = false;
	        }
	    });
	}*/

	$('#release').click(function(){
		window.location.href = '/admin/page/add-award'
	})

	$('#cardManage').click(function(){
		window.location.href = '/admin/page/card-list'
	})

	function deleteData(id){
		swal({
		    title: "确定要删除活动吗？",
		    text: "删除后不能撤销，请慎重考虑",
		    type: "warning",
		    showCancelButton: true,
		    confirmButtonColor: "#DD6B55",
		    confirmButtonText: "确定",
		    cancelButtonText: "取消",
		    closeOnConfirm: false,
		    closeOnCancel: true },
		function (isConfirm) {
		    if (isConfirm) {
		       $.ajax({
		           type: 'DELETE',
		           url: '/admin/prize/' + id,
		           success: function(data){
		               $('tr[id=' + id + ']').slideUp();
		               swal('删除成功')
		           },
		           error: function(){
		               swal('删除失败')
		           }
		       }) 
		    }
		})
	}
})


