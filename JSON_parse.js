/**
 * Created by wyq on 2015/8/10.
 */
var _ = require("underscore");

var testMap = {aaa: 10, bbb: 20};

console.log("testMap: %j", testMap);

var strMap = JSON.stringify(testMap);

console.log("strMap: %j", strMap);

JSON.parse(strMap, function(key, val) {
    console.log("key: %j, val: %j", key, val);
});