/**
 * Created by wyq on 17/7/14.
 */
function Person(name) {
	this.name = name;
}
var pA = Person("xl");  //error

var pB = new Person("XL");
console.log(pB.name);
console.log("==============");

var x = 1;
function test() {
	x = 0;
}
console.log(x);   //1
test();
console.log(x);   //0
