//var regexp = /a/;
//var regexp = /^a/;
var regexp = /。$/;

var data = 'ab。ac。';

console.log( regexp.test(data) );



//var cellphonePatt = /1[35789]\d{9}/;
var cellphonePatt = /^1[35789]\d{9}$/;
var data = '13012345678';
console.log( cellphonePatt.test(data) );