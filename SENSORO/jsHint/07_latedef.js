/**
 * Created by wyq on 17/4/17.
 * latedef -- 此选项禁止在定义之前使用变量
 */

/* jshint latedef: true */
console.log(a());//07_latedef.js: line 8, col 10, 'a' was used before it was defined.
function a() {
	return "AAAA";
}

