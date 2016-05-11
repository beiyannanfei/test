/**
 * Created by wyq on 2015/8/14.
 */
var _ = require("underscore");

//对一个乱序的数组先排序再去重要比直接去重开将近100倍
var testArr = [];

for (var index = 0; index < 1000000; ++index) {
//    testArr.push(parseInt(Math.random() * 10000));
    testArr.push(index);
}
testArr = _.shuffle(testArr);   //打乱
console.log("testArr length: %j", testArr.length);

console.time("unip");
testArr = _.sortBy(testArr);    //先排序
testArr = _.uniq(testArr, true);    //再去重
console.timeEnd("unip");

console.log("testArr length: %j", testArr.length);
