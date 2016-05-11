/**
 * Created by wyq on 2015/11/30.
 */
var _ = require("lodash");

console.log(_.chunk(['a', 'b', 'c', 'd'], 2));
// → [['a', 'b'], ['c', 'd']]

console.log(_.chunk(['a', 'b', 'c', 'd'], 3));
// → [['a', 'b', 'c'], ['d']]

console.log(_.compact([0, 1, false, 2, '', 3]));
// → [1, 2, 3]

console.log(_.difference([1, 2, 3], [4, 2]));
// → [1, 3]

console.log(_.drop([1, 2, 3]));
// → [2, 3]

console.log(_.drop([1, 2, 3], 2));
// → [3]

console.log(_.drop([1, 2, 3], 5));
// → []

console.log(_.drop([1, 2, 3], 0));
// → [1, 2, 3]

console.log(_.dropRight([1, 2, 3]));
// → [1, 2]

console.log(_.dropRight([1, 2, 3], 2));
// → [1]

console.log(_.dropRight([1, 2, 3], 5));
// → []

console.log(_.dropRight([1, 2, 3], 0));
// → [1, 2, 3]

console.log(_.flatten([1, [2, 3, [4]]], true));
// → [ 1, 2, 3, 4 ]

console.log(_.intersection([1, 2], [4, 2], [2, 1]));
// → [2]

console.log(_.last([1, 2, 3]));
// → 3

console.log(_.zipObject([['fred', 30], ['barney', 40]]));
// → { 'fred': 30, 'barney': 40 }

console.log(_.zipObject(['fred', 'barney'], [30, 40]));
// → { 'fred': 30, 'barney': 40 }

console.log(_.zip(['fred', 'barney'], [30, 40], [true, false]));
// → [['fred', 30, true], ['barney', 40, false]]

console.log(_.xor([1, 2], [4, 2]));
// → [1, 4]

console.log(_.without([1, 2, 1, 3], 1, 2));
// → [3]

console.log(_.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x'));
// → [{ 'x': 1 }, { 'x': 2 }]

console.log(_.union([1, 2], [4, 2], [2, 1]));
// → [1, 2, 4]

console.log(_.uniqueId('contact_'));
// → 'contact_104'

console.log(_.uniqueId());
// → '105'

for (; ;) {
	console.log("************: %j", _.uniqueId('contact_'));
}






































































