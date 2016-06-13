$(function(){
	$('#select-all').click(function(){
        $(this).toggleClass('checked');
        if ($(this).hasClass('checked')){
            $('#awad_list').find('.icheckbox_square-green').addClass('checked');
        } else {
            $('#awad_list').find('.icheckbox_square-green').removeClass('checked');
        } 
    })

    /*$('#delete').click(function(){
        var ids = []
        $('#awad_list').find('.icheckbox_square-green').each(function(i,v){
            if ($(this).hasClass('checked')) {
                ids.push($(this).closest('tr').attr('id'))
            }
        })
        if (ids.length == 0) {
            return swal('请选择要删除的内容')
        } else {
            swal({
                title: "确定要删除订单吗？",
                text: "删除后不能撤销，请慎重考虑",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                   $.ajax({
                       url:'/admin/order/delete/ids',
                       type:'POST',
                       data:{ids:ids},
                       success:function(data){
                           $.each(ids,function(i,v){
                               $('tr[id=' + v + ']').remove();
                           })
                           swal('删除成功')
                       }
                   })
                }
            })
        }
    })*/

    $('#startTime').focus(function () {
        WdatePicker({dateFmt: 'yyyy/MM/dd HH:mm:ss'});
    })
    $('#endTime').focus(function () {
        var startTime = $('#startTime').val()
        if (startTime) {
            WdatePicker({dateFmt: 'yyyy/MM/dd HH:mm:ss', minDate: "#F{$dp.$D(\'startTime\',{H:1});}"});
        } else {
            $('#startTime').focus()
        }
    })
    $('#way-cancel').click(function(){
        $('.dialog').hide()
        $('#addInfo').text('')
    })
    $('#know').click(function(){
        $('.dialog').hide()
    })

    $('#download').click(function(){        
        var orderIdList = []
        $('#awad_list').find('.icheckbox_square-green').each(function(i,v){
            if ($(this).hasClass('checked')) {
                orderIdList.push($(this).closest('tr').attr('id'))
            }
        })
        var name = $('#awards').val();
        var type = $('#type').find("option:selected").text();
        var state = $('#state').find("option:selected").text();
        var startTime = $('#startTime').val();
        var endTime = $('#endTime').val();
        var order = {};
        if (name) {
            order.name = name
        }
        if (startTime) {
           order.startTime = startTime 
        }
        if (endTime) {
            order.endTime = endTime 
        }
        if ( type == '全部') {
           delete order.type
        } else if ( type == '实物') {
            order.type= 1
        } else if ( type == '消费码') {
            order.type = 2
        } else if ( type == '第三方卡券（url）') {
            order.type = 3
        } else if ( type == '微信卡卷') {
            order.type = 101
        } else if ( type == '微信红包') {
            order.type = 102
        }
        if ( state == '全部' ) {
            delete order.state
        } else if ( state == '已发货') {
            order.state = 1
        } else if (state == '未发货') {
            order.state = 2
        } else if (state == '已完成') {
            order.state = 3
        }
        var args = {
            order:order,
            orderIdList:orderIdList
        }
        var url = '/admin/order/update/exportorder?args='+JSON.stringify(args)
        window.open(url)
    })

    var status = true;
    var localData = {};
    var page;
    function loadGoods(page,order){
        page = page;
        if (!page) {
            page = 0;
        };
        $.ajax({
            url:'/admin/order/list',
            type:'POST',
            data:{page:page,pageSize:20,order:order},
            beforeSend:function(){
                $('.load').show()
            },
            success:function(data){
                $('.load').hide()
                screenTotab(data)
            }
        })
    }
    loadGoods(page)

    function orderSure(id,state){
        $('#way-ok').click(function(){
            var num = $('#waybillId').val();
            if (isNaN(num)) {
                $('#waybillId').val('')
                return alert('请输入数字')
            } else if (!num) {
                $('#waybillId').val('')
                return alert('请填写订单号')
            } else {
                $('.dialog').hide()
                var message={
                    orderId:id,
                    state:state,
                    courier:{
                        name:$('#wayCom').find('option:selected').text(),
                        num:num
                    }
                }
                $.ajax({
                    url:'/admin/order/update',
                    type:'POST',
                    data:message,
                    success:function(data){
                        console.log(data)
                        if (data.code == 200) {
                            var parent = $('tr[id='+id+']').find('td.midden');
                            parent.html('<span class="ready_shipments">已发货</span>'+
                            '<div class="awad_status">'+
                                '<button type="button" class="btn btn-default save">完成</button>'+
                                '<button type="button" class="btn btn-default delete">删除</button>'+
                            '</div>')
                            grendClick(parent,msg)
                            console.log(msg)
                        };
                    }
                })
            }
            $('#addInfo').text('')
        })
    }

    var things = true;
    var msg;

    function grendClick($parent,data){
    	$('.icheckbox_square-green', $parent).click(function(){
            $(this).toggleClass('checked');
        })
        $('.shipments', $parent).click(function(){
            $('#waybillId').val('');
            var id = $(this).closest('tr').attr('id')
            var state = $(this).closest('tr').attr('state')
            var ship = $(this).attr('id')
            var users = localData[ship]
            var s = ''
            if (users.name){
                s += users.name + ' '
            }
            if (users.phoneNum){
                s += users.phoneNum + ' '
            }
            if (users.address){
                s += users.address + ' '
            }
            if (users.childName) {
                s += users.childName + ' '
            }
            if (users.childSex) {
                s += users.childSex + ' '
            }
            if (users.childAge) {
                s += users.childAge + ' '
            }
            $('#addInfo').text('').text('收货信息：' + s)
            $('.dialog').show()
            $('#way-ok').show()
            $('#way-cancel').show()
            $('#know').hide()
            if (things == true) {
                orderSure(id,state)
                things = false
            };
        })
        $('.delete', $parent).click(function(){
            var id = $(this).closest('tr').attr('id')
            swal({
                title: "确定要删除该订单吗？",
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
                       type: 'GET',
                       url: '/admin/order/' + id + '/delete',
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
        })
        $('.save', $parent).click(function(){
            var id = $(this).closest('tr').attr('id')
            swal({
                title: "确定要点击完成吗？",
                text: "请慎重考虑，避免钱财两空",
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
                        url:'/admin/order/update/complete',
                        type:'POST',
                        data:{orderId: id},
                        success:function(data){
                            var parent = $('tr[id='+id+']').find('td:last');
                            parent.html('<span>已完成</span>'+
                            '<div class="awad_status">'+
                                '<button type="button" class="btn btn-default delete">删除</button>'+
                            '</div>')
                            swal('操作成功');
                            grendClick(parent)
                        }
                   })
                }
            })
        })
        $('.ready_shipments', $parent).click(function(){
            console.log(data)
            $('.dialog').show()
            $('#way-ok').hide()
            $('#way-cancel').hide()
            $('#know').show()
            var id = $(this).closest('tr').attr('id');
            $.each(data.data.arr,function(i,v){
                if ( id == v._id ) {
                    if ( v.address && v.courier ) {
                        var s = ''
                        if (v.address.name){
                            s += v.address.name + ' '
                        }
                        if (v.address.phoneNum){
                            s += v.address.phoneNum + ' '
                        }
                        if (v.address.address){
                            s += v.address.address + ' '
                        }
                        if (v.address.childName) {
                            s += v.address.childName + ' '
                        }
                        if (v.address.childSex) {
                            s += v.address.childSex + ' '
                        }
                        if (v.address.childAge) {
                            s += v.address.childAge + ' '
                        }
                        $('#addInfo').text('').text('收货信息：' + s)
                        $('#wayCom').val('').val(v.courier.name)
                        $('#waybillId').val('').val(v.courier.num)
                    } else {
                        $('.dialog').hide()
                    }                    
                };
            })
        })
    }
    var orderoption;
    $('#screen').click(function(){
        status = true
    	var name = $('#awards').val();
    	var type = $('#type').find("option:selected").text();
    	var state = $('#state').find("option:selected").text();
    	var startTime = $('#startTime').val();
    	var endTime = $('#endTime').val();
        var order = {};
        if ( type == '全部') {
            delete order.type
        } else if ( type == '实物') {
            order.type=1
        } else if ( type == '消费码') {
            order.type = 2
        } else if ( type == '第三方卡券（url）') {
            order.type = 3
        } else if ( type == '微信卡卷') {
            order.type = 101
        } else if ( type == '微信红包') {
            order.type = 102
        }
        if ( state == '全部') {
            delete order.state
        } else if ( state == '已发货') {
            order.state = 1
        } else if (state == '未发货') {
            order.state = 2
        } else if (state == '已完成') {
            order.state = 3
        }
        if (startTime) {
           order.startTime = startTime 
        }
        if (endTime) {
            order.endTime = endTime 
        };
        if (name) {
            order.name = name 
        };

        orderoption = order;

        loadGoods(0,order);
    })
    function screenTotab(data){
        if (data.data.arr.length == 0) {
            $('#nodata').show()
            $('.awad_table').hide()
            $('.order_number').hide()
            $('.status_btn').hide()
            $('#Pagination').hide()
            $('#delete').hide()
        } else {
            $('#delete').show()
            $('#nodata').hide()
            $('.awad_table').show()
            $('.order_number').show()
            $('.status_btn').show()
            grendSearch(data)
        }
    }
    
    function grendSearch(data){
        var num;
        if (data.data.count == null || data.data.arr.length == 0) {
            num = 0;
        } else {
            num = data.data.count;
        }
        $('.order_number').text('订单总数：'+num)
        if (status == true) {
            if (data.data.count != null) {
                $('#Pagination').pagination(num,{
                    items_per_page:20,
                    prev_text:'前一页',
                    next_text:'后一页',
                    ellipse_text:'...',
                    callback:pageSelect
                })
            }
        }
        $('#Pagination').show();
        var html = '';
        var type;
        $.each(data.data.arr,function (v,k){
            if (k.prize) {
                if (k.prize.type == 1) {
                    type = '实物'
                } else if(k.prize.type == 2){
                    type = '消费码'
                } else if(k.prize.type == 3){
                    type = '第三方卡券（url）'
                } else if(k.prize.type == 101){
                    type = '微信卡卷'
                } else {
                    type = '微信红包'
                }
            } else if (k.money && k.money.type == 102) {
                type = '微信红包'
            }

            html += '<tr id="' + k._id + '">'+
                        '<td><div class="icheckbox_square-green" style="position: relative;margin-top:-5px;"><ins class="iCheck-helper" style="position: absolute; top: 0%; left: 0%; display: block; width: 100%; height: 100%; margin: 0px; padding: 0px; border: 0px; opacity: 0; background: rgb(255, 255, 255);"></ins></div>'+
                        '</td>'

            if (k.money) {
                html += '<td>' + k.money.name + '</td>'+
                        '<td>'+
                            '<p><img src="/images/redbag.jpg" alt=""></p>'+
                        '</td>'
            }

            if (k.prize) {
                html += '<td>' + k.prize.name + '</td>'+
                        '<td>'+
                            '<p><img src="' + k.prize.pic + '" alt=""></p>'+
                        '</td>'
            }
            //k.user.icon  /64
            html +='<td>' + type + '</td>'+
                    '<td>' + k.user.name + '</td>'+
                    '<td>' + 
                        '<p><img src="' + k.user.icon + '/64" alt=""></p>'+
                    '</td>';
            console.log("this is k:",k);
            if ( k.prize && k.prize.type == 1 && k.address) {
                html += '<td>'
                if ( k.address.name ) {
                    html += '姓名：' + k.address.name + '&nbsp;&nbsp;'
                }
                if ( k.address.phoneNum ) {
                    html += '手机号：' + k.address.phoneNum + '&nbsp;&nbsp;'
                }
                if ( k.address.address ) {
                    html += '地址：' + k.address.address + '&nbsp;&nbsp;'
                }
                if ( k.address.childName ) {
                    html += '小孩姓名：' + k.address.childName + '&nbsp;&nbsp;'
                }
                if ( k.address.childSex ) {
                    html += '小孩性别：' + k.address.childSex + '&nbsp;&nbsp;'
                }
                if ( k.address.childAge ) {
                    html += '小孩年龄：' + k.address.childAge
                }
                html += '</td>'
            } else {
                html += '<td>无</td>'
            }
            html += '<td>' + k.dateTime + '</td>'
            if (k.money || k.prize.type == 102) {
                html += '<td><button type="button" class="btn btn-default delete">删除</button></td>'
            } else if (k.state == 1) {
                html += '<td>'+
                            '<span class="ready_shipments">已发货</span>'+
                            '<div class="awad_status">'+
                                '<button type="button" class="btn btn-default save">完成</button>'+
                                '<button type="button" class="btn btn-default delete">删除</button>'+
                            '</div>'+
                        '</td>'
            } else if(k.state == 2 && k.prize.type == 1){
                if (k.address) {
                    html += '<td class="midden">'+
                            '<span>未发货</span>'+
                            '<div class="awad_status">'
                    html += '<button type="button" class="btn btn-default shipments" id="' + v + '">发货</button>'
                } else {
                    html += '<td class="midden">'+
                            '<span>未填写地址</span>'+
                            '<div class="awad_status">'
                }
                html += '<button type="button" class="btn btn-default delete">删除</button></div></td>'
            } else if (k.state == 3 || k.prize.type == 3) {
                html += '<td>'+
                            '<span>已完成</span>'+
                            '<div class="awad_status">'+
                                '<button type="button" class="btn btn-default delete">删除</button>'+
                            '</div>'+
                        '</td>'
            }
            html += '</tr>'
            localData[v] = k.address
        })
        var parent = $('#awad_list')
        parent.html(html)
        msg = data;
        grendClick(parent,data)
    }

    function pageSelect(page_index,jq){
        $('#select-all').removeClass('checked')
        loadGoods(page_index,orderoption)
        status = false
    }
})