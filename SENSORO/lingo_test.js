/**
 * Created by sensoro on 16/8/17.
 */

var lingo = require("lingo");
var en = lingo.en;

console.log(en.pluralize("fox"));   //=>foxes 转换为复数形式

console.log(en.singularize("foxes")); //=>fox 转换为单数形式

console.log(en.isPlural("foxes"), en.isPlural("fox"));  //true false  判断是不是复数形式

console.log(en.isSingular("foxes"), en.isSingular("fox"));  //false true  判断是不是单数形式

console.log(lingo.capitalize('hello there')); //Hello there  将首字母大写

console.log(lingo.capitalize('hello there', true)); //Hello There  将每个单词的首字母都大写

console.log(lingo.camelcase('foo bar baz'));  //fooBarBaz

console.log(lingo.camelcase('foo bar baz', true));  //FooBarBaz

console.log(lingo.join(['fruits', 'veggies', 'sugar']));  //fruits, veggies and sugar

console.log(lingo.join(['fruits', 'veggies', 'sugar'], 'or'));  //fruits, veggies or sugar

