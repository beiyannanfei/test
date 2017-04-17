/**
 * Created by wyq on 17/4/17.
 * nonew -- 此选项禁止使用构造函数的副作用。有些人喜欢调用构造函数而不将其结果分配给任何变量,new MyConstructor();
 */

/* jshint nonew: true */
function A() {
	return "A";
}
new A();//12_nonew.js: line 10, col 1, Do not use 'new' for side effects

