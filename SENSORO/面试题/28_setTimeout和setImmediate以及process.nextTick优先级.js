/**
 * Created by wyq on 18/1/10.
 */
setImmediate(function () {
	console.log('1');
});

setTimeout(function () {
	console.log('2');
}, 0);

process.nextTick(function () {
	console.log('3');
});
//process.nextTick > setTimeout > setImmediate