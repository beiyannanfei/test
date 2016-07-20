var rect1 = new Object();
rect1.width = 3;
rect1.height = 4;
rect1['backgroundColor'] = '#ff0000';
rect1.getSize = function(){
	return this.width * this.height;
}
rect1.getPerimeter = function(){
	return this.width*2 + this.height*2;
}

console.log( rect1 );
console.log( rect1.width );
console.log( rect1['height'] );
console.log( rect1.getSize() );
console.log( rect1.getPerimeter() );
console.log();

var rect2 = new Object();
rect2.width = 6;
rect2['height'] = 8;
rect2.getSize = function(){
	return this.width*this.height;
}
rect2.getPerimeter = function(){
	return this.width*2 + this.height*2;
}
console.log( rect2.getSize() );
console.log( rect2.getPerimeter() );