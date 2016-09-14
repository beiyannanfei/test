var Rx = require('rx');

var observable = Rx.Observable.create(function (observer) {
	observer.onNext(1);
	observer.onNext(2);
	observer.onNext(3);
	setTimeout(() => {
		observer.onNext(4);
		observer.onCompleted();
	}, 1000);
});

console.log('just before subscribe ');
observable.subscribe(function (x) {
	console.log(x);
});
console.log('just after subscribe ');

