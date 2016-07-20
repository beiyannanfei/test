var html = "<a>百度首页</a><a>搜狐首页</a><a>凤凰首页</a>";

var regexp = /<a>(.*)<\/a>/ig;

/*
if(  regexp.test(html)  ){
	console.log(RegExp.$1);
}else{
	console.log('未找到匹配项');
}
*/

console.log( html.match(regexp) );
