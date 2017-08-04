/**
 * Created by wyq on 17/8/4.
 */
var point = {
	x: 0,
	y: 0,
	moveTo: function (x, y) {
		var fn1 = function (x) {
			this.x = this.x + x;
			return this.x;
		};
		var fn2 = function (y) {
			this.y = this.y + y;
		};
		return fn1();
	}
};
console.log(point.moveTo());    //NaN

var point1 = {
	x: 0,
	y: 0,
	moveTo: function (x, y) {
		var that = this;
		var x = x;
		var y = y;
		var fn1 = function (x) {
			that.x = that.x + x;
			return that;
		};
		var fn2 = function (y) {
			that.y = that.y + y;
		};
		return fn1(x);
	}
};
console.log(point1.moveTo(1, 1));　　//{ x: 1, y: 0, moveTo: [Function] }