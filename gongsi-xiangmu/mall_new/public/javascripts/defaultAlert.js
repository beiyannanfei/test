/*
    title:弹出框的标题
    content：弹出框弹出的内容
    type：弹出框的类型，有success，warning，两种类型，type可以不要
    showCancelButton：显示取消按钮吗，true显示，false不显示
    confirmButtonColor：确定按钮的颜色
    confirmButtonText：确定按钮的内容
    cancelButtonText：取消按钮的内容
    closeOnConfirm：点击确定后的操作，false为执行，true为不执行
    closeOnCancel:点击取消后的操作，false为执行，true为不执行
*/

function alert(title,content,type,cancelBtn,yesColor,yesText,cancelText,yesFalse,cancelFalse){
    swal({
        title: title,
        text: content,
        type: type,
        showCancelButton: cancelBtn,
        confirmButtonColor: yesColor,
        confirmButtonText: yesText,
        cancelButtonText: cancelText,
        closeOnConfirm: yesFalse,
        closeOnCancel: cancelFalse 
    }/*,
    function (isConfirm) {
        if (isConfirm) {
            swal("删除!", "删除成功", "success");
        } else {
            swal("取消", "删除失败", "error");
        }
    }*/);
}