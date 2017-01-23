/**
 * Created by wyq on 17/1/22.
 */
"use strict";
const should = require("should");

function deepEqual() {
	let obj1 = {
		a: 10,
		b: {
			c: "c"
		},
		c: true
	};
	let obj2 = {
		a: 10,
		b: {
			c: "c0"
		},
		c: true
	};
	try {
		obj1.should.deepEqual(obj2);
	} catch (e) {
		console.log(e.message || e);
	}
}

function equal() {
	try {
		should(10).equal(100);
	} catch (e) {
		console.log(e.message || e);//expected 10 to be 100
	}
	try {
		should(true).equal(1);
	} catch (e) {
		console.log(e.message || e);//expected true to be 1
	}
	try {
		should("A").equal('a');
	} catch (e) {
		console.log(e.message || e);//expected 'A' to be 'a'
	}
}

function falsey() {
	try {
		(true).should.be.false();
	} catch (e) {
		console.log(e.message || e);//expected true to be false
	}
	try {
		(false).should.be.not.false();
	} catch (e) {
		console.log(e.message || e);//expected false not to be false (false negative fail)
	}
}

function ok() {
	try {
		(false).should.be.ok();
	} catch (e) {
		console.log(e.message || e);//expected false to be truthy
	}

	try {
		("").should.be.ok();
	} catch (e) {
		console.log(e.message || e);//expected '' to be truthy
	}

	try {
		should(null).be.ok();
	} catch (e) {
		console.log(e.message || e);//expected null to be truthy
	}
	try {
		(0).should.be.ok();
	} catch (e) {
		console.log(e.message || e);//expected 0 to be truthy
	}
}

function containDeepOrdered() {
	try {
		[1, 2, 3].should.containDeepOrdered([2, 1]);
	} catch (e) {
		console.log(e.message || e);//expected Array [ 1, 2, 3 ] to contain Array [ 2, 1 ]
	}

	try {
		[1, 2, [1, 2, 3]].should.containDeepOrdered([1, [2, 1]]);
	} catch (e) {
		console.log(e.message || e);//expected Array [ 1, 2, Array [ 1, 2, 3 ] ] to contain Array [ 1, Array [ 2, 1 ] ]
	}

	try {
		({a: 10, b: {c: 10, d: [1, 2, 3]}}).should.containDeepOrdered({a: 11});
	} catch (e) {
		console.log(e.message || e);
		//expected Object { a: 10, b: Object { c: 10, d: Array [ 1, 2, 3 ] } } to contain Object { a: 11 }
		// expected 10 to contain 11
		// expected 10 to equal 11
	}
}

function containEql() {
	try {
		[1, 2, 3].should.containEql(1);
		[1, 2, 3].should.containEql(4);
	} catch (e) {
		console.log(e.message || e);//expected Array [ 1, 2, 3 ] to contain 4
	}

	try {
		[{a: 1}, 'a', 10].should.containEql({a: 1});
		[{a: 1}, 'a', 10].should.containEql({a: 2});
	} catch (e) {
		console.log(e.message || e);//expected Array [ Object { a: 1 }, 'a', 10 ] to contain Object { a: 2 }
	}

	try {
		'abc'.should.containEql('b');
		'abc'.should.containEql('d');
	} catch (e) {
		console.log(e.message || e);//expected 'abc' to contain 'd'
	}

	try {
		'ab1c'.should.containEql(1);
		'abc'.should.containEql(1);
	} catch (e) {
		console.log(e.message || e);//expected 'abc' to contain 1
	}
}

function eql() {
	try {
		(10).should.be.eql("10");
	} catch (e) {
		console.log(e.message || e);//expected 10 to equal '10'
	}
	try {
		['a'].should.be.eql({'0': 'a'});
	} catch (e) {
		console.log(e.message || e);//expected Array [ 'a' ] to equal Object { '0': 'a' }
	}
}

function equal() {
	try {
		should(10).be.equal("10");
	} catch (e) {
		console.log(e.message || e);//expected 10 to be '10'
	}
}

function equalOneOf() {
	try {
		'ab'.should.be.equalOneOf('a', 10, 'ab');
		'ab'.should.be.equalOneOf('a', 10, 'b');
	} catch (e) {
		console.log(e.message || e);//expected 'ab' to be equals one of Array [ 'a', 10, 'b' ]
	}
	try {
		'ab'.should.be.equalOneOf(['a', 10, 'ab']);
		'ab'.should.be.equalOneOf(['a', 10, 'b']);
	} catch (e) {
		console.log(e.message || e);//expected 'ab' to be equals one of Array [ 'a', 10, 'b' ]
	}
}

