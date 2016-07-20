var uri = 'http://127.0.0.1/资源/abc xyz/花.png?a=b#abc';

var result = encodeURI(uri);
var uri2 = decodeURI(result);

console.log(uri);
console.log(result);
console.log(uri2);
console.log();


var result2 = encodeURIComponent(uri);
var uri3 = decodeURIComponent(result2);
console.log(result2);
console.log(uri3);


//window.open(uri);	//打开新页面失败
//window.open(result);//打开新页面成功

