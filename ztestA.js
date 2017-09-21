var a = {
	a: 10,
	b: 20,
	c: 30
};
function test(obj) {
	console.log("==before obj: %j", obj);   //==before obj: {"a":10,"b":20,"c":30}
	delete a.a;
	console.log("==after obj: %j", obj);    //==after obj: {"b":20,"c":30}
}
console.log("===== aa a: %j", a);     //===== aa a: {"a":10,"b":20,"c":30}
test(a);
console.log("===== bb a: %j", a);     //===== bb a: {"b":20,"c":30}