/**
 * Created by wyq on 2015/11/26.
 */
var _ = require("underscore");

var realPath = require.resolve("underscore");   //解析一个模块名到它的绝对路径
console.log("%j\n================================", realPath);

var mainModule = require.main;  //主模块
console.log(mainModule);
console.log("====================================");

var rCache = require.cache;     //所有缓存好的模块
console.log(_.keys(rCache));
console.log("====================================");

var exten = require.extensions;     //根据其扩展名，对于每个有效的文件类型可使用的编制方法
console.log(exten);
console.log("====================================");

var resolve = require.resolve("underscore");
console.log(resolve);

