global.Promise = require('bluebird');

Promise.all([test(1), test(2), test(3)]).spread((v1, v2, v3)=> {
	console.log(v1, v2, v3);
	return Promise.all([test(4), test(5)]);
}).spread((v1, v2) => {
	console.log(v1, v2);
}).catch(err => {
});

function test(num) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, 1000, num);
	});
}






