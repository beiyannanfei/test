/**
 * Created by wyq on 2016/7/15.
 */

var chalk = require("chalk");

console.log(chalk.blue("Hello World"));
console.log(chalk.blue('Hello') + ' World' + chalk.red('!'));
console.log(chalk.blue.bgRed.bold('Hello world!'));
console.log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));
console.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));
console.log(chalk.green('I am a green line ' + chalk.blue.underline.bold('with a blue substring') + ' that becomes green again!'));
console.log("======================================");
var error = chalk.bold.red;
console.log(error('Error!'));
console.log("======================================");
var name = 'Sindre';
console.log(chalk.green('Hello %s'), name);