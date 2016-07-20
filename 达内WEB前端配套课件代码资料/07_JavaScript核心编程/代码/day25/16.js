/*
计算一段字符串中英文字符、中文字符、数字、其它字符的数量
*/

var data = 'ab中文123?*+';

/*
console.log( data.length );
console.log( data.charAt(5) );
console.log( data.charCodeAt(5) );
*/
var yingWen = 0;
var hanZi = 0;
var shuZi = 0;
var qiTa = 0;
for(var i=0; i<data.length; i++){
	var c = data.charAt(i);
	if( c>='0' && c<='9'){
		shuZi++;
	}else if( (c>='A'&&c<='Z') || (c>='a'&&c<='z')){
		yingWen++;
	}else if( c>='\u4E00' && c<='\u9FA5' ){
		hanZi++;
	}else{
		qiTa++;
	}
}