function Infinity() { //无穷
	try {
		(10).should.be.Infinity();
	} catch (e) {
		console.log(e.message || e);//expected 10 to be Infinity
	}
	try {
		NaN.should.be.Infinity();
	} catch (e) {
		console.log(e.message || e);//expected NaN to be Infinity
	}
}

function beNan() {
	try {
		NaN.should.be.NaN();  //ok
		(10).should.be.NaN();
	} catch (e) {
		console.log(e.message || e);//expected 10 to be NaN
	}
}

function above() {  //大于
	try {
		(10).should.be.above(9); // <=> should(10).be.above(9);  ok
		should(10).be.above(11);
	} catch (e) {
		console.log(e.message || e);//expected 10 to be above 11
	}
}

function aboveOrEqual() { //大于等于
	try {
		(10).should.be.aboveOrEqual(10);  //ok
		(10).should.be.aboveOrEqual(11);
	} catch (e) {
		console.log(e.message || e);//expected 10 to be above or equal11
	}
}

function approximately() {  //近似相等
	try {
		(9.99).should.be.approximately(10, 0.1);
		(9.89).should.be.approximately(10, 0.1);
	} catch (e) {
		console.log(e.message || e);//expected 9.89 to be approximately 10 ±0.1
	}
}

function below() {  //小于
	try {
		(10).should.be.below(11);
		(10).should.be.below(10);
	} catch (e) {
		console.log(e.message || e);//expected 10 to be below 10
	}
}

function belowOrEqual() {
	try {
		(10).should.be.belowOrEqual(10);//ok
		(10).should.be.belowOrEqual(9);
	} catch (e) {
		console.log(e.message || e);//expected 10 to be below or equal9
	}
}

function within() {   //区间
	try {
		(10).should.be.within(9, 11);//ok
		(10).should.be.within(9, 10);//ok
		(10).should.be.within(10, 11);//ok
		(10).should.be.within(10, 10);//ok
		(10).should.be.within(11, 20);//error
	} catch (e) {
		console.log(e.message || e);//expected 10 to be within 11..20
	}
}

function empty() {
	try {
		"".should.be.empty();     //ok
		[].should.be.empty();     //ok
		({}).should.be.empty();   //ok
		[0].should.be.empty();    //error
	} catch (e) {
		console.log(e.message || e);  //expected Array [ 0 ] to be empty
	}
}

function enumerable() {
	try {
		({a: 1}).should.be.enumerable('a');             //ok
		({a: 1, b: 2}).should.be.enumerable('a', 1);    //ok
		({a: 1, b: 2}).should.be.enumerable('a', 2);    //expected Object { a: 1, b: 2 } to have enumerable property a equal to 2
		({b: 2, c: 3}).should.be.enumerable('a');       //expected Object { b: 2, c: 3 } to have enumerable property approximately
	} catch (e) {
		console.log(e.message || e);
	}
}

function enumerables() {
	try {
		({a: 10, b: 10}).should.have.enumerables('a');                  //ok
		({a: 10, b: 10, c: 10}).should.have.enumerables('a', 'c');      //ok
		({a: 10, b: 10, c: 10}).should.have.enumerables(['a', 'b']);    //ok
		({a: 10, b: 10, c: 10}).should.have.enumerables('d');           //error
	} catch (e) {
		console.log(e.message || e);//expected Object { a: 10, b: 10, c: 10 } to have enumerables d
	}
}

function keys() {
	try {
		({a: 1}).should.have.keys("a");             //ok
		({a: 1, b: 2}).should.have.keys("a", "b");  //ok
		[1, 2].should.have.key(1);                  //ok
		({a: 1, b: 2}).should.have.keys("c");       //error
	} catch (e) {
		console.log(e.message || e);  //expected Object { a: 1, b: 2 } to have key c
	}
}

function length() {
	try {
		[1, 2].should.have.length(2); //ok
		[1, 2].should.have.length(3); //error
	} catch (e) {
		console.log(e.message || e);  //expected Array [ 1, 2 ] to have property length of 3 (got 2)
	}
}

function ownProperty() {
	try {
		({a: 1}).should.have.ownProperty("a");                    //ok
		({a: 1, b: 2}).should.have.ownProperty("a", "b");         //ok
		({a: 1, b: 2, c: 3}).should.have.ownProperty("a", "c");   //ok
		({a: 1, b: 2, c: 3}).should.have.ownProperty("d");        //error
	} catch (e) {
		console.log(e.message || e);//expected Object { a: 1, b: 2, c: 3 } to have own property d
	}
}

