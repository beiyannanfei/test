function getSize(){
	return this.width * this.height;
}
function getPerimeter(){
	return this.width*2 + this.height*2;
}

var rect1 = new Object();
rect1.width = 3;
rect1.height = 4;
rect1['backgroundColor'] = '#ff0000';
rect1.getSize = getSize;
rect1.getPerimeter = getPerimeter;

var rect2 = new Object();
rect2.width = 6;
rect2['height'] = 8;
rect2.getSize = getSize();
rect2.getPerimeter = getPerimeter;


rect1.getSize();
rect2.getSize();


