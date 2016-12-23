/**
 * Created by wyq on 16/12/23.
 */

var list = [1, 2, 3, 4];
list.map(function (cv, index, arr) {
	console.log(cv, index, arr, this);
}, {a: 10, b: 20});

/* out
 1 0 [ 1, 2, 3, 4 ] { a: 10, b: 20 }
 2 1 [ 1, 2, 3, 4 ] { a: 10, b: 20 }
 3 2 [ 1, 2, 3, 4 ] { a: 10, b: 20 }
 4 3 [ 1, 2, 3, 4 ] { a: 10, b: 20 }
*/
