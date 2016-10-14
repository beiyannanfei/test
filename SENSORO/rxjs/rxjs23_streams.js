"use strict";
var Rx = require("rx");

var streamA$ = Rx.Observable.of(2);
var streamB$ = Rx.Observable.of(4);

var streamC$ = Rx.Observable.concat(streamA$, streamB$).reduce((x, y) => x + y);

streamC$.subscribe(console.log);
streamA$ = Rx.Observable.of(2, 10);
streamC$.subscribe(console.log);