//var regexp = /do/g;
var regexp = /do(?!not)/g;

var data = 'do|donot|donoes';


console.log( data.replace(regexp, '-') );