/**
 * Created by wyq on 17/8/17.
 */
function t1() {
	class Point {
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}

		toString() {
			return `(${this.x},${this.y})`;
		}
	}
	let p = new Point(10, 20);
	console.log(p.toString());  //(10,20)
	console.log(typeof Point);  //function
	console.log(typeof p);      //object
}

function t2() {
	class Point {
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}
	}
	const p1 = new Point(2, 3);
	const p2 = new Point(3, 2);
	p1.__proto__.toString = function () { //可以通过实例的__proto__属性为“类”添加方法
		return `(${this.x},${this.y})`;
	};
	console.log("p1 toString: " + p1.toString());   //p1 toString: (2,3)
	console.log("p2 toString: " + p2.toString());   //p2 toString: (3,2)
	const p3 = new Point(10, 20);
	console.log("p3 toString: " + p3.toString());   //p3 toString: (10,20)
}

function t3() {
	const MyClass = class Me {  //代码使用表达式定义了一个类。需要注意的是，这个类的名字是MyClass而不是Me，Me只在 Class 的内部代码可用，指代当前类。
		getClassName() {
			return Me.name;
		}
	};
	let inst = new MyClass();
	console.log("inst.getClassName = %j", inst.getClassName());   //inst.getClassName = "Me"
	try {
		Me.name;  //error Me只在 Class 内部有定义
	} catch (e) {
		console.log("e: %j", e.message || e); //e: "Me is not defined"
	}
}

function t4() {
	let person = new class {    //采用 Class 表达式，可以写出立即执行的 Class
		constructor(name) {
			this.name = name;
		}

		sayName() {
			console.log(this.name);
		}
	}("张三");
	person.sayName();   //张三
}

function t5() {
	class Point {
	}
	console.log("Point.name: %j", Point.name);  //Point.name: "Point"    name属性总是返回紧跟在class关键字后面的类名
}

function t6() {
	class MyClass {
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}

		toString() {
			return `(${this.x},${this.y})`;
		}

		//在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为
		get prop_x() {
			return this.x;
		}

		set prop_x(val) {
			console.log("prop_x val: %j", val);
			this.x = val;
		}
	}

	let inst = new MyClass(10, 20);
	console.log(inst.toString());   //(10,20)
	console.log("before x = %j", inst.prop_x);   //before x = 10
	inst.prop_x = 100;      //prop_x val: 100
	console.log(inst.toString());   //(100,20)
	console.log("after x = %j", inst.prop_x);   //after x = 100
}

function t7() {
	class Foo {
		constructor(...args) {
			this.args = args;
		}

		*[Symbol.iterator]() {  //如果某个方法之前加上星号（*），就表示该方法是一个 Generator 函数
			for (let arg of this.args) {
				yield arg;
			}
		}
	}

	for (let x of new Foo("aaa", "bbb", "ccc")) {
		console.log(x);
	}
}

function t8() {
	class Foo {
		static classMethod() {    //在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”
			console.log("hello");
		}
	}
	let foo = new Foo();
	Foo.classMethod();  //hello
	try {
		foo.classMethod();    //方法不会被实例继承
	} catch (e) {
		console.log("e: %j", e.message || e);   //e: "foo.classMethod is not a function"
	}
	console.log("==========================");
	class Bar extends Foo {
	}
	Bar.classMethod();  //hello    父类的静态方法，可以被子类继承
}
