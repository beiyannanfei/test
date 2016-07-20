//var regexp = /do/;   //仅匹配一次，且区分大小写
//var regexp = /do/g;  //匹配所有，区分大小写
//var regexp = /do/i;  //匹配一次，不区分大小写
var regexp = /do/ig;   //匹配多次，区分大小写

var data = 'Do|do|donot|donoes|DO';


console.log( data.replace(regexp, '-') );