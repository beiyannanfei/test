/**
 * Created by wyq on 17/7/14.
 */
foo = "bar";

function testThis() {
	global.foo = "foo";
}

console.log(global.foo);
testThis();
console.log(global.foo);
console.log("==================");

function Thing() {
}
Thing.prototype.foo = "bar";
Thing.prototype.logFoo = function () {
	console.log(this.foo);
};
Thing.prototype.setFoo = function (newFoo) {
	this.foo = newFoo;
};
Thing.prototype.deleteFoo = function () {
	delete this.foo;
};

var thing = new Thing();
thing.setFoo("foo");
thing.logFoo(); //logs "foo";
thing.deleteFoo();
thing.logFoo(); //logs "bar";
thing.foo = "foobar";
thing.logFoo(); //logs "foobar";
delete thing.foo;
thing.logFoo(); //logs "bar";