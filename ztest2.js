var _ = require("underscore");

var fileName = __filename;
console.log(fileName);
var file = fileName.substring(_.lastIndexOf(fileName, "/") + 1, _.lastIndexOf(fileName, "."));
console.log(file);
