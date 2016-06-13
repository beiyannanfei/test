$(function() {
    $.extend({
        showToast: showToast
    })

    var options = {
        fadeTime: 500,
        duration: 2000
    }

    function showToast(message, option){
        options = $.extend(options, option);
        var toastStyle = 'position: fixed; top: 20%; left: 48%; z-index: 9999; padding: 10px 20px 10px 20px;'
            + 'background-color: #99CCFF; max-width: 200px; color: black; opacity: 0.9;'
            + 'border:2px solid #0099CC';
        var toastString = '';
        toastString += '<div id=toast style="' + toastStyle + '">' + message + '</div>';

        $('#toast').remove();
        $('body').append(toastString);
        $('#toast').fadeIn(options.fadeTime).delay(options.duration).fadeOut(options.fadeTime);
    }
});