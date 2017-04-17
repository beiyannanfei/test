/**
 * Created by wyq on 17/4/17.
 * curly -- 要求您始终在循环和条件中的块周围放置花括号
 */

/* jshint curly: true */
if (true)
	console.log("hello"); //04_curly.js: line 8, col 5, Expected '{' and instead saw 'console'.

for (var i = 0; i < 10; ++i)
	console.log(i); //04_curly.js: line 11, col 5, Expected '{' and instead saw 'console'.