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

/*var a = ['a', 'b', 'c', 'd', 'e'];
 var b = ['b', 'd', 'f'];
 console.log(_.difference(a, b));
 console.log(a);
 console.log(b);*/

/*var a = ['awdf', 'werg', 'awaf', 'werg', 'zaqwfr', 'gasda'];
 var b = _.sortBy(a);
 console.log(b);
 var c = _.uniq(b);
 console.log(c);*/

/*var a = "asdf";
 console.log(a);
 if (_.isString(a)) {
 a = [a];
 }
 console.log(a);*/

/*var a = {};
 console.log(a);
 var b = _.values(a);
 console.log(b);*/

/*var a = [1, 2, 3];
 var b = _.map(a, item => {
 t: item
 });

 console.log(b);*/

/*var f = _.property("length");
 console.log(f("asdf"));
 console.log("asdf"["length"]);*/
/*
 var a = [
 {a: 10}, {b: 20}, {a: 30}
 ];

 var b = _.pluck(a, 'a');
 console.log(b);
 b = _.compact(b);
 console.log(b);*/

/*var a = [["a", 10], ["b", 20], ["c", 30]];
 console.log(_.zipObject(a));*/

/*var a = [1, 2, 3];
 var b = [3, 4, 5];

 console.log(_.intersection(a, b));*/

/*let a = {a: 1, b: 2};
 let b = {b: 20, c: 30};
 console.log(a);
 console.log(b);
 let c = _.assign(a, b);
 console.log(a);
 console.log(b);
 console.log(c);*/

var a = {a: 10, b: 20};
console.log(a);
var b = _.omit(a, "b");
console.log(a);
console.log(b);





