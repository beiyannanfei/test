/**
 * Created by wyq on 17/8/18.
 */
const EventEmitter = require('events');

function t1() {
	let emitter = new EventEmitter();

	emitter.on('myEvent', () => {
		console.log('hi 1');
	});

	emitter.on('myEvent', () => {
		console.log('hi 2');
	});

	emitter.emit('myEvent');  //hi 1   hi 2
}

function t2() {
	let emitter = new EventEmitter();

	emitter.on('myEvent', () => {
		console.log('hi');
		emitter.emit('myEvent');
	});

	emitter.emit('myEvent');    //死循环
}

function t3() {
	let emitter = new EventEmitter();

	emitter.on('myEvent', function sth() {
		emitter.on('myEvent', sth);
		console.log('hi');
	});

	emitter.emit('myEvent');    //只会输出一个hi
}

t3();

