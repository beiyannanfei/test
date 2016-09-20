var _ = require("lodash");

var codelist = [];
payCode:"1234"
console.time("make code");
for (var i = 0; i < 1000; ++i) {
	codelist.push(Math.random().toString().substring(2, 6));
}
console.timeEnd("make code");

console.log(codelist.length);
codelist = _.sortBy(codelist);
codelist = _.uniq(codelist, true);
console.log(codelist.length);


