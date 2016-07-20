//var regexp = /is/g;
//var regexp = /\bis\b/g;
var regexp = /\Bis\B/g;

var data = 'His name is is\nhistory isnot is';

console.log(  data.replace(regexp, '-')  );

