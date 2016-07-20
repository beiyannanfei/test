/*
取出成绩数组中的前五个元素
*/

var scores = [60, 65, 66, 80, 85, 90, 91];
var top5 = scores.slice(0, 5);
console.log( top5 );
//console.log( scores );



/*
取出成绩数组中的后五个元素
*/
var last5 = scores.slice(-5);
console.log(last5);


var middle3 = scores.slice(2, 5);
console.log( middle3 );