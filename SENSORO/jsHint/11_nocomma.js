/**
 * Created by wyq on 17/4/17.
 * nocomma -- 此选项禁止使用逗号运算符
 */

/* jshint nocomma: true */
var a = (10, 20);//11_nocomma.js: line 7, col 12, Unexpected use of a comma operator.
console.log(a);
