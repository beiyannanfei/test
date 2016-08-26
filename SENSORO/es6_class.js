/**
 * Created by sensoro on 16/8/26.
 */
"use strict";

/*
 function Point(x,y){
 this.x = x;
 this.y = y;
 }

 Point.prototype.toString = function () {
 return '('+this.x+', '+this.y+')';
 }
 */

//上面的代码用class改写
class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	toString() {
		return "(" + this.x + ", " + this.y + ")";
	}

	toAdd() {
		return this.x + "+" + this.y + "=" + (this.x + this.y);
	}
}

let myPoint = new Point(1, 2);
console.log(myPoint.toString());

class ColorPoint extends Point {
	constructor(x, y, color) {
		super(x, y);  //=>super.constructor(x,y);
		this.color = color;
	}

	toString() {
		return this.color + ' ' + super.toString();
	}
}

let myColorPoint = new ColorPoint(3, 4, "red");
console.log(myColorPoint.toString());
console.log(myColorPoint.toAdd());