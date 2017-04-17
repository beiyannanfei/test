/**
 * Created by wyq on 17/4/17.
 * boss -- 在预期比较的情况下，此选项禁止关于使用分配的警告。通常，代码if (a = 10) {}就是打字错误。
 */

/* jshint boss: false */
var a = 10;
if (a = 20) { //17_boss.js: line 8, col 11, Expected a conditional expression and instead saw an assignment.
	console.log(a);
}
