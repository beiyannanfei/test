/**
 * Created by sensoro on 16/8/18.
 */
var _ = require("lodash");

// console.log(_.zipObject([['fred', 30], ['barney', 40]]));   //{ fred: 30, barney: 40 }

// console.log(_.size([1, 2, 3, 4]), _.size({a: 1, b: 2, c: 3, d: 4}), _.size("asdfe"));

/*function aaaa(text) {
 console.log(text);
 }
 _.delay(aaaa, 1000, "test");*/

//test

/*var a  = {
 status: 10
 };
 console.log(_.isNumber(a.status));*/

/*
 var a = {a: 10};
 var b = {b: 20};
 var c = {c: 30};

 var d = _.extend({}, a, b, c);

 console.log(a);
 console.log(b);
 console.log(c);
 console.log(d);*/
/*
 var a = {a: 10, b: 20, c: 30};

 console.log(a);
 var b = _.pick(a, function(value, key, object) {
 return key != 'a';
 });

 console.log(b);
 console.log(a);

 var c;

 console.log(_.isNull(c));

 console.log(_.isUndefined(c));*/


/*var a = {a: 10};
 console.log(a);
 console.log(_.extend(a, {a: 11, b: 22}));
 console.log(a);*/

var a = ['a', 'b', 'c', 'd', 'e'];
var b = ['b', 'd', 'f'];
console.log(_.difference(a, b));
console.log(a);
console.log(b);

