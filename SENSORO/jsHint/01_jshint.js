/**
 * Created by wyq on 17/4/8.
 */
// npm install jshint -g    首先全局安装jshint
// jshint a.js 检测

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
* notypeof -- 此选项禁止关于无效typeof操作员值的警告, 不要使用此选项，除非您绝对不要这些检查。
* predef -- 此选项允许您控制JSHint认为在环境中隐式定义的变量
* quotmark -- 警告此选项已被弃用，此选项强制执行整个代码中使用的引号的一致性。它接受三个值：true如果您不想强制执行一个特定的样式，但希望一些一致性，"single"如果您只允许单引号，并且"double"只允许双引号。
* shadow -- 此选项禁止关于变量阴影的警告，即声明已经声明在外部范围内的某个变量。inner|outer|false|true
* singleGroups -- 此选项禁止在不严格要求的情况下使用分组运算符。
* strict -- 此选项要求代码以ECMAScript 5的严格模式运行。global|implied|false|true
* undef -- 此选项禁止使用明确未声明的变量。
* unused -- 此选项会在您定义并且不使用变量时发出警告。
* varstmt -- 设置为true时，禁止使用var声明变量。
* asi -- 此选项禁止关于缺少分号的警告。
* boss -- 在预期比较的情况下，此选项禁止关于使用分配的警告。通常，代码if (a = 10) {}就是打字错误。
* debug -- 此选项禁止对debugger代码中的语句的警告。
* elision -- 此选项告诉JSHint您的代码使用ES3数组elision元素或空元素（例如[1, , , 4, , , 7]）。
* eqnull -- 此选项禁止有关== null比较的警告。当您要检查变量是否为null或时，这种比较通常很有用 undefined。
* esnext -- 警告此选项已被弃用，这个选项告诉JSHint你的代码使用ECMAScript 6的具体语法。
* evil -- 此选项禁止使用警告eval
* expr -- 此选项禁止关于使用表达式的警告，通常您希望看到分配或函数调用。
* globalstrict -- 警告此选项已被弃用，此选项禁止关于使用全局严格模式的警告。
* lastsemic -- 此选项禁止关于缺少分号的警告，但仅当在单行块中为最后一个语句省略分号时
* laxbreak -- 警告此选项已被弃用，此选项禁止大多数关于代码中可能不安全的换行符的警告。
* laxcomma -- 警告此选项已被弃用，此选项禁止关于逗号优先编码风格的警告
* loopfunc -- 此选项禁止关于循环内的函数的警告。
* moz -- 这个选项告诉JSHint你的代码使用Mozilla JavaScript扩展。除非您专门为Firefox Web浏览器开发，否则不需要此选项。
* multistr -- 警告此选项已被弃用，此选项禁止关于多行字符串的警告。
* noyield -- 此选项禁止关于生成器函数的警告，其中没有 yield语句。
* plusplus -- 此选项禁止使用一元递增和递减运算符。有些人认为，++和--降低他们的编码风格的质量和有编程语言，如Python，完全没有去这些运营商。
* proto -- 此选项禁止关于__proto__属性的警告。
* scripturl -- 此选项可抑制关于使用脚本定位的URL的警告
* sub -- 警告此选项已被弃用，该选项可以抑制使用[]符号表示法时使用符号的警告：person['name']对person.name。
* supernew -- 此选项禁止关于“奇怪”结构的警告，如 new function () { ... }和new Object;。这样的结构有时用于在JavaScript中生成单例
* validthis -- 当代码以严格模式运行并且this在非构造函数中使用时，此选项可抑制关于可能的严重违规的警告。
* withstmt -- 此选项禁止关于使用语句的警告with。语句的with语义可能会导致开发人员之间的混乱和全局变量的意外定义。
* browser -- 这个选项定义了全新的浏览器暴露的全局变量：从旧的document，navigatorHTML5的FileReader和浏览器世界的其他新发展。
* browserify -- 当使用Browserify工具构建项目时，此选项可定义全局变量。
* couch -- 此选项定义CouchDB公开的全局变量 。CouchDB是一个面向文档的数据库，可以使用JavaScript以MapReduce方式进行查询和索引。
* devel -- 该选项定义通常用于记录，穷人的调试全局
* dojo -- 此选项定义Dojo Toolkit公开的全局变量。
* jasmine -- 此选项定义了由the Jasmine unit testing framework 公开的全局变量。
* jquery -- 此选项定义由jQuery JavaScript库公开的全局变量。
* mocha -- 此选项定义由摩卡单元测试框架的“BDD”和“TDD”UI公开的全局变量 。
* module -- 该选项通知JSHint输入代码描述了ECMAScript 6模块。所有模块代码被解释为严格模式代码。
* mootools -- 此选项定义MooTools JavaScript框架公开的全局变量 。
* node -- 当您的代码在Node运行时环境中运行时，此选项可定义全局变量。Node.js是使用异步事件驱动模型的服务器端JavaScript环境。
* nonstandard -- 此选项定义非标准但广泛采用的全局变量，如 escape和unescape。
* phantom -- 当您的核心运行在PhantomJS运行时环境中时，此选项可定义全局变量。
* prototypejs -- 此选项定义了由Prototype JavaScript框架公开的全局变量 。
* qunit -- 该选项定义了由QUnit单元测试框架公开的全局变量。
* rhino -- 当您的代码在Rhino运行时环境中运行时，此选项可定义全局变量。
* shelljs -- 此选项定义由ShellJS库公开的全局变量。
* typed -- 此选项为类型化的数组构造函数定义全局变量。
* worker -- 当您的代码在Web Worker内运行时，此选项可定义全局变量。
* wsh -- 当您的代码作为Windows脚本宿主的脚本运行时，此选项可定义全局变量。
* yui -- 此选项定义由YUI JavaScript框架公开的全局变量。
* */

