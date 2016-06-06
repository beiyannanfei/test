/**
 * Created by wyq on 2016/6/6.
 */

var arr = [0, 1, 2, 3, 4];
var map = {0: 0, 1: 1, 2: 2, 3: 3};

console.log(arr[0]);
console.log(map[0]);

console.log("arr typeof: %j", typeof arr);
console.log("map typeof: %j", typeof map);

console.log("arr instanceof Array", (arr instanceof Array));
console.log("map instanceof Array", (map instanceof Array));

console.log("Array.isArray(arr): %j", Array.isArray(arr));
console.log("Array.isArray(map): %j", Array.isArray(map));