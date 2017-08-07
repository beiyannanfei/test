/**
 * Created by wyq on 17/8/4.
 */
var myObject = {
	foo: "ABC",
	func: function () {
		var self = this;
		console.log("outer func : this.foo = " + this.foo);     //outer func : this.foo = ABC
		console.log("outer func : self.foo = " + self.foo);     //outer func : self.foo = ABC

		(function () {
			console.log("inner func : this.foo = " + this.foo);   //inner func : this.foo = undefined
			console.log("inner func : self.foo = " + self.foo);   //inner func : self.foo = ABC
		}());
	}
};

myObject.func();

// "password" : "$2a$04$GEp1Cx2dUPdUKvVTdmmxluM1H1gK8/PktAl4JblGZj47MCmOUmvQu"