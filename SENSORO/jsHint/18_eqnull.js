/**
 * Created by wyq on 17/4/17.
 * eqnull -- 此选项禁止有关== null比较的警告。当您要检查变量是否为null或时，这种比较通常很有用 undefined。
 */

/* jshint eqnull: false */
var a;
if (a == null) {  //18_eqnull.js: line 8, col 7, Use '===' to compare with 'null'
	console.log("A");
}

