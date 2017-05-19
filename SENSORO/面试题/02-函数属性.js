/**
 * Created by wyq on 17/5/18.
 */

function People(name, age) {
	this.name = name;
	this.age = age;
}

People.prototype.say = function () {
	console.log("I am " + this.name);
};

function Boy() {
	People.apply(this, Array.prototype.slice.call(arguments));
}

Boy.prototype = new People();

Boy.prototype.say = function () {
	console.log("I am " + this.name + ",I am " + this.age + " years old");
};

var boy = new Boy("Jack", 22);
boy.say(); // => I am Jack,I am 22 years old