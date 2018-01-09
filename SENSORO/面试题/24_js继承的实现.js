/**
 * Created by wyq on 18/1/9.
 */
function t1() { //对象冒充
	function Parent(name) {
		this.name = name;
		this.getName = function () {
			return this.name;
		}
	}

	function Child(name, password) {
		//通过以下3步实现将Parent属性和方法追加到Child中，从而实现继承
		//第一步：this.method是作为一个临时的属性，并且指向Parent所指的对象
		//第二步：执行this.method方法，即执行Parent所指向的对象函数
		//第三步：销毁this.method属性，即此时Child就已经拥有了Parent的所有属性和方法
		this.method = Parent;
		this.method(name);
		delete(this.method);

		this.password = password;
		this.world = function () {
			console.log("password: %j", this.password);
		}
	}

	const child = new Child("Mychild", "123456");
	console.log(child.getName());       //Mychild
	child.world();         //123456
}

function t2() { //类继承
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

function t3() { //原型继承
	function Person() {
	}

	Person.prototype.hello = "hello";
	Person.prototype.sayHello = function () {
		console.log(this.hello);
	};

	function Child() {
	}

	Child.prototype = new Person();//这行的作用是：将Parent中将所有通过prototype追加的属性和方法都追加到Child，从而实现了继承
	Child.prototype.world = "world";
	Child.prototype.sayWorld = function () {
		console.log(this.world);
	};
	const c = new Child();
	c.sayHello();
	c.sayWorld();
}

function t4() { //call方法
	function Parent(username) {
		this.username = username;
		this.hello = function () {
			console.log(this.username);
		}
	}

	function Child(username, password) {
		Parent.call(this, username);    //或者使用apply模式， 修改为 Parent.apply(this,new Array(username)); 即可
		this.password = password;
		this.world = function () {
			console.log(this.password);
		}
	}

	const parent = new Parent("zhangsan");
	const child = new Child("lisi", "123456");
	parent.hello(); //zhangsan
	child.hello();  //lisi
	child.world();  //123456
}

function t5() {   //混合call，原型立案继承方式
	function Parent(hello) {
		this.hello = hello;
	}

	Parent.prototype.sayHello = function () {
		console.log(this.hello);
	};

	function Child(hello, world) {
		Parent.call(this, hello);//将父类的属性继承过来
		this.world = world;//新增一些属性
	}

	Child.prototype = new Parent();//将父类的方法继承过来
	Child.prototype.sayWorld = function () {//新增一些方法
		console.log(this.world);
	};
	const c = new Child("zhangsan", "lisi");
	c.sayHello();   //zhangsan
	c.sayWorld();   //lisi
}

t5();
