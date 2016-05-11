/**
 * Created by wyq on 2015/8/12.
 */
var _ = require("underscore");

var test = {
    key: /^[0-9]{0,2}$/
};

_.map(test, function (val, key) {
    if (val instanceof RegExp) {
        test[key] = new String(val);
        test[key] = test[key].substring(1, test[key].length-1);
    }
});
test = JSON.stringify(test);
console.log(test);
test = JSON.parse(test);
console.log(test);
test.key = new RegExp(test.key);
console.log(test);
console.log(typeof test.key);
console.log(test.key instanceof RegExp);


