Date.prototype.format = function(format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    "S": this.getMilliseconds() //millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

function showLoading() {
  $('.loading-self').removeClass('hidden')
}

function closeLoding() {
  $('.loading-self').addClass('hidden')
}

$.util = $.util || {}

/**
 * 提示插件设置
 * @type {Object}
 */
toastr.options = {
  "debug":         false,
  "newestOnTop":   false,
  "positionClass": "toast-top-center",
  "closeButton":   true,
  "toastClass":    "animated fadeInDown",
}

// 处理iframe嵌套 提示看不到问题
var topWin
if (window.top !== window) {
  topWin = window.top
} else {
  topWin = window
}

$.util.error = function(msg) {
  topWin.toastr.error(msg)
}

$.util.success = function(msg) {
  topWin.toastr.success(msg)
}


/**
 * 解析序列化参数为对象或者返回url的参数对象
 * @param  {[String]} string [a=b&c=d]
 * @return {{}}        [description]
 */
$.util.parseQuery = function(string) {
  var parsed = {};
  string = (string !== undefined) ? string : window.location.search;

  if (typeof string === "string" && string.length > 0) {
    if (string[0] === '?') {
      string = string.substring(1);
    }

    string = string.trim('&').split('&');

    for (var i = 0, length = string.length; i < length; i++) {
      var element = string[i],
      eqPos = element.indexOf('='),
      keyValue, elValue;

      if (eqPos >= 0) {
        keyValue = element.substr(0, eqPos);
        elValue = element.substr(eqPos + 1);
      } else {
        keyValue = element;
        elValue = '';
      }

      elValue = decodeURIComponent(elValue);

      if (parsed[keyValue] === undefined) {
        parsed[keyValue] = elValue;
      } else if (parsed[keyValue] instanceof Array) {
        parsed[keyValue].push(elValue);
      } else {
        parsed[keyValue] = [parsed[keyValue], elValue];
      }
    }
  }

  return parsed;
}

/**
 * 把对象转化为url的后缀
 * @param  {[type]} obj [description]
 * @return {string}     [description]
 */
$.util.stringfyQuery = function(obj) {

  var string = []

  if (!!obj && obj.constructor === Object) {
    for (var prop in obj) {
      if (obj[prop] instanceof Array) {
        for (var i = 0, length = obj[prop].length; i < length; i++) {
          string.push([encodeURIComponent(prop), encodeURIComponent(obj[prop][i])].join('='))
        }
      } else {
        string.push([encodeURIComponent(prop), encodeURIComponent(obj[prop])].join('='))
      }
    }
  }

  return string.join('&')
}


window.urlParam = $.util.parseQuery()


$(function() {
  //if (window.top == window) return
  //
  //try {
  //  document.domain = 'tvm.cn'
  //} catch (e) {
  //  return
  //}
  //
  //var main = $(window.parent.document).find("#blankPage")
  //setInterval(function() {
  //  main.height($(document).height() < 1000 ?1000: $(document).height())
  //}, 200)


  $('.modal').on('show.bs.modal',function(){
    if(window.top !== window) {
      $(top.document).scrollTop(0)
    }
  })

})

$.ajax.cache = false