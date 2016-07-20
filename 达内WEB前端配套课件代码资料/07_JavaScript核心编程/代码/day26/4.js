//匹配手机号码的表达式

var cellphonePatt = /1[34578][0-9]{9}/;

var data = '13012345678';
data = '23012345678';
data = '10012345678';
data = '13a12345678';
data = '1301234567';
data = '130123456789';

console.log( cellphonePatt.test(data) );


//匹配一个北京的座机号码 010-12345678
var fixedphonePatt1 = /(010-)?[568][0-9]{7}/;

//匹配一个北京的座机号码 8610-12345678
var fixedphonePatt2 = /(010-|8610-)?[568][0-9]{7}/;



//匹配一个HTML双标记标签
var htmlPatt = /<([a-z1-6]+)><\/\1>/;

var data = '<div></a>';
console.log( htmlPatt.test(data) );

