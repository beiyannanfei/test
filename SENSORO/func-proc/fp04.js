//Point Free  不要命名转瞬即逝的中间变量

var compose = function (f, g) {
	return function (x) {
		return f(g(x));
	}
};

var toUpperCase = function (word) {
	return word.toUpperCase();
};

var split = function (x) {
	return function (str) {
		return str.split(x);
	}
};

var f = compose(split(' '), toUpperCase);
console.log(f("abcd efgh"));