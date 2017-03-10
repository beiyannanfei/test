/**
 * Created by sensoro on 16/8/17.
 */

var path = require("path");

console.log(path.normalize('/f/e//d'));   //   输出   /f/e/d
console.log(path.normalize('.f/e/d/'));    //   输出   /f/e/d/
console.log(path.normalize('/f/e/d/..')); //   输出   /f/e
console.log(path.normalize('/f/e/d/.'));  //   输出   /f/e/d

console.log(path.join('/f', 'e', 'd/c', '..'));   // 输出  /f/e/d

console.log(path.dirname('/f/e/d'));     // 输出 /f/e

console.log(path.basename('/f/e/d'));     //  输出 d

console.log(path.extname('/f/e/d.html'));     //输出  .html
console.log(path.extname('/f/e/d/.'));           //输出  ''

console.log('foo/bar/baz'.split(path.sep));   // *nix 返回['foo', 'bar', 'baz']
console.log('foo\\bar\\baz'.split(path.sep));  //windows 返回 ['foo', 'bar', 'baz']

console.log(path.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile')); //out /tmp/subfile


//相对路径 path.relative(from, to)特点：返回某个路径下相对于另一个路径的相对位置串，
// 相当于：path.resolve(from, path.relative(from, to)) == path.resolve(to)
console.log(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb')); //out ../../impl/bbb

console.log(path.basename('/foo/bar/baz/asdf/quux.html'));  //out quux.html
console.log(path.basename('/foo/bar/baz/asdf/quux.html', '.html')); //out quux

console.log(path.delimiter);
console.log(process.env.PATH);
console.log(process.env.PATH.split(path.delimiter));

console.log(path.isAbsolute('E:/github/nodeAPI/abc/efg'));
console.log(path.isAbsolute('/temp/../..'));
console.log(path.isAbsolute('../testFiles/secLayer'));

var uri = "/sfd/ewqdf/abcd.js";
console.log(path.basename(uri, path.extname(uri)));
