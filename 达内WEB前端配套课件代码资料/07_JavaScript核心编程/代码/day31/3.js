/*
Plane is a FlyingObject
*/
function FlyingObject(name,speed){
	this.name = name;
	this.speed = speed;
	this.fly = function(){
		console.log(this.name+'在飞行,时速：'+this.speed);
	};
	this.land = function(){
		console.log(this.name+'在着陆');
	};
}

//var fo1 = new FlyingObject('',0);
function Plane(name, speed, capacity){
	Object.setPrototypeOf(this, new FlyingObject(name,speed));
	this.capacity = capacity;
	this.load = function(){
		console.log('飞机在装载乘客');
	}
}
/*function Plane(capacity){
	this.capacity = capacity;
	this.load = function(){
		console.log('飞机在装载乘客');
	}
}
Plane.prototype = new FlyingObject('飞行物', 0);
*/
var plane1 = new Plane('A380', 2000, 200);

console.log(plane1.name);
console.log(plane1.speed);
console.log(plane1.capacity);
plane1.fly();
plane1.land();
plane1.load();