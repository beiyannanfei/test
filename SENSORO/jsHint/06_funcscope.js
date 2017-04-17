/**
 * Created by wyq on 17/4/17.
 * funcscope -- 此选项禁止在控制结构中声明变量的警告，同时从外部访问它们
 */

/* jshint funcscope: false */
function test() {
	if (true) {
		var a = 10;
	}
	a += 1;//06_funcscope.js: line 11, col 5, 'a' used out of scope.
}
