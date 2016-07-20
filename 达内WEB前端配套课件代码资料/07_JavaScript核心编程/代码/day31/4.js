/*
Plane is a FlyingObject
*/
//var fo1 = Object.create(null);
var fo1 ={
	name : '飞行物',
	speed : 0,
	fly : function(){
		console.log(this.name+'在飞行,时速：'+this.speed);
	},
	land : function(){
		console.log(this.name+'在着陆');
	}
};

var plane1 = Object.create(fo1);
plane1.capacity = 200;
plane1.load =function(){
	console.log('飞机在装载乘客');
};



console.log(plane1.name);
console.log(plane1.speed);
console.log(plane1.capacity);
plane1.fly();
plane1.land();
plane1.load();