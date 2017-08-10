/**
 * Created by wyq on 17/8/10.
 */
function t1() {
	let s = Symbol();
	console.log(typeof s);  //symbol
}

function t2() {
	let s1 = Symbol("foo");
	let s2 = Symbol("bar");
	console.log(s1, s2);    //Symbol(foo) Symbol(bar)
	console.log(s1.toString(), s2.toString());  //Symbol(foo) Symbol(bar)
}

function t3() {
	let s1 = Symbol();
	let s2 = Symbol();
	console.log(s1 === s2); //false  Symbol函数的参数只是表示对当前 Symbol 值的描述，因此相同参数的Symbol函数的返回值是不相等的

	let s3 = Symbol("foo");
	let s4 = Symbol("foo");
	console.log(s3 === s4); //false
}

function t4() {
	let sym = Symbol("My symbol");
	try {
		console.log(`your symbol is ${sym}`); //Symbol 值不能与其他类型的值进行运算
	} catch (e) {
		console.log("e: %j", e.message || e); //e: "Cannot convert a Symbol value to a string"
	}
	console.log(`your symbol is ${sym.toString()}`);  //your symbol is Symbol(My symbol)    Symbol 值可以显式转为字符串
}

function t5() {
	let mySymbol0 = Symbol();
	let a = {
		[mySymbol0]: "hello"        //作为属性名的 Symbol
	};
	let mySymbol1 = Symbol();
	a[mySymbol1] = "world";       //作为属性名的 Symbol
	console.log(a[mySymbol0], a[mySymbol1]);    //hello world
}

function t6() {
	let mySymbol = Symbol();
	let a = {};
	a.mySymbol = "hello";   //注意，Symbol 值作为对象属性名时，不能用点运算符。
	console.log(a[mySymbol]);     //undefined
	console.log(a['mySymbol']);   //hello
}

function t7() {
	let obj = {};
	let a = Symbol("a");
	let b = Symbol("b");
	obj[a] = "h";
	obj[b] = "w";

	//Symbol 作为属性名，该属性不会出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。但是，它也不是私有属性，有一个Object.getOwnPropertySymbols方法，可以获取指定对象的所有 Symbol 属性名。
	//Object.getOwnPropertySymbols方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
	let objSymbolKeys = Object.getOwnPropertySymbols(obj);
	console.log("objSymbolKeys length = %j", objSymbolKeys.length);   //objSymbolKeys length = 2
	console.log("objSymbolKeys[0] = %s", objSymbolKeys[0].toString());  //objSymbolKeys[0] = Symbol(a)
	console.log("objSymbolKeys[1] = %s", objSymbolKeys[1].toString());  //objSymbolKeys[1] = Symbol(b)
	console.log("obj[objSymbolKeys[0]] = %j", obj[objSymbolKeys[0]]);   //obj[objSymbolKeys[0]] = "h"
}

function t8() {
	let obj = {
		[Symbol('my_key')]: 1,
		enum: 2,
		nonEnum: 3
	};
	let allKeys = Reflect.ownKeys(obj); //Reflect.ownKeys方法可以返回所有类型的键名，包括常规键名和 Symbol 键名
	console.log(allKeys);//[ 'enum', 'nonEnum', Symbol(my_key) ]
	for (let index of allKeys) {
		console.log("index: %s, value: %j", index || index.toString(), obj[index]);
		//index: enum, value: 2		index: nonEnum, value: 3		index: Symbol(my_key), value: 1
	}
}

function t9() {
	let s1 = Symbol.for("foo"); //有时，我们希望重新使用同一个Symbol值，Symbol.for方法可以做到这一点
	let s2 = Symbol.for("foo");
	console.log(s1 === s2);     //true    s1和s2都是 Symbol 值，但是它们都是同样参数的Symbol.for方法生成的，所以实际上是同一个值
}

function t10() {
	let s1 = Symbol.for("foo");
	let key = Symbol.keyFor(s1);    //Symbol.keyFor方法返回一个已登记的 Symbol 类型值的key。
	console.log("key = %j", key);   //key = "foo"

	let s2 = Symbol("foo");
	let key2 = Symbol.keyFor(s2);   //变量s2属于未登记的Symbol值
	console.log("key2 = %j", key2); //key2 = undefined
}


