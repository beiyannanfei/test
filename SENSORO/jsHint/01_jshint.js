/**
 * Created by wyq on 17/4/8.
 */
// npm install jshint -g    首先全局安装jshint

function test() {
	var a = 1;
	var b = 2;
	if (a !== b) {
		console.log("sdf");
	}
}
test();

/*
* bitwise -- 禁止使用按位运算符，例如^（XOR）， |（OR）等。按位运算符在JavaScript程序中是非常罕见的，通常&只是一个错误的&&。
* camelcase -- 允许您强制所有变量名称使用camelCase样式或UPPER_CASE与下划线。
* curly -- 要求您始终在循环和条件中的块周围放置花括号。
* enforceall -- 警告此选项已被弃用,启用所有强制选项，并禁用在该版本中定义的所有放松选项
* eqeqeq -- 禁止使用==和!=赞成===和 !==
* es3 -- 警告此选项已被弃用,JSHint您的代码需要遵守ECMAScript 3规范
* es5 -- 警告此选项已被弃用,启用ECMAScript 5.1规范中首先定义的语法
* esversion -- 此选项用于指定代码必须遵守的ECMAScript版本。它可以采用以下值之一: 3、5、6
* forin -- 此选项需要所有for in循环来过滤对象的项目。for语句允许循环遍历对象的所有属性的名称，包括通过原型链继承的属性
* freeze -- 此选项禁止覆盖原生对象的原型，例如 Array，Date等等
* funcscope -- 此选项禁止在控制结构中声明变量的警告，同时从外部访问它们
* futurehostile -- 此选项启用有关使用未来版本的JavaScript中定义的标识符的警告
* globals -- 此选项可用于指定未在源代码中正式定义的全局变量的白名单。当与undef选项结合使用时，这是最有用的，以消除对项目特定的全局变量的警告。
* immed -- 警告此选项已被弃用,此选项禁止使用即时函数调用，而不将其包装在括号中。
* indent -- 警告此选项已被弃用，此选项为您的代码设置特定的选项卡宽度。
* iterator -- 此选项禁止关于__iterator__属性的警告。所有浏览器不支持此属性，因此请仔细使用。
* latedef -- 此选项禁止在定义之前使用变量。
* maxcomplexity -- 此选项可让您控制整个代码中的循环复杂性。循环复杂度通过程序的源代码测量线性独立路径的数量。
* maxdepth -- 此选项可让您控制如何嵌套您想要的块
* maxerr -- 此选项允许您设置JSHint在放弃之前将产生的警告的最大量。默认值为50。
* maxlen -- 警告此选项已被弃用，此选项允许您设置一行的最大长度。
* maxparams -- 此选项允许您设置每个功能允许的形式参数的最大数量
* maxstatements -- 此选项允许您设置每个函数允许的最大语句数量
* newcap -- 警告此选项已被弃用，此选项要求您大写构造函数的名称。
* noarg -- 此选项禁止使用arguments.caller和 arguments.callee
* nocomma -- 此选项禁止使用逗号运算符。
* noempty -- 警告此选项已被弃用,当您的代码中有一个空的块时，此选项会发出警告。
* nonbsp -- 此选项警告“不间断空白”字符。
* nonew -- 此选项禁止使用构造函数的副作用。有些人喜欢调用构造函数而不将其结果分配给任何变量,new MyConstructor();
* notypeof
* predef
* quotmark
* shadow
* singleGroups
* strict
* undef
* unused
* varstmt
* asi
* boss
* debug
* elision
* eqnull
* esnext
* evil
* expr
* globalstrict
* lastsemic
* laxbreak
* laxcomma
* loopfunc
* moz
* multistr
* noyield
* plusplus
* proto
* scripturl
* sub
* supernew
* validthis
* withstmt
* browser
* browserify
* couch
* devel
* dojo
* jasmine
* jquery
* mocha
* module
* mootools
* node
* nonstandard
* phantom
* prototypejs
* qunit
* rhino
* shelljs
* typed
* worker
* wsh
* yui
 * */

