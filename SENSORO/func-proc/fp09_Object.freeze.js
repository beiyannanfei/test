/**
 * Created by wyq on 16/9/21.
 * Object.freeze
 */

var o = Object.freeze({
	a: 10,
	b: 20
});
console.log(o);   //{ a: 10, b: 20 }
o.c = 30;   //no use
console.log(o);   //{ a: 10, b: 20 }
delete o.a; //no use
console.log(o);   //{ a: 10, b: 20 }
