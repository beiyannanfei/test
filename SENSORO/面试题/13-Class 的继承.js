/**
 * Created by wyq on 17/8/18.
 */
function t1() {
	class Point {
	}
	class ColorPoint extends Point {
		constructor() {
		}
	}
	try {
		//子类必须在constructor方法中调用super方法，否则新建实例时会报错。
		// 这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。
		// 如果不调用super方法，子类就得不到this对象。
		let cp = new ColorPoint();
	} catch (e) {
		console.log("e: %j", e.message);    //e: "this is not defined"
	}
}

function t2() {
	class Point {
		constructor(x, y) {
			this.x = x;
			this.y = y;
		}
	}
	class ColorPoint extends Point {
		constructor(x, y, color) {
			//this.color = color;       //error 在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，是基于对父类实例加工，只有super方法才能返回父类实例
			super(x, y);
			this.color = color;
		}
	}
	let cp = new ColorPoint(10, 20, "red");
	console.log(cp instanceof ColorPoint);  //true
	console.log(cp instanceof Point);       //true
	console.log(Object.getPrototypeOf(ColorPoint) === Point); //true  Object.getPrototypeOf方法可以用来从子类上获取父类
}

function t3() {
	class A {
		constructor() {
			console.log("A-constructor: %j", new.target.name);
		}
	}
	class B extends A {
		constructor() {
			super();
		}
	}
	new A();    //A-constructor: "A"
	new B();    //A-constructor: "B"
}

function t4() {
	class A {
		p() {
			return 2;
		}
	}

	class B extends A {
		constructor() {
			super();
			// 子类B当中的super.p()，就是将super当作一个对象使用。这时，super在普通方法之中，指向A.prototype，所以super.p()就相当于A.prototype.p()
			console.log(super.p());
		}
	}
	//super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
	let b = new B();    //2
}

function t5() {
	class A {
		constructor() {
			this.p = 2;
		}
	}

	class B extends A {
		get m() {
			return super.p;
		}
	}
	let b = new B();
	//由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。
	console.log("b.m = %j", b.m);   //b.m = undefined
}

function t6() {
	class A {
	}
	A.prototype.x = 2;    //如果属性定义在父类的原型对象上，super就可以取到。

	class B extends A {
		constructor() {
			super();
			console.log("super.x = %j", super.x);
		}
	}
	let b = new B();  //super.x = 2
}

function t7() {
	class A {
		constructor() {
			this.x = 1;
		}

		print() {
			console.log(this.x);
		}
	}

	class B extends A {
		constructor() {
			super();
			this.x = 2;
		}

		m() {
			super.print();    //通过super调用父类的方法时，super会绑定子类的this
		}
	}
	let b = new B();
	b.m();            //2
}

function t8() {
	//由于绑定子类的this，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性
	class A {
		constructor() {
			this.x = 1;
		}
	}

	class B extends A {
		constructor() {
			super();
			this.x = 2;
			super.x = 3;    //super.x赋值为3，这时等同于对this.x赋值为3
			console.log("super.x = %j", super.x);   //当读取super.x的时候，读的是A.prototype.x，所以返回undefined
			console.log("this.x = %j", this.x);
		}
	}
	let b = new B();  //super.x = undefined  this.x = 3
}

function t9() {
	class Parent {
		static myMethod(msg) {
			console.log("statis: " + msg);
		}

		myMethod(msg) {
			console.log("instance: " + msg);
		}
	}

	class Child extends Parent {
		static myMethod(msg) {
			super.myMethod(msg);    //super在静态方法之中指向父类，
		}

		myMehtod(msg) {
			super.myMethod(msg);    //在普通方法之中指向父类的原型对象。
		}
	}

	Child.myMethod(1);    //statis: 1
	let c = new Child();
	c.myMehtod(2);        //instance: 2
}

function t10() {
	class A {
	}
	class B extends A {
	}
	//子类的__proto__属性，表示构造函数的继承，总是指向父类
	console.log(B.__proto__ === A); //true
	//子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性
	console.log(B.prototype.__proto__ === A.prototype); //true
}
