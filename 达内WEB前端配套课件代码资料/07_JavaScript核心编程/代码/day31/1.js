/*
Plane is a FlyingObject
*/
var fo1 = new Object();
fo1.name = '飞行物';
fo1.speed = 0;
fo1.fly = function(){
	console.log(this.name+'在飞行,时速：'+this.speed);
};
fo1.land = function(){
	console.log(this.name+'在着陆');
};

var plane1 = new Object();
plane1.capacity = 200;
plane1.load = function(){
	console.log('飞机在装载乘客');
};

//修改飞机对象的原型——修改父对象
Object.setPrototypeOf(plane1, fo1);

plane1.name = '空客A230';
plane1.speed = 1500;

console.log(plane1.name);
console.log(plane1.speed);
console.log(plane1.capacity);
plane1.fly();
plane1.land();
plane1.load();