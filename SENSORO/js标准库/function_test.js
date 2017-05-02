/**
 * Created by wyq on 17/4/28.
 * js function 内置方法
 */

function _length() {
	console.log(Function.length);
	console.log((function () {
	}).length);
	console.log((function (a, b) {
	}).length);
	console.log((function (...args) {
	}).length);
}
_length();