function properties() {
	try {
		({a: 1}).should.have.properties("a");                       //ok
		({a: 1, b: 2, c: 3}).should.have.properties("a", "c");      //ok
		({a: 1, b: 2, c: 3}).should.have.properties(["b", "c"]);    //ok
		({a: 1, b: 2, c: 3}).should.have.properties({b: 2});        //ok
		({a: 1, b: 2, c: 3}).should.have.properties({b: 2, c: 3});  //ok
		({a: 1, b: 2, c: 3}).should.have.properties("d");           //expected Object { a: 1, b: 2, c: 3 } to have property d
		({a: 1, b: 2, c: 3}).should.have.properties({b: 20});       //expected Object { a: 1, b: 2, c: 3 } to have property b of 20 (got 2)
	} catch (e) {
		console.log(e.message || e);
	}
}

function property() {
	try {
		({a: 1}).should.have.property("a");             //ok
		({a: 1, b: 2}).should.have.property("a", 1);    //ok
		({a: 1, b: 2}).should.have.property("c");       //expected Object { a: 1, b: 2 } to have property c
		({a: 1, b: 2}).should.have.property("a", 10);   //expected Object { a: 1, b: 2 } to have property a of 10 (got 1)
	} catch (e) {
		console.log(e.message || e);
	}
}

function propertyByPath() {
	try {
		({a: {b: 1}}).should.have.propertyByPath("a", "b").eql(1);  //ok
		({a: {b: 1}}).should.have.propertyByPath("a", "b").eql(2);  //expected 1 to equal 2
		({a: {b: {c: 2}}}).should.have.propertyByPath("a", "b", "d").eql(2);//expected Object { a: Object { b: Object { c: 2 } } } to have property by path a, b, d - failed on d
	} catch (e) {
		console.log(e.message || e);
	}
}

function size() {
	try {
		({a: 1}).should.have.size(1);         //ok
		({a: 1, b: 2}).should.have.size(1);   //expected Object { a: 1, b: 2 } 2to have size 1
		[1, 2].should.have.size(2);           //ok
		[1, 2].should.have.size(1);           //expected Array [ 1, 2 ] to have size 1
	} catch (e) {
		console.log(e.message || e);
	}
}

function value() {
	try {
		({a: 1}).should.have.value('a', 1); //ok
		({a: 1}).should.have.value('a', 10); //expected 1 to have key a
		({a: 1}).should.have.value('b', 1); //expected Object { a: 1 } to have key b
		[1, 2, 3].should.have.value(1, 2, 3);
		[1, 2, 3].should.have.value(2); //expected 3 to have key 2
	} catch (e) {
		console.log(e.message || e);
	}
}

function endWith() {
	try {
		"ABC".should.endWith("C");    //ok
		"ABC".should.endWith("c");    //expected 'ABC' to end with with'c'
		"ABC".should.endWith("B");    //expected 'ABC' to end with 'B'
	} catch (e) {
		console.log(e.message || e);
	}
}

function startWith() {
	try {
		'abc'.should.startWith("a");
		'abc'.should.startWith("A");  //expected 'abc' to start with 'A'
		'abc'.should.startWith("b");  //expected 'abc' to start with 'b'
	} catch (e) {
		console.log(e.message || e);
	}
}

function types() {
	var a = function () {
	};
	try {
		[1.2].should.be.Array();    //ok
		should([1, 2]).be.Array();  //ok
		// ({}).should.be.Array();     //expected Object {} to be an array

		true.should.be.Boolean();   //ok
		should(false).be.Boolean(); //ok
		// "".should.be.Boolean();     //expected '' to be a boolean

		new Date().should.be.Date();  //ok
		should(new Date()).be.Date(); //ok
		// new Date().toLocaleString().should.be.Date(); //expected '1/23/2017, 12:09:27 PM' to be a date
		// (+new Date()).should.be.Date(); //expected 1485144592611 to be a date

		new Error().should.be.Error();  //ok
		// "error".should.be.Error();      //expected 'error' to be an error

		a.should.be.Function();   //ok
		should(a).be.Function();  //ok
		// "a".should.be.Function(); //expected 'a' to be a function

		(123).should.be.Number(); //ok
		should(1).be.Number();    //ok
		// "13".should.be.Number();  //expected '13' to be a number

		({}).should.be.Object();    //ok
		[].should.be.Object();      //ok
		// ''.should.be.Object();      //expected '' to be an object

		"asdf".should.be.String();  //ok
		// ({}).should.be.String();    //expected Object {} to be a string

		[].should.be.instanceof(Array);   //ok
		// ({}).should.be.instanceof(Array); //expected Object {} to be an instance of Array

		should(null).be.null();   //ok
		// ({}).should.be.null();    //expected Object {} to be null

		"asdf".should.be.type("string");    //ok
		(123).should.be.type("number");     //ok
		({}).should.be.type("object");      //ok
		[].should.be.type("object");        //ok
		a.should.be.type("function");       //ok

		should(undefined).be.undefined();   //ok
		// "".should.be.undefined();   //expected '' to be undefined
	} catch (e) {
		console.log(e.message || e);
	}
}

