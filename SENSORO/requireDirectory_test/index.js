/**
 * Created by sensoro on 16/8/17.
 */

'use strict';

const models = require('require-directory')(module);

console.log(models);
console.log(Object.keys(models));
Object.keys(models).forEach(function (key) {
	global[key] = models[key];
});

console.log(global);
console.log(GLOBAL);
console.log(global == GLOBAL);
console.log(foo1.aaa);

