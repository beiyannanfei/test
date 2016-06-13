/**
 * Created by chenjie on 2015/5/20.
 */

var alertOptions = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut",
    "allowOutsideClick": false,
    "showCancelButton": false,
    "closeOnConfirm": true,
    "closeOnCancel": true,
    "confirmButtonText": '确定',
    "confirmButtonColor": '#AEDEF4',
    "cancelButtonText": '取消'
}

window.alert = function(opts, callback){
    for (var i in alertOptions){
        if(!opts[i]){
            opts[i] = alertOptions[i]
        }
    }
    swal(opts, callback)
}