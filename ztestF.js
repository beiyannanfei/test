function _filter() {
	let arr1 = [1, 2, 3, 10, 20, 30];
	let arr2 = arr1.filter(item => item < 10);
	console.log(arr1, arr2);
}
_filter();