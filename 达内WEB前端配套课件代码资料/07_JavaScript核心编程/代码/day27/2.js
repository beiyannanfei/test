var data = '我的电话13012345678他电话的电话15099999999';

var regexp = /1[35789]\d{9}/g;

/*
console.log( regexp.exec(data) );
console.log( regexp.exec(data) );
console.log( regexp.exec(data) );
*/

/*
console.log(data.indexOf('电话'));
console.log(data.indexOf(regexp)); //indexOf不支持正则表达式
*/

/*
console.log(data.match('电话'));
console.log(data.match(regexp));
*/

console.log( data.search('电话') );
console.log( data.search(regexp) );
