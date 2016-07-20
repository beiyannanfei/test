//var regexp = /^is/gm;
var regexp = /dog$/gm;
var data = 'is a like\nis a catdog\ndonot a dog';

console.log( data.replace(regexp, '-') );